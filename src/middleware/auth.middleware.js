import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

// Middleware to verify JWT (JSON Web Token)
export const verifyJWT = asyncHandler(async (req, _, next) => {

    try {
        // Retrieve the access token from cookies or the 'Authorization' header (Bearer token format)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify the token using the secret key (stored in environment variables)
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Retrieve the user from the database using the decoded user ID from the token
        const user = await User.findById(decodedToken?._id)
            .select("-password -refreshToken"); // Exclude password and refreshToken fields for security

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Attach the user object to the request so it can be accessed in subsequent middleware or route handlers
        req.user = user;

        // Call the next middleware or route handler if the token is valid and the user is found
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid accessToken");
    }

});
