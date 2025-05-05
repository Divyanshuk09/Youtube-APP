import { asyncHandler } from "../utils/asyncHandler.js"; // Utility to handle async functions and errors
import { ApiError } from "../utils/apiError.js"; // Custom error class for API errors
import { ApiResponse } from "../utils/apiResponse.js" // Custom response class for API responses
import { User } from "../models/user.model.js"; // Import User model to interact with the database
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"; // Utility for uploading files to Cloudinary
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Function to generate access and refresh tokens for a user
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId) // Find the user by their ID
        const accessToken = user.generateAccessToken() // Generate an access token for the user
        const refreshToken = await user.generateRefreshToken() // Generate a refresh token for the user

        // console.log(accessToken, refereshToken);
        user.refreshToken = refreshToken // Set the refresh token in the user record
        await user.save({ validateBeforeSave: false }); // Save the user without validating the password

        return { accessToken, refreshToken }; // Return both tokens

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generate refresh and access token") // Handle any errors that occur
    }
}

// Register a new user function
export const registerUser = asyncHandler(async (req, res) => {
    console.log("📥 Incoming request body of registerUser:", req.body); // Log the incoming request data

    /*
    Steps:
    1️⃣ Extract user details from the request body.
    2️⃣ Validate that required fields are not empty.
    3️⃣ Check if the user already exists in the database.
    4️⃣ Validate and process uploaded images (avatar, cover image).
    5️⃣ Upload images to Cloudinary.
    6️⃣ Create a new user record in the database.
    7️⃣ Remove sensitive data (password, refreshToken) from the response.
    8️⃣ Ensure the user was successfully created.
    9️⃣ Send a response with user details.
    */

    const { username, email, channelName, password } = req.body; // Destructure user details from the request body
    console.log("✏️ Extracted fields - Username:", username, "Email:", email, "channelName:", channelName); // Log the extracted details

    if ([channelName, email, username, password].some((field) => field?.trim() === "")) { // Check if any field is missing or empty
        console.log("❌ Validation failed: Missing required fields");
        throw new ApiError(400, "All fields are required");
    }

    console.log(`🔍 Checking if user exists with email: ${email} or username: ${username}`); // Log the search operation

    const existedUser = await User.findOne(
        {
            $or: [{ username }, { email }]
        });

    if (existedUser) { // If the user already exists
        console.log("⚠️ User already exists:", existedUser); // Log the existing user
        throw new ApiError(409, "User with this email or username already exists");
    }

    console.log("📂 Uploaded files:", req.files); // Log uploaded files to the console for debugging

    const avatarlocalpath = req.files?.avatar?.[0]?.path; // Get the local path of the avatar image from the request
    const coverimagelocalpath = req.files?.coverImage?.[0]?.path; // Get the local path of the cover image (if provided)
    console.log("🖼️ Avatar Path:", avatarlocalpath, "Cover Image Path:", coverimagelocalpath);

    if (!avatarlocalpath) { // If no avatar file is provided
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarlocalpath); // Upload the avatar image to Cloudinary and get the URL
    const coverImage = coverimagelocalpath ? await uploadOnCloudinary(coverimagelocalpath) : null; // Upload cover image if it exists

    if (!avatar) { // If avatar upload fails
        throw new ApiError(500, "Failed to upload avatar");
    }

    const user = await User.create({
        channelName,
        avatar: avatar.url, // Store avatar URL in the user record
        coverImage: coverImage?.url || "", // Store cover image URL if it exists, otherwise store an empty string
        email,
        password,
        username: username.toLowerCase() // Ensure the username is stored in lowercase
    });

    const createduser = await User.findById(user._id).select("-password -refreshToken"); // Select the user record without password and refreshToken fields

    if (!createduser) { // If the user wasn't created successfully
        throw new ApiError(500, "Something went wrong while registering the user"); // Throw an error indicating the user registration failed
    }

    res.status(201).json(
        new ApiResponse(
            201,
            createduser,
            "User registered successfully"
        )
    );
});

// Login user function
export const loginUser = asyncHandler(async (req, res) => {
    console.log("📥 Incoming request body of loginUser:", req.body);

    /*
        Steps:
        1️⃣ Validate request input.
        2️⃣ Check if the user exists in the database.
        3️⃣ Verify password correctness.
        4️⃣ Generate access and refresh tokens.
        5️⃣ Set authentication tokens in HTTP cookies.
        6️⃣ Send response with user details.
    */

    const { username, email, password } = req.body; // Destructure the login credentials from the request body
    console.log(`🛠 Extracted input - Username: ${username}, Email: ${email}`);

    if (!(username || email)) { // Check if either username or email is provided
        console.error("❌ Validation Error: username or email is required");
        throw new ApiError(400, "username or email is required!");
    }

    console.log(`🔍 Searching for user with username: ${username} or email: ${email}`);
    const user = await User.findOne({
        $or: [{ username }, { email }] // Find user by either username or email
    });

    if (!user) { // If the user doesn't exist
        console.error("❌ User not found!");
        throw new ApiError(404, "User doesn't exist");
    }
    console.log("✅ User found:", user);

    console.log("🔑 Verifying password...");
    const isPasswordMatches = await user.isPasswordCorrect(password); // Compare the provided password with the stored password

    if (!isPasswordMatches) { // If the passwords don't match
        console.error("❌ Password mismatch!");
        throw new ApiError(401, "Password is incorrect");
    }
    console.log("✅ Password verified");

    // Generate access and refresh tokens for the logged-in user
    console.log("🔄 Generating access and refresh tokens...");
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    console.log("✅ Tokens generated successfully");

    console.log(`📌 Fetching user details for response, userId: ${user._id}`);
    const loggedinUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true, // Ensure cookies are only accessible via HTTP, not JavaScript
        secure: true // Ensure cookies are sent only over HTTPS
    };

    console.log("🚀 Sending response...");
    return res
        .status(200)
        .cookie("accessToken", accessToken, options) // Set the access token cookie
        .cookie("refreshToken", refreshToken, options) // Set the refresh token cookie
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedinUser, accessToken, refreshToken // Send the user data along with tokens
                },
                "User logged in successfully." // Success message
            )
        );
});

// Logout user function
export const logOutUser = asyncHandler(async (req, res) => {
    console.log(`🔄 Logging out user with ID: ${req.user._id}`);

    // Remove the refreshToken from the user's record
    console.log("🗑 Removing refreshToken...");
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: { refreshToken: undefined } // Set refreshToken to undefined
        },
        {
            new: true // Return the updated user record
        });

    console.log("✅ refreshToken removed");

    const options = {
        httpOnly: true, // Ensure cookies are only accessible via HTTP
        secure: true // Ensure cookies are sent only over HTTPS
    };

    console.log("🚀 Clearing cookies and sending response...");
    // Clear cookies and send a logout response
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User Logged Out"
            )
        );
});

// refreshAccessaToken function
export const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        console.log("🔄 Refreshing access token...");

        // Retrieve the refresh token from cookies or request body
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        console.log("📝 Incoming refreshToken:", incomingRefreshToken);

        // Check if refresh token is provided
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized request: Refresh token is required");
        }

        // Verify the refresh token
        let decodedToken;
        try {
            decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
            console.log("📝 Decoded refreshToken:", decodedToken);
        } catch (error) {
            throw new ApiError(401, "Invalid or expired refresh token");
        }

        // Fetch user from the database based on the decoded token
        const user = await User.findById(decodedToken?._id);
        console.log("📝 User found:", user);

        // If user doesn't exist, return an error
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        // Check if the refresh token matches the stored token
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token doesn't match the saved refresh token");
        }

        // Generate new access and refresh tokens
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        // Set cookie options for HTTP only and secure transfer
        const options = {
            httpOnly: true, // Prevents access to cookies via JavaScript
            secure: true,   // Ensures cookies are sent only over HTTPS
        };

        // Send the new tokens in cookies and response body
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access Token Refreshed Successfully"
                )
            );
    } catch (error) {
        // Handle unexpected errors
        console.error("❌ Error during token refresh:", error);
        throw new ApiError(500, "Something went wrong while refreshing access token");
    }
});

//changecurrentpasswordwithnewpassword
export const changeCurrentPasswordWithNewPassword = asyncHandler(async (req, res) => {
    console.log("🔒 Changing current password with new password");
    // console.log("response body",req.body)
    const { oldPassword, newPassword } = req.body;
    console.log(`🛠 Extracted input - Current Password: ${oldPassword}, New Password: ${newPassword}`);

    // console.log(User.findById(req.user?._id));
    const user = await User.findById(req.user?._id);
    console.log("📝 User:", user)
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "old password doesn't match");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false })

    console.log("newPassword:", newPassword);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { message: "Password changed successfully" },
                "Password changed successfully"
            )
        )
})

//getting currentuser
export const getcurrentUser = asyncHandler(async (req, res) => {
    console.log("👀 Getting current user")
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current User fetched successfully."
            )
        )
})

//this will update account details 
export const updateAccountDetails = asyncHandler(async (req, res) => {
    console.log("📝 Updating account details")

    const { channelName, email } = req.body;
    console.log("📝 channelName:", channelName);
    console.log("📝 Email:", email);

    if (!channelName || !email) {
        throw new ApiError(400, "Please provide both channelName and email");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                channelName: channelName,
                email: email
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Account details updated Successfully!"
            )
        )
})

//this will update avatar 
export const updateUserAvatar = asyncHandler(async (req, res) => {
    console.log("📸 Updating user avatar")
    const avatarlocalpath = req.file?.path
    console.log("avatarlocalpath", avatarlocalpath);

    if (!avatarlocalpath) {
        throw new ApiError(400, "Avatar file is missing");
    }
    // Fetch the existing user to get the current avatar URL
    const existingUser = await User.findById(req.user?._id);
    if (!existingUser) {
        throw new ApiError(404, "User not found");
    }

    // Delete the existing avatar from Cloudinary if it exists
    if (existingUser.avatar) {
        await deleteFromCloudinary(existingUser.avatar);
        console.log("🗑️ Old avatar deleted from Cloudinary");
    }
    // Upload new avatar to Cloudinary

    const avatar = await uploadOnCloudinary(avatarlocalpath);
    if (!avatar.url) {
        throw new ApiError(400, " Error while uploading avatar");
    }
    console.log("📸 new Avatar uploaded to cloudinary:", avatar.url);

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Avatar updated Successfully!"
            )
        )
})

//this will update coverimage 
export const updateUserCoverImage = asyncHandler(async (req, res) => {
    console.log("📸 Updating user coverImage")
    const CoverImagelocalpath = req.file?.path
    console.log("CoverImagelocalpath", CoverImagelocalpath);

    if (!CoverImagelocalpath) {
        throw new ApiError(400, "coverimage file is missing");
    }

    // Fetch the existing user to get the current cover image URL
    const existingUser = await User.findById(req.user?._id);
    if (!existingUser) {
        throw new ApiError(404, "User not found");
    }

    // Delete the existing cover image from Cloudinary if it exists
    if (existingUser.coverImage) {
        await deleteFromCloudinary(existingUser.coverImage);
        console.log("🗑️ Old cover image deleted from Cloudinary");
    }

    // Upload new cover image to Cloudinary
    const coverImage = await uploadOnCloudinary(CoverImagelocalpath);

    if (!coverImage.url) {
        throw new ApiError(400, " Error while uploading coverImage");
    }
    console.log("📸new coverImage uploaded to cloudinary:", coverImage.url);

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "coverImage updated Successfully!"
            )
        )
})

// This function retrieves the profile of a user channel, including subscriber counts and subscription status
export const getUserChannelProfile = asyncHandler(async (req, res) => {
    console.log("📂 Fetching user channel profile. Request params:", req.params);

    // Extract the username from the request parameters
    const { username } = req.params;

    // Check if the username is provided and valid
    if (!username?.trim()) {
        console.error("❌ Username is missing or invalid.");
        throw new ApiError(400, "Username is missing");
    }

    console.log("🔍 Searching for channel with username:", username.toLowerCase());

    // Use MongoDB aggregation to fetch the channel profile and related subscription data
    const channel = await User.aggregate([
        {
            // Match the user with the provided username
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            // Lookup to find all subscribers of this channel
            $lookup: {
                from: "subscriptions",         // Collection to join 
                localField: "_id",             // Field from the User collection
                foreignField: "channel",       // Field from the Subscription collection 
                as: "subscribers"              // Output array field
            }
        },
        {
            // Lookup to find all channels this user has subscribed to
            $lookup: {
                from: "subscriptions",         // Collection to join
                localField: "_id",             // Field from the User collection
                foreignField: "subscriber",    // Field from the Subscription collection
                as: "subscribedTo"             // Output array field
            }
        },
        {
            // Add additional fields to the result(user)
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"      // Count the number of subscribers
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"     // Count the number of channels this user has subscribed to
                },
                isSubscribed: {
                    // Check if the logged-in user is subscribed to this channel
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] }, // Check if user ID exists in subscribers array
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            // Project only the required fields in the final output
            $project: {
                username: 1,                   // Include username
                channelName: 1,                   // Include full name
                subscriberCount: 1,            // Include subscriber count
                channelsSubscribedToCount: 1,  // Include channels subscribed to count
                isSubscribed: 1,               // Include subscription status
                avatar: 1,                     // Include avatar
                coverImage: 1                  // Include cover image
            }
        }
    ]);

    console.log("📊 Channel data structure:", channel);

    // Check if the channel exists
    if (!channel?.length) {
        console.error("❌ Channel not found for username:", username);
        throw new ApiError(404, "Channel does not exist.");
    }

    console.log("✅ Channel profile fetched successfully:", channel[0]);

    // Return the channel profile as a JSON response
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                channel[0],
                "User channel profile fetched successfully."
            )
        );
});

// This function fetches the watch history of the logged-in user
export const getWatchHistory = asyncHandler(async (req, res) => {
    console.log("📂 Fetching watch history for user:", req.user._id);

    // Use MongoDB aggregation to fetch the user's watch history
    const user = await User.aggregate([
        {
            // Match the logged-in user by their ID
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            // Lookup to fetch the videos in the user's watch history
            $lookup: {
                from: 'videos',                // Collection to join (videos)
                localField: 'watchHistory',    // Field from the User collection
                foreignField: '_id',           // Field from the Video collection
                as: 'watchHistory',            // Output array field
                pipeline: [
                    {
                        // Lookup to fetch the owner details of each video
                        $lookup: {
                            from: 'users',     // Collection to join (users)
                            localField: 'owner', // Field from the Video collection
                            foreignField: '_id', // Field from the User collection
                            as: 'owner',       // Output array field
                            pipeline: [
                                {
                                    // Project only the required owner fields
                                    $project: {
                                        channelName: 1,       // Include full name
                                        username: 1,       // Include username
                                        profilePicture: 1, // Include profile picture
                                        avatar: 1          // Include avatar
                                    }
                                }
                            ]
                        }
                    },
                    {
                        // Replace the owner array with the first element (since it's a one-to-one relationship)
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ]);

    console.log("📊 Watch history data structure:", user[0]?.watchHistory);

    // Return the watch history as a JSON response
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "User's watch history fetched successfully."
            )
        );
});

