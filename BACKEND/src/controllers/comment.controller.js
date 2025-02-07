import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponce } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add a comment on post
const addComment = asyncHandler(async (req, res) => {
    const { postId, videoId } = req.params; // Accept both postId and videoId
    const { content, parentCommentId } = req.body;
    const userId = req.user._id;
  
    if (!content) {
      throw new ApiError(400, "Comment content is required");
    }
  
    // Check if either postId or videoId is provided
    if (!postId && !videoId) {
      throw new ApiError(400, "Either postId or videoId is required");
    }
  
    let targetModel;
    let updateField;
  
    if (postId) {
      targetModel = await Post.findById(postId);
      updateField = { post: postId };
    } else if (videoId) {
      targetModel = await Video.findById(videoId);
      updateField = { video: videoId };
    }
  
    if (!targetModel) {
      throw new ApiError(404, postId ? "Post not found" : "Video not found");
    }
  
    const comment = await Comment.create({
      content,
      owner: userId,
      parentComment: parentCommentId || null,
      ...updateField, // Add post or video reference
    });
  
    // Add comment to the post's or video's comments array
    targetModel.comments.push(comment._id);
    await targetModel.save();
  
    return res
      .status(200)
      .json(new ApiResponce(200, comment, "Comment created successfully"));
  });

// Get comments for a post
const getComments = asyncHandler(async (req, res) => {
    const { postId, videoId } = req.params; // Accept both postId and videoId
    const { page = 1, limit = 10 } = req.query;
  
    // Check if either postId or videoId is provided
    if (!postId && !videoId) {
      throw new ApiError(400, "Either postId or videoId is required");
    }
  
    const filter = postId ? { post: postId } : { video: videoId };
  
    const comments = await Comment.find({ ...filter, parentComment: null }) // Only top-level comments
      .populate("owner", "username avatar")
      .populate({
        path: "replies",
        populate: {
          path: "owner",
          select: "username avatar",
        },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
  
    return res
      .status(200)
      .json(new ApiResponce(200, comments, "Comments fetched successfully"));
  });

//delete a comment from post
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const post = await Post.findById(req.params.postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    // Remove the comment from the post's comments array
    post.comments.pull(comment._id);
    await post.save();
    return res
        .status(200)
        .json(new ApiResponce(200, comment, "Comment deleted successfully"));
});


//delete a comment from a video
const deleteCommentFromVideo = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const video = await Video.findById(req.params.videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    // Remove the comment from the video's comments array
    video.comments.pull(comment._id);
    await video.save();
    return res
        .status(200)
        .json(new ApiResponce(200, comment, "Comment deleted successfully"));
});

//update a comment
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    return res
        .status(200)
        .json(new ApiResponce(200, comment, "Comment updated successfully"));
});


// Like a comment
const likeComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.likes.includes(userId)) {
        throw new ApiError(400, "You already liked this comment");
    }

    comment.likes.push(userId);
    await comment.save();

    return res
        .status(200)
        .json(new ApiResponce(200, comment, "Comment liked successfully"));
});

// Dislike a comment
const dislikeComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.dislikes.includes(userId)) {
        throw new ApiError(400, "You already disliked this comment");
    }

    comment.dislikes.push(userId);
    await comment.save();

    return res
        .status(200)
        .json(new ApiResponce(200, comment, "Comment disliked successfully"));
});

export { addComment, getComments, likeComment, dislikeComment, deleteComment, updateComment, deleteCommentFromVideo };