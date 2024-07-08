import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";

import {
    getBlogComments, 
    addComment, 
    updateComment,
    deleteComment
} from "../controller/comment.controller.js"

const router =  Router();

router.use(verifyJWT)// Apply verifyJWT middleware to all routes in this file

router.route("/:blogId") // taking blog id from body
.post(addComment,)
.get(getBlogComments)

router.route("/:commentId")
.delete(deleteComment)
.patch(updateComment)


export default router;