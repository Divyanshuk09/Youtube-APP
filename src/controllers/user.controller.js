import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponce } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    console.log("📥 Incoming request body:", req.body); // Log the incoming request data

    // res.status(200).json({
    //     message: "ok"
    // }); // Check on Postman to verify if it's working.

    /*
    STEPS:
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
    const { username, email, fullname, password } = req.body;
    console.log("✏️ Extracted fields - Username:", username, "Email:", email, "Fullname:", fullname);

    // 🔹 Step 2: Validate required fields
    // This approach checks each field individually.
    // if (fullname === "") {
    //     throw new apiError(400, "Full name is required");
    // }

    // This approach check all field in one go.
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        console.log("❌ Validation failed: Missing required fields");
        throw new ApiError(400, "All fields are required");
    }

    // 🔹 Step 3: Check if user already exists (by email or username)
    console.log(`🔍 Checking if user exists with email: ${email} or username: ${username}`);
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
        console.log("⚠️ User already exists:", existedUser);
        throw new ApiError(409, "User with this email or username already exists");
    }

    // 🔹 Step 4: Validate uploaded images (if any)
    console.log("📂 Uploaded files:", req.files); // Log uploaded files
    const avatarlocalpath = req.files?.avatar?.[0]?.path;
    const coverimagelocalpath = req.files?.coverImage?.[0]?.path;
    console.log("🖼️ Avatar Path:", avatarlocalpath, "Cover Image Path:", coverimagelocalpath);

    if (!avatarlocalpath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // 🔹 Step 5: Upload images to Cloudinary
    const avatar = await uploadOnCloudinary(avatarlocalpath);
    const coverImage = coverimagelocalpath ? await uploadOnCloudinary(coverimagelocalpath) : null;

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar");
    }

    // 🔹 Step 6: Create a new user entry in the database
    const user = await User.create({
        fullname,
        avatar: avatar.url, // Store avatar URL
        coverImage: coverImage?.url || "", // Store cover image URL (if exists)
        email,
        password,
        username: username.toLowerCase() // Ensure username is stored in lowercase
    });

    // 🔹 Step 7: Remove sensitive information before sending response
    const createduser = await User.findById(user._id).select("-password -refreshToken");

    // 🔹 Step 8: Ensure user creation was successful
    if (!createduser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // 🔹 Step 9: Send the response
    return res.status(201).json(new ApiResponce(200, createduser, "User registered successfully"));
});

export { registerUser };
