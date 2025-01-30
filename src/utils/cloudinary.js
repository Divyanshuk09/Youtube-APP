import { v2 as cloudinary } from 'cloudinary';
import fs from "fs" //fs is a file system provided by nodejs itself (https://www.nodejs.org/api/fs.html)



// Configuration
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        //file has been upload successfully
        console.log("file has been upload successfully", response.url)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath)
        //remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary};

