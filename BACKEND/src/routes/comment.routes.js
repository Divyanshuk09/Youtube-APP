import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addcomment, deletecomment, updatecomment, getcommentonvideo } from "../controllers/comment.controller.js";

const router = Router();
router.use(verifyJWT);
router.post("/:id", addcomment);
router.delete("/:id", deletecomment);
router.put("/:id",updatecomment)
router.get("/:id", getcommentonvideo);

export default router;