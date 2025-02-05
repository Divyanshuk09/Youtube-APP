import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponce } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {

    const { name, description } = req.body
    const userId = req.user._id;

    if (!name || !description) {
        throw new ApiError(
            400,
            "Please provide name and description for the playlist",
        )
    }

    const newPlaylist = await Playlist.create({
        name,
        description,
        owner: userId
    });

    res
        .status(201)
        .json(new ApiResponce(
            201,
            newPlaylist,
            "Playlist created successfully"
        ));


})

const getUserPlaylist = asyncHandler(async (req, res) => {
    console.log("Received request to fetch user playlists");

    // Extract userId from request parameters
    const { userId } = req.params;
    console.log(`User ID received: ${userId}`);

    // Fetch playlists that match the owner ID
    const userPlaylists = await Playlist.find({ owner: userId });

    // Log fetched playlists
    console.log("User Playlists Found:", userPlaylists);

    if (!userPlaylists || userPlaylists.length === 0) {
        console.error("No playlists found for this user");
        throw new ApiError(404, "No playlists found for this user");
    }

    // Return response with user's playlists
    return res.status(200).json(
        new ApiResponce(200, userPlaylists, "User playlists retrieved successfully")
    );
});

const searchPlaylist = asyncHandler(async (req, res) => {

    /*
    Get the query parameter from the request body.
    Validate the query.
    Use the $regex operator to search for matching playlists based on the name or description.
    Return the found playlists or a 404 error if none are found.
    */

    const query = req.query.search_query;

    console.log(query);

    if (!query) {
        throw new ApiError(
            400,
            "Query is required",
        )
    }

    const playlists = await Playlist.find({
        $or: [
            {
                name: {
                    $regex: query,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: query,
                    $options: "i"
                }
            }
        ]
    })

    if (!playlists) {
        throw new ApiError(
            404,
            "Playlist not found",
        )
    }

    return res.status(200).json(
        new ApiResponce(
            200,
            playlists,
            "playlist fetched successfully"
        )
    )
})

const getPlaylistVideos = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    
    console.log(`Fetching videos for playlist: ${playlistId}`);

    // Find the playlist and populate video details
    const playlist = await Playlist.findById(playlistId).populate("videos");

    if (!playlist) {
        console.error("Playlist not found");
        throw new ApiError(404, "Playlist not found");
    }

    // Send the playlist with all videos
    return res.status(200).json(
        new ApiResponce(200, playlist.videos, "Videos retrieved successfully")
    );
});

const addvideotoplaylist = asyncHandler(async (req, res) => {

    /*
    Extract the videoId and playlistId from the request parameters.
Check if both the video and playlist exist in the database.
Ensure the video is not already in the playlist to prevent duplicates.
Add the video ID to the playlist's videos array.
Save the updated playlist and return the result.
    */

    const { videoId, playlistId } = req.params;
    const video = await Video.findById(videoId);
    const playlist = await Playlist.findById(playlistId);

    if (!video) {
        throw new ApiError(
            404,
            "video not found",
        )
    }
    if (!playlist) {
        throw new ApiError(
            404,
            "Playlist not found",
        )
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(
            400,
            "Video already exists in the playlist",
        )
    }

    playlist.videos.push(videoId);
    await playlist.save();

    return res.status(200).json(
        new ApiResponce(
            200,
            playlist,
            "Video added to playlist successfully"
        )
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    const userId = req.user.id; // Assuming verifyJWT middleware adds `req.user`

    console.log(`Received request to remove video:${videoId} from playlist:${playlistId}`);
    console.log("Video ID:", videoId, "Playlist ID:", playlistId, "User ID:", userId);

    // Fetch playlist and check if it exists
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        console.error("Playlist not found");
        throw new ApiError(404, "Playlist not found");
    }

    // Check if the user is the owner of the playlist
    if (playlist.owner.toString() !== userId) {
        console.error("Unauthorized: User is not the owner of the playlist");
        throw new ApiError(403, "You are not authorized to remove videos from this playlist");
    }

    // Check if the video exists in the playlist
    if (!playlist.videos.includes(videoId)) {
        console.error("Video does not exist in the playlist");
        throw new ApiError(400, "Video does not exist in the playlist");
    }

    // Remove the video from the playlist
    playlist.videos = playlist.videos.filter((id) => id.toString() !== videoId);
    await playlist.save();
    console.log("Video removed successfully from playlist");

    return res.status(200).json(
        new ApiResponce(200, playlist, "Video removed from playlist successfully")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    /*
    Get the playlistId from the request parameters.
  Check if the playlist exists.
  If found, delete the playlist from the database.
  Return a success message indicating the deletion.
    */

    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(
            404,
            "Playlist not found",
        )
    }

    await playlist.deleteOne();

    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                null,
                "Playlist deleted successfully"
            )
        )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    console.log("Received request to update playlist");

    // Extract playlistId from request parameters
    const { playlistId } = req.params;
    console.log(`Playlist ID received: ${playlistId}`);

    // Extract name and description from request body
    const { name, description } = req.body;
    console.log(`Name: ${name}, Description: ${description}`);

    // Check if the playlist exists in the database
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        console.error("Playlist not found");
        throw new ApiError(404, "Playlist not found");
    }
    console.log("Playlist found:", playlist);

    // Update playlist details if provided
    if (name) {
        console.log(`Updating playlist name from "${playlist.name}" to "${name}"`);
        playlist.name = name;
    }
    if (description) {
        console.log(`Updating playlist description from "${playlist.description}" to "${description}"`);
        playlist.description = description;
    }

    // Save the updated playlist
    await playlist.save();
    console.log("Playlist updated successfully");

    return res.status(200).json(new ApiResponce(200, null, "Playlist updated successfully"));
});


export {
    createPlaylist,
    getUserPlaylist,
    getPlaylistVideos,
    searchPlaylist,
    addvideotoplaylist,
    deletePlaylist,
    updatePlaylist,
    removeVideoFromPlaylist
};