import { Router } from 'express';
import { verifyJWT } from "../middleware/auth.middleware.js"
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").post(addComment);
router.route("/c/:commentId")
    .delete(deleteComment)
    .patch(updateComment);

router.route("/:videoId").get(getVideoComments);

export default router