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
        console.log("File uploaded successfully to Cloudinary:", response.url);
        fs.unlinkSync(localFilePath);  // Delete the local file after successful upload
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

// Delete from Cloudinary
const deleteFromCloudinary = async (url) => {
    try {
        // Extract the public ID from the Cloudinary URL
        const publicId = url.split('/').pop().split('.')[0];  // Assumes the URL ends with the public ID and file extension
        if (!publicId) {
            throw new Error("Invalid Cloudinary URL: Unable to extract public ID");
        }

        // Delete the file from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("File deleted from Cloudinary:", result);

        return result;
    } catch (error) {
        console.error("Cloudinary delete error:", error.message);
        throw error;  // Re-throw the error for handling in the calling function
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };