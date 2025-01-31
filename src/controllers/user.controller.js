import { asyncHandler } from "../utils/asyncHandler.js"; // Utility to handle async functions and errors
import { ApiError } from "../utils/apiError.js"; // Custom error class for API errors
import { ApiResponce } from "../utils/apiResponse.js"; // Custom response class for API responses
import { User } from "../models/user.model.js"; // Import User model to interact with the database
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Utility for uploading files to Cloudinary
import jwt from "jsonwebtoken";

// Function to generate access and refresh tokens for a user
const genereateAccessAndRefereshTokens = async (userId) => {
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
const registerUser = asyncHandler(async (req, res) => {
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

    // 🔹 Step 1: Extract user details from request
    const { username, email, fullname, password } = req.body; // Destructure user details from the request body
    console.log("✏️ Extracted fields - Username:", username, "Email:", email, "Fullname:", fullname); // Log the extracted details

    // 🔹 Step 2: Validate required fields
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) { // Check if any field is missing or empty
        console.log("❌ Validation failed: Missing required fields");
        throw new ApiError(400, "All fields are required");
    }

    // 🔹 Step 3: Check if user already exists (by email or username)
    console.log(`🔍 Checking if user exists with email: ${email} or username: ${username}`); // Log the search operation
    // Check if a user with the same email or username exists in the database
    const existedUser = await User.findOne(
        {
            $or: [{ username }, { email }]
        });

    if (existedUser) { // If the user already exists
        console.log("⚠️ User already exists:", existedUser); // Log the existing user
        throw new ApiError(409, "User with this email or username already exists");
    }

    // 🔹 Step 4: Validate uploaded images (if any)
    console.log("📂 Uploaded files:", req.files); // Log uploaded files to the console for debugging

    const avatarlocalpath = req.files?.avatar?.[0]?.path; // Get the local path of the avatar image from the request
    const coverimagelocalpath = req.files?.coverImage?.[0]?.path; // Get the local path of the cover image (if provided)
    console.log("🖼️ Avatar Path:", avatarlocalpath, "Cover Image Path:", coverimagelocalpath);

    if (!avatarlocalpath) { // If no avatar file is provided
        throw new ApiError(400, "Avatar file is required");
    }

    // 🔹 Step 5: Upload images to Cloudinary
    const avatar = await uploadOnCloudinary(avatarlocalpath); // Upload the avatar image to Cloudinary and get the URL
    const coverImage = coverimagelocalpath ? await uploadOnCloudinary(coverimagelocalpath) : null; // Upload cover image if it exists

    if (!avatar) { // If avatar upload fails
        throw new ApiError(500, "Failed to upload avatar");
    }

    // 🔹 Step 6: Create a new user entry in the database
    const user = await User.create({
        fullname,
        avatar: avatar.url, // Store avatar URL in the user record
        coverImage: coverImage?.url || "", // Store cover image URL if it exists, otherwise store an empty string
        email,
        password,
        username: username.toLowerCase() // Ensure the username is stored in lowercase
    });

    // 🔹 Step 7: Remove sensitive information before sending response
    const createduser = await User.findById(user._id).select("-password -refreshToken"); // Select the user record without password and refreshToken fields

    // 🔹 Step 8: Ensure user creation was successful
    if (!createduser) { // If the user wasn't created successfully
        throw new ApiError(500, "Something went wrong while registering the user"); // Throw an error indicating the user registration failed
    }

    // 🔹 Step 9: Send the response
    return res.status(201).json(new ApiResponce(200, createduser, "User registered successfully")); // Send a successful response with the created user data
});


// Login user function
const loginUser = asyncHandler(async (req, res) => {
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
    const { accessToken, refreshToken } = await genereateAccessAndRefereshTokens(user._id);
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
            new ApiResponce(
                200,
                {
                    user: loggedinUser, accessToken, refreshToken // Send the user data along with tokens
                },
                "User logged in successfully." // Success message
            )
        );
});

// Logout user function
const logOutUser = asyncHandler(async (req, res) => {
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
            new ApiResponce(
                200,
                {},
                "User Logged Out"
            )
        );
});

// refreshAccessaToken function
const refereshAccessToken = asyncHandler(async (req, res) => {
    console.log("🔄 Refreshing access token...");
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    console.log("📝 Incoming refreshToken:", incomingrefreshToken);
    if (!refreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    const decodedToken = jwt.verify(
        incomingrefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    console.log("📝 Decoded refreshToken:", decodedToken);

    const user = await User.findById(decodedToken?.id)
    console.log("📝 User:", user);
    if (!user) {
        throw new ApiError(401, "invalid refresh token");
    }

    if (incomingrefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "incoming refresh token doesnt match with saved refreshtoken");
    }

    const options = {
        httpOnly: true, // Ensure cookies are only accessible via HTTP
        secure: true // Ensure cookies are sent only over HTTPS
    };

    const { accessToken, newrefreshToken } = await genereateAccessAndRefereshTokens(user._id)

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponce
                (
                    200,
                    { accessToken, refreshToken: newrefreshToken },
                    "Access Token Refreshed Successfully"
                )
        )

})

export {
    registerUser,
    loginUser,
    logOutUser,
    refereshAccessToken
};
