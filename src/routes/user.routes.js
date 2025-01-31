import { Router } from "express";
import { registerUser, loginUser, logOutUser, refreshAccessToken, changeCurrentPasswordWithNewPassword, getcurrentUser, updateAccountDetails } from "../controllers/user.controller.js"
import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logOutUser);

router.route("/refresh-Token").post(refreshAccessToken);

router.route("/generateNewPassword").post(verifyJWT, changeCurrentPasswordWithNewPassword);

router.route("/currentUser").post(getcurrentUser);

router.route("/updateAccountDetails").post(updateAccountDetails);

export default router;
