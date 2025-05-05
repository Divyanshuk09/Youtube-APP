import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add a comment to a video
const addcomment = asyncHandler(async (req, res) => {
    const { id } = req.params; // video id
    const user = req.user._id;  
    const { comment } = req.body;
    
    const video = await Video.findById(id);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    const newComment = new Comment({
        owner: user,
        comment,
        video: video._id,
    });
    
    await newComment.save();
    console.log("newComment:", newComment);
    
    video.comments.push(newComment._id);
    await video.save();
    
    return res.status(201).json(
        new ApiResponse(201, newComment, "Comment added successfully")
    );
});

// Get all comments on a video
const getcommentonvideo = asyncHandler(async (req, res) => {
    const { id } = req.params; //videoid
    const video = await Video.findById(id);
    console.log("video:", video);
    
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    const comments = await Comment.find({ video: video._id })
        .populate("owner", "username avatar");
    
    console.log("comments:", comments);
    
    return res.status(200).json(
        new ApiResponse (200, comments, "Comments retrieved successfully")
    );
});

// Delete a comment
const deletecomment = asyncHandler(async (req, res) => {
    const { id } = req.params; //comment id
    const comment = await Comment.findById(id);
    
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    await Video.findOneAndUpdate(comment.video,{
        $pull:{
            comments:comment._id
        }
    })
    await comment.deleteOne();
    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    );
});

// Update a comment
const updatecomment = asyncHandler(async (req, res) => {
    const { id } = req.params; //comment id
    const { comment } = req.body;
    
    const commentToUpdate = await Comment.findById(id);
    if (!commentToUpdate) {
        throw new ApiError(404, "Comment not found");
    }
    
    commentToUpdate.comment = comment;
    await commentToUpdate.save();
    
    return res.status(200).json(
        new ApiResponse(200, commentToUpdate, "Comment updated successfully")
    );
});

export {
    addcomment,
    getcommentonvideo,
    deletecomment,
    updatecomment
};
