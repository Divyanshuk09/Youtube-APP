import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"], 
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"], 
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: [true, "Full name is required"], 
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"], 
        },
        avatar: {
            type: String, // Cloudinary URL
            required: true,
        },
        coverImage: {
            type: String,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

// 🔒 Pre-save hook to hash password before storing in DB
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Skip if password is not modified

    this.password = await bcrypt.hash(this.password, 10); 
    next();
});

// 🔑 Method to compare hashed passwords
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// 🔐 Generate Access Token (excluding password)
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id, // MongoDB auto-generated ID
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// 🔄 Generate Refresh Token and save it to DB
userSchema.methods.refreshAccessToken = async function () {
    const refreshToken = jwt.sign(
        { _id: this._id }, // Only store user ID
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );

    this.refreshToken = refreshToken;
    await this.save(); // Save refresh token to DB

    return refreshToken;
};

export const User = mongoose.model("User", userSchema);
