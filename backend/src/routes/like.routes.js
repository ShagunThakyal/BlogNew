import {Router} from "express"
import {verifyJWT} from "../middleware/auth.middleware.js"
import {
    toggleCommentLike,
    toggleBlogLike,
    getLikedBlog,
    getLikedComments,
} from "../controller/like.controller.js"

const router = Router()

router.use(verifyJWT)

// secure routes
router.route("/blog")// enterging blog id
.get(getLikedBlog)
router.route("/b/:blogId")
.post(toggleBlogLike)

router.route("/comment")// enterging blog id
.get(getLikedComments)

router.route("/c/:commentId")
.post(toggleCommentLike)

export default router;