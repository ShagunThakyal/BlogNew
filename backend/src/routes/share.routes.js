import { Router } from "express";
import  {verifyJWT}  from "../middleware/auth.middleware.js";
import {
    shareOneBlog,
    undoBlogShare
} from "../controller/share.controller.js"
const router = Router();

router.use(verifyJWT);

router.route("/:receiverId") // we will be sending blog to the username from given username or receiver id and blog title or blogid 
.post(shareOneBlog)

router.route("/undo/:receiverId")
.delete(undoBlogShare)

export default router 