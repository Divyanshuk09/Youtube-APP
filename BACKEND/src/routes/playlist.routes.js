import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    addvideotoplaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistVideos,
    getUserPlaylist,
    removeVideoFromPlaylist,
    searchPlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createPlaylist) 

router
    .route("/:playlistId")
    .patch(updatePlaylist)
    .delete(deletePlaylist);

router.route("/results").get(searchPlaylist)
router.route("/:playlistId").get(getPlaylistVideos);
router.route("/add/:videoId/:playlistId").patch(addvideotoplaylist);
router.route("/remove/:playlistId/:videoId").patch(removeVideoFromPlaylist);
router.route("/feed/:userId").get(getUserPlaylist);

export default router;