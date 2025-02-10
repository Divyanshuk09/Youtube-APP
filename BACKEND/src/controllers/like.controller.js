import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponce } from "../utils/apiResponse.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

    if (existingLike) {
        // ✅ Remove like from the Like collection
        await existingLike.deleteOne();

        // ✅ Remove like reference from the Video model
        await Video.findByIdAndUpdate(videoId, {
            $pull: { likes: existingLike._id }
        });

        // ✅ Also remove the video from `user.likedvideos`
        await User.findByIdAndUpdate(userId, {
            $pull: { likedvideos: videoId }
        });

        return res.status(200).json(
            new ApiResponce(200, null, "Like removed successfully")
        );
    } else {
        // ✅ Create a new like entry
        const newLike = new Like({
            video: videoId,
            likedBy: userId,
        });

        await newLike.save();

        // ✅ Add the like reference to the Video model
        await Video.findByIdAndUpdate(videoId, {
            $push: { likes: newLike._id }
        });

        // ✅ Add the video to `user.likedvideos`
        await User.findByIdAndUpdate(userId, {
            $addToSet: { likedvideos: videoId } // Prevents duplicates
        });

        return res.status(201).json(
            new ApiResponce(201, newLike, "Like added successfully")
        );
    }
});


const togglePostLike = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    console.log("Received postId:", postId);
    const userId = req.user._id;
    const post = await Post.findById(postId);
    console.log("Found Post:", post);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    const existingLike = await Like.findOne({ post: postId, likedBy: userId });
    if (existingLike) {
        await existingLike.deleteOne();
        await Post.findByIdAndUpdate(postId, {
            $pull: { likes: existingLike._id }
        });
        return res.status(200).json(
            new ApiResponce(200, null, "Like removed successfully")
        );
    } else {
        const newLike = new Like({
            post: postId,
            likedBy: userId,
        });
        await newLike.save();
        await Post.findByIdAndUpdate(postId, {
            $push: { likes: newLike._id }
        });
        return res.status(201).json(
            new ApiResponce(201, newLike, "Like added successfully")
        );
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    const existingLike = await Like.findOne({ comment: commentId, likedBy: userId });
    if (existingLike) {
        await existingLike.deleteOne();
        await Comment.findByIdAndUpdate(commentId, {
            $pull: { likes: existingLike._id }
        });
        return res.status(200).json(
            new ApiResponce(200, null, "Like removed successfully")
        );
    } else {
        const newLike = new Like({
            comment: commentId,
            likedBy: userId,
        });

        await newLike.save();
        await Comment.findByIdAndUpdate(commentId, {
            $push: { likes: newLike._id }
        });

        return res.status(201).json(
            new ApiResponce(201, newLike, "Like added successfully")
        );
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Get liked video IDs from the Like collection
    const likedVideoIds = await Like.find(
        {
            likedBy: userId,
            video: { $ne: null }
        }).select("video");

    // Extract only the video IDs
    const videoIds = likedVideoIds.map(like => like.video);

    // Fetch the actual video details
    const likedVideos = await Video.find({ _id: { $in: videoIds } });

    await User.findByIdAndUpdate(userId, {
        $addToSet: { likedvideos: { $each: videoIds } } 
    });

    return res.status(200).json(
        new ApiResponce(
            200,
            likedVideos,
            "Liked videos fetched successfully")
    );
});

export {
    toggleVideoLike,
    toggleCommentLike,
    togglePostLike,
    getLikedVideos
};
