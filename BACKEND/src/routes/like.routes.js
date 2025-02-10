import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    togglePostLike,
} from "../controllers/like.controller.js"
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.post("/video/:videoId", toggleVideoLike);
router.post("/comment/:commentId", toggleCommentLike);
router.post("/post/:postId", togglePostLike);
router.route("/videos").get(getLikedVideos);

export default router