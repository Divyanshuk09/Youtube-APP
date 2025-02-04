import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from "../utils/apiError.js";
import { ApiResponce } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";


// publishVideo (For uploading a new video)
const publishVideo = asyncHandler(async (req, res, next) => {
    const owner = req.user._id; // Get the authenticated user's ID from the JWT
    console.log(`Authenticated user ID: ${owner}`);

    console.log("Processing video upload...");

    // Validate uploaded files
    if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
        console.log("Missing video or thumbnail file.");
        throw new ApiError(400, "Video file and thumbnail are required!");
    }

    const { title, description } = req.body; // Extract video details from the request body

    if (!title || !description) {
        console.log("Missing required fields (title or description).");
        throw new ApiError(400, "All fields are required!");
    }

    // Get file paths
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    console.log("Uploaded files:");
    console.log("Video path:", videoLocalPath);
    console.log("Thumbnail path:", thumbnailLocalPath);

    if (!videoLocalPath || !thumbnailLocalPath) {
        console.log("Missing video or thumbnail file paths.");
        throw new ApiError(400, "Video file and thumbnail are required!");
    }

    // Upload to Cloudinary
    console.log("Uploading video and thumbnail to Cloudinary...");
    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile) {
        console.log("Failed to upload video file.");
        throw new ApiError(400, "Failed to upload video file!");
    }
    if (!thumbnailFile) {
        console.log("Failed to upload thumbnail file.");
        throw new ApiError(400, "Failed to upload thumbnail file!");
    }

    console.log("Successfully uploaded files to Cloudinary:");
    console.log("Video URL:", videoFile.url);
    console.log("Thumbnail URL:", thumbnailFile.url);

    // Extract public ID from video URL
    console.log("Fetching video metadata from Cloudinary...");
    const videoUrlParts = videoFile.url.split("/");
    const videoFileName = videoUrlParts[videoUrlParts.length - 1];
    const videoPublicId = videoFileName.split(".")[0]; // Extract public ID (without extension)

    console.log("Extracted Video Public Id:", videoPublicId);

    if (!videoPublicId) {
        console.log("Failed to extract video public id");
        throw new ApiError(400, "Failed to extract video public id");
    }

    // Fetch metadata from Cloudinary
    console.log("Fetching video metadata from Cloudinary...");
    const videoMetaData = await cloudinary.api.resource(videoPublicId, {
        resource_type: "video",
        image_metadata: true,
        media_metadata: true,
    });

    console.log("Cloudinary metadata resource:", videoMetaData);

    const videoDuration = videoMetaData?.duration;

    if (typeof videoDuration !== "number") {
        console.log("Duration field missing in Cloudinary response.");
        throw new ApiError(400, "Failed to retrieve video duration.");
    }

    console.log("Video duration:", videoDuration);

    // Save video to the database
    const newVideo = new Video({
        videoFile: videoFile.url, // Cloudinary video URL
        thumbnail: thumbnailFile.url, // Cloudinary thumbnail URL
        title,
        description,
        duration: videoDuration, // Duration retrieved from Cloudinary
        owner,
    });

    await newVideo.save(); // Save to the database
    console.log("New video saved to database.");

    return res.status(200).json(
        new ApiResponce(200, newVideo, "Video uploaded successfully")
    );
});

// getallvideosfor homepage
const getAllVideosForHome = asyncHandler(async (req, res, next) => {
    console.log("Getting random videos for homepage.....");

    // Extract page and limit for pagination from query params (if provided)
    const page = parseInt(req.query.page) || 1;  // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 videos per page
    const skip = (page - 1) * limit; // Calculate how many items to skip based on page and limit

    console.log(`Fetching videos for page ${page} with a limit of ${limit}...`);

    try {
        const videos = await Video.aggregate([
            {
                $match: {
                    isPublished: true, // Only fetch published videos
                },
            },
            {
                $sample: {
                    size: limit, // Fetch random videos based on the limit
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                },
            },
            {
                $unwind: "$owner",
            },
            {
                $project: {
                    _id: 1,
                    videoFile: 1,
                    thumbnail: 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                    views: 1,
                    createdAt: 1,
                    "owner._id": 1,
                    "owner.username": 1,
                    "owner.avatar": 1, // Include user avatar for UI
                },
            },
            {
                $skip: skip, // Apply pagination skip
            },
            {
                $limit: limit, // Apply pagination limit
            },
        ]);

        console.log(`Fetched ${videos.length} videos for homepage.`);

        return res.status(200).json(
            new ApiResponce(200, videos, "Videos fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching videos for homepage:", error.message);
        throw new ApiError(500, "An error occurred while fetching videos.");
    }
});


const deleteVideo = asyncHandler(async (req, res, next) => {

    console.log("req.params.id:", req.params);
    const {videoId} = req.params;
    const userId = req.user._id;

    console.log(`Attempting to delete video :${videoId} by user: ${userId}`);

    //find the video in the database
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(
            404,
            "video not found "
        )
    }

    if (video.owner.toString() !== userId.toString()) {
        throw new ApiError(
            403,
            "You do not have permission to delete this video."
        )
    }

    console.log(`Deleting video from Cloudinary: ${video.videoFile}`);
    console.log(`Deleting thumbnail from Cloudinary: ${video.thumbnail}`);

    // extract public id from cloudinary 

    const videoPublicId = video.videoFile.split("/").pop().split(".")[0];
    const thumbnailPublicId = video.thumbnail.split("/").pop().split(".")[0];

    //delete files from cloudinary

    await cloudinary.uploader.destroy(videoPublicId, { resource_type: "video" })
    await cloudinary.uploader.destroy(thumbnailPublicId, { resource_type: "image" })

    //delete video form database

    await video.deleteOne();

    console.log("video successfully deleted from database and cloudinary.")

    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                null,
                "Video deleted successfully"
            )
        )

})

const searchVideo = asyncHandler(async (req, res, next) => {
    const query = req.query.search_query;

    if (!query) {
        throw new ApiError(400, "Please provide a search query");
    }
    console.log(`Searching videos with title matching: "${query}"`);

    try {
        const videos = await Video.aggregate([
            {
                $match: {
                    title: {
                        $regex: query,
                        $options: "i"
                    },
                    isPublished: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            {
                $unwind: "$owner"
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    videoFile: 1,
                    thumbnail: 1,
                    duration: 1,
                    views: 1,
                    createdAt: 1,
                    "owner._id": 1,
                    "owner.username": 1,
                    "owner.avatar": 1
                }
            }
        ])
        console.log(`Found ${videos.length} videos matching query: ${query}`)
        return res
            .status(200)
            .json(
                new ApiResponce(
                    200,
                    videos,
                    "Videos fetched successfully",
                )
            );

    } catch (error) {
        console.error("Error searching videos:", error);
        return next(new ApiError(
            500,
            `An error occurred while searching videos: ${error.message}`));
    }


})

const updateVideo = asyncHandler(async(req, res, next) => {
    // Get the video ID and other data from the request
    const { videoId } = req.params;
    const { title, description } = req.body;
    const thumbnailFile = req.file;

    console.log(`Attempting to update video with ID: ${videoId}`);

    // Check if the video exists in the database
    const video = await Video.findById(videoId);
    if (!video) {
        console.log("Video not found.");
        throw new ApiError(404, "Video not found");
    }

    // Ensure the authenticated user is the owner of the video
    if (video.owner.toString() !== req.user._id.toString()) {
        console.log("User is not the owner of this video.");
        throw new ApiError(403, "You are not the owner of this video");
    }

    // If there's a new thumbnail, update it
    if (thumbnailFile) {
        console.log("New thumbnail file detected, processing upload...");

        if (video.thumbnail) {
            console.log("Existing thumbnail found, deleting from Cloudinary...");
            await deleteFromCloudinary(video.thumbnail);
        }

        const CloudinaryResponse = await uploadOnCloudinary(thumbnailFile.path);
        if (!CloudinaryResponse) {
            console.log("Failed to upload new thumbnail to Cloudinary.");
            throw new ApiError(500, "Failed to upload thumbnail to cloudinary");
        }

        video.thumbnail = CloudinaryResponse.url;
        console.log("Updated thumbnail URL:", video.thumbnail);
    }

    // Update title and description if provided
    if (title) {
        console.log("Updating video title...");
        video.title = title;
    }

    if (description) {
        console.log("Updating video description...");
        video.description = description;
    }

    // Save the updated video to the database
    const updatedVideo = await video.save();
    console.log("Video updated successfully:", updatedVideo);

    return res.status(200).json(
        new ApiResponce(200, updatedVideo, "Video updated successfully")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(
            404,
            "Video not found"
        );
        
    }

    if(video.owner.toString()!== req.user._id.toString()){
        throw new ApiError(
            403,
            "You do not have permission to perform this action."
            )
    }

    video.isPublished = !video.isPublished; //if true-> false and if false-> true

    console.log(`Updated publish status: ${video.isPublished ? "Published" : "Unpublished"}`);

    const updatedVideo = await video.save();

    console.log("Video publish status updated:", updatedVideo);

    return res
    .status(200)
    .json(
        new ApiResponce(
            200,
            updatedVideo,
            "Video publish status updated")
    )
})

export { getAllVideosForHome, publishVideo, deleteVideo, searchVideo, updateVideo, togglePublishStatus };
