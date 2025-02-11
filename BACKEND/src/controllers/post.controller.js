import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addPost = asyncHandler(async (req, res) => {
    const author = req.user._id;
    const { title, content } = req.body;
    console.log("Request Body:", req.body);
    
    if (!title || !content) {
        throw new ApiError(400, "Title and content are required!");
    }
    let imageUrl = null;
    if (req.file) {
        const postPath = req.file.path;
        console.log("Post Path:", postPath);
        const postFile = await uploadOnCloudinary(postPath);
        if (!postFile || !postFile.url) {
            throw new ApiError(400, "Failed to upload post image");
        }
        imageUrl = postFile.url;
    }
    const newPost = new Post({
        title,
        content,
        author,
        image: imageUrl,
    });
    console.log("New Post:", newPost);
    await newPost.save();
    return res.status(201).json(
        new ApiResponse(201, newPost, "Post sent successfully!")
    );
});

// Get all posts from a specific user (for their profile)
const getUserPosts = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const posts = await Post.find({ author: userId })
        .populate("author", "username avatar channelName")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, posts, "User's posts retrieved successfully")
    );
});

const updatePost = asyncHandler(async (req, res) => {
    const user = req.user._id;
    const { title, content } = req.body;
    console.log("Request Body:", req.body);
    
    const post = await Post.findById(req.params.id);
    console.log("Fetched post:", post);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    if (post.author.toString() !== user.toString()) {
        throw new ApiError(403, "You are not authorized to update this post");
    }
    
    if (title) post.title = title;
    if (content) post.content = content;

    if (req.file) {
        const postPath = req.file.path;
        console.log("Post Path:", postPath);
        const postFile = await uploadOnCloudinary(postPath);
        if (!postFile || !postFile.url) {
            throw new ApiError(400, "Failed to upload post image");
        }
        post.image = postFile.url;
    }

    console.log("Final post before save:", post);
    await post.save();
    return res.status(200).json(new ApiResponse(200, post, "Post updated successfully!"));
});


const deletePost = asyncHandler(async (req, res) => {
    const user = req.user._id;
    const post = await Post.findById(req.params.id)
    console.log("user:",user,"post id:",post);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    if (post.author.toString() !== user.toString()) {
        throw new ApiError(403, "You are not authorized to delete this post");
    }
    await post.deleteOne();
    return res.status(200).json(new ApiResponse(200, post, "Post deleted successfully!"));
})

export {
    addPost,
    getUserPosts,
    updatePost,
    deletePost
}