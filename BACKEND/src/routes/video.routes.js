import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    deleteVideo,
    getAllVideosForHome,
    publishVideo,
    searchVideo,
    togglePublishStatus,
    updateVideo,
    
} from "../controllers/video.controller.js";

const router = Router();
router.route("/").get((req, res) => {
    res.send("video API is working!");
});

router.use(verifyJWT); //apply verifyjwt middleware to all routes in this field

router.route("/").get(getAllVideosForHome);

router.post(
    "/",
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
    ]),
    publishVideo
);

router.route("/:videoId")
.delete(deleteVideo)
.put(upload.single('thumbnail'), updateVideo)
.patch(togglePublishStatus);
router.route("/results").get(searchVideo);




export default router;