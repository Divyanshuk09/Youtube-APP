import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isPlaylistOwner = asyncHandler(async (req,res,next) => {
    const playlist = await Playlist.findById(req.params.playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the playlist owner can perform this action");
    }

    req.playlist = playlist;
    next();
})
3
export const isPlaylistCollaborator = asyncHandler(async (req,res,next) => {
    const playlist = await Playlist.findById(req.params.playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    const userId = req.user._id.toString();
    const isOwner = playlist.owner.toString() === userId;
    const isCollaborator = playlist.collaborators.some(c=>c.user.toString()===userId);

    if (!isOwner && !isCollaborator) {
        throw new ApiError(403, "You don't have access to this playlist");
    }

    req.playlist=playlist;
    next()
})

