import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addcomment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const video = await Video.findById(id);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const newComment = new Comment({
        comment,
        video: video._id,
        user: req.user
    });
    await newComment.save();
    video.comments.push(newComment._id);
    await video.save();
    return res.status(201).json(new ApiResponce("Comment added successfully", newComment));
})
const getcommentonvideo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        throw new ApiError(404, "Video not found");
        }
        const comments = await Comment.find({ video: video._id }).populate("user");
        return res.status(200).json(new ApiResponce("Comments retrieved successfully", comments));
        })

const deletecomment = asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const comment=await Comment.findById(id);
    if(!comment){
        throw new ApiError(404,"Comment not found");
        }
        await comment.remove();
        return res.status(200).json(new ApiResponce("Comment deleted successfully",{}));
        })

const updatecomment = asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const {comment}=req.body;
    const commentToUpdate=await Comment.findById(id);
    if(!commentToUpdate){
        throw new ApiError(404,"Comment not found");
        }
        commentToUpdate.comment=comment;
        await commentToUpdate.save();
        return res.status(200).json(new ApiResponce("Comment updated successfully",commentToUpdate));
})

export {
    addcomment,
    getcommentonvideo,
    deletecomment,
    updatecomment

}