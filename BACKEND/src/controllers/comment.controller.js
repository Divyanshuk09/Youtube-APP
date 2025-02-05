import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponce } from "../utils/apiResponse.js"

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    console.log("Adding comment for Video ID:", videoId, "Content:", content); // Debugging line

    if (!videoId || !content) {
        throw new ApiError(400, "Video ID and comment content are required");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const comment = await Comment.create({
        owner: userId,
        video: videoId,
        content: content
    });

    video.comments.push(comment._id);
    await video.save(); // Save the updated video

    const updatedvideo = await Video.findById(videoId).populate({
        path: "comments",
        populate: {
            path: "owner",
            select: "username"
        }
    });

    console.log("Comment added successfully:", comment); // Debugging line

    return res.status(200).json(
        new ApiResponce(200, comment, "Comment created successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    console.log("Deleting comment with ID:", commentId); // Debugging line

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not the owner of this comment");
    }

    const { video: videoId } = comment;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    await Comment.findByIdAndDelete(commentId);

    await Video.findByIdAndUpdate(videoId, {
        $pull: {
            comments: commentId
        }
    });

    console.log("Comment deleted successfully:", commentId); // Debugging line

    return res.status(200).json(
        new ApiResponce(200, null, "Comment deleted successfully")
    );
});

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    console.log("Fetching comments for Video ID:", videoId, "Page:", page, "Limit:", limit); // Debugging line

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const comments = await Comment.find({ video: videoId })
        .populate({
            path: "owner",
            select: "username avatar",
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    console.log("Fetched comments count:", comments.length); // Debugging line

    return res.status(200).json(
        new ApiResponce(200, comments, "Comments fetched successfully")
    );
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    console.log("Updating comment with ID:", commentId, "New content:", content); // Debugging line

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    comment.content = content;
    await comment.save();

    console.log("Updated comment:", comment); // Debugging line

    return res.status(200).json(
        new ApiResponce(200, comment, "Comment updated successfully")
    );
});


export {
    addComment,
    deleteComment,
    updateComment,
    getVideoComments,
}