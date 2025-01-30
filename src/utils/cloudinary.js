import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';  // Built-in Node.js file system module
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "./.env" });

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        // Check if local file path exists
        if (!localFilePath) {
            console.error("No file path provided");
            return null;
        }

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",  // Automatically determine resource type (image, video, etc.)
        });

        // Log success and return Cloudinary response
        // console.log("File uploaded successfully to Cloudinary:", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        // Log the error from Cloudinary
        console.error("Cloudinary upload error:", error.message);

        // Ensure the file exists before attempting to delete it
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);  // Delete the locally saved file if upload fails
            console.log("Temporary file deleted after upload failure");
        }

        // Return null to indicate failure
        return null;
    }
};

export { uploadOnCloudinary };
