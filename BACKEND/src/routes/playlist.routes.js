import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    isPlaylistOwner,
    isPlaylistCollaborator
} from "../middleware/playlistuser.middleware.js";
import {
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
} from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/")
.post(createPlaylist);

router.route('/results')
.get(searchPlaylist);
router.route("/feed/:userId")
.get(getUserPlaylists);

//updated playlist Id  routes with middlware
router.route("/:playlistId")
    .get(isPlaylistCollaborator, getPlaylistVideos)
    .patch(isPlaylistCollaborator, updatePlaylist)
    .delete(isPlaylistOwner, deletePlaylist)

//video managament routes with middlware
router.route("/add/:videoId/:playlistId")
    .patch(isPlaylistCollaborator, addVideoToPlaylist)
router.route('/remove/:playlistId/:videoId')
    .patch(isPlaylistCollaborator, removeVideoFromPlaylist);

//new share link routes
router.route("/share/:token").get(getPlaylistByShareLink)
router.route("/share/join").post(joinAsCollaborator)
router.route("/:playlistId/share")
.patch(isPlaylistOwner, updateShareLink)

export default router;