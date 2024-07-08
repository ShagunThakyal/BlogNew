import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessTooken, 
    changeCurrentPassword, 
    forgetPassword, 
    getCurrentUser, 
    updateUserDetails, 
    updateUserAvatar, 
    deleteUser,
    getUserBlogProfile,
    getUserById,
} from "../controller/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:4
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

//secured routes 
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessTooken) //
router.route("/password/c").post(verifyJWT, changeCurrentPassword)
router.route("/password/f").post(verifyJWT, forgetPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateUserDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/u/:username").get(verifyJWT, getUserBlogProfile)
router.route("/delete-user").patch(verifyJWT, deleteUser)
router.route("/:userId").get(verifyJWT, getUserById);


export default router