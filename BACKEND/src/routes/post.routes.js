import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { addPost,updatePost, deletePost, getUserPosts
 } from '../controllers/post.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();
router.use(verifyJWT);

router.post("/add", upload.single("image"), addPost);
router.get("/:id",getUserPosts)
router.put("/:id",updatePost)
router.delete("/:id",deletePost)

export default router;