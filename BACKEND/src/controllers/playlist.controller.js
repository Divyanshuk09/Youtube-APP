import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { nanoid } from 'nanoid'

const generateShareLink = () => {
    return {
        token: nanoid(16),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30days from now
        maxUses: 100,
        active: true
    }
}

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user._id;

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required");
    }

    const existing = await Playlist.findOne({ name, owner: userId });
    if (existing) {
        throw new ApiError(409, "You already have a playlist with this name");
    }

    // First create the playlist
    const playlist = await Playlist.create({
        name,
        description,
        owner: userId,
        shareLink: generateShareLink(),
    });

    // Then generate the share URL using the created playlist's token
    const shareUrl = `${req.protocol}://${req.get('host')}/api/playlists/share/${playlist.shareLink.token}`;

    // Include the shareUrl in the response if you want to return it
    const responseData = {
        ...playlist.toObject(),
        shareUrl
    };

    res.status(201).json(
        new ApiResponse(201, responseData, "Playlist created successfully")
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    const playlists = await Playlist.find({
        $or: [
            { owner: userId },
            { "collaborators.user": userId }
        ]
    }).sort({ createdAt: -1 })

    if (!playlists.length) {
        return res.status(200).json(
            new ApiResponse(200, [], "No playlists found")
        );
    }

    res.status(200).json(
        new ApiResponse(200, playlists, "Playlists retrieved successfully")
    );
});

const searchPlaylist = asyncHandler(async (req, res) => {
    const query = req.query.search_query;

    if (!query) {
        throw new ApiError(400, "Query is required",)
    }

    const playlists = await Playlist.find({
        $or: [
            {
                name: { $regex: query, $options: "i" }
            },
            {
                description: { $regex: query, $options: "i" }
            }
        ]
    })

    if (!playlists) {
        throw new ApiError(404, "Playlist not found",)
    }

    return res.status(200).json(
        new ApiResponse(200, playlists, "playlist fetched successfully")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const playlist = await Playlist.findById(req.params.playlistId)
        .populate("owner", "username avatar")
        .populate("collaborators.user", "username avatar")
        .populate("videos.video", "title thumbnail  duration")
        .populate("videos.addedBy", "username")

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlist retrieved successfully")
    );
})

const getPlaylistVideos = asyncHandler(async (req, res) => {
    const playlist = await Playlist.findById(req.params.playlistId)
        .populate("videos.video", "title thumbnail  duration")

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Send the playlist with all videos
    return res.status(200).json(
        new ApiResponse(200, playlist.videos, "Videos retrieved successfully")
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const playlist = req.playlist;

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    // Update playlist details if provided
    if (name) playlist.name = name;
    if (description) playlist.description = description;

    // Save the updated playlist
    await playlist.save();

    return res.status(200).json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {

    await req.playlist.deleteOne();

    return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Playlist deleted successfully")
        )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {

    const { videoId } = req.params;
    const playlist = req.playlist
    const userId = req.user._id;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "video not found")
    }

    const videoExists = playlist.videos.some(
        v => v.video.toString() === videoId
    );

    if (videoExists) {
        throw new ApiError(400, "Video already in playlist");
    }

    playlist.videos.push({
        video: videoId,
        addedBy: userId
    });
    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const playlist = req.playlist;

    // Fetch playlist and check if it exists
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    const initialLength = playlist.videos.length;
    playlist.videos = playlist.videos.filter(
        v => v.video.toString() !== videoId);


    // Check if the video exists in the playlist
    if (initialLength === playlist.videos.length) {
        throw new ApiError(404, "Video does not exist in the playlist");
    }
    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video removed from playlist successfully")
    );
});

const getPlaylistByShareLink = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const playlist = await Playlist.findOne({ "shareLink.token": token })
        .populate("owner", 'username avatar')
        .populate("videos.video", "title thumbnail duration")

    if (!playlist) {
        throw new ApiError(404, "Playlist not found!");
    }

    if (
        !playlist.shareLink.active ||
        (playlist.shareLink.expiresAt && new Date() > playlist.shareLink.expiresAt) ||
        (playlist.shareLink.maxUses && playlist.shareLink.uses >= playlist.shareLink.maxUses)
    ) {
        throw new ApiError(403, "This share link is no longer valid")
    }

    playlist.shareLink.uses += 1;
    await playlist.save()

    return res.status(200).json(new ApiResponse(200, playlist, "playlist retrieved successfully"))
})

const joinAsCollaborator = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const userId = req.user._id;

    const playlist = await Playlist.findOne({ "shareLink.token": token })
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    // Check share link validity
    if (
        !playlist.shareLink.active ||
        (playlist.shareLink.expiresAt && new Date() > playlist.shareLink.expiresAt) ||
        (playlist.shareLink.maxUses && playlist.shareLink.uses >= playlist.shareLink.maxUses)
    ) {
        throw new ApiError(403, "This share link is no longer valid");
    }

    //check if user is already a collaborator 

    const isCollaborator = playlist.collaborators.some(
        c => c.user.toString() === userId.toString()
    );
    if (isCollaborator) {
        throw new ApiError(409, "You are already a collaborator");
    }

    playlist.collaborators.push(userId)

    playlist.shareLink.uses += 1;
    await playlist.save();

    res.status(200).json(
        new ApiResponse(200, playlist, "Joined playlist as collaborator successfully")
    );
})

const updateShareLink = asyncHandler(async (req, res) => {
    const playlist = req.playlist;

    playlist.shareLink = generateShareLink();
    await playlist.save()
    const shareUrl = `${req.protocol}://${req.get('host')}/api/playlists/share/${playlist.shareLink.token}`;
    res.status(200).json(
        new ApiResponse(200, { ...playlist.shareLink.toObject(), url: shareUrl }, "Share link updated successfully")
    );
})

export {
    createPlaylist,
    getUserPlaylists,
    searchPlaylist,
    getPlaylistById,
    getPlaylistVideos,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getPlaylistByShareLink,
    joinAsCollaborator,
    updateShareLink
};