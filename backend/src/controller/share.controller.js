import { Share } from "../models/share.model.js";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";


const shareOneBlog = asyncHandler(async (req, res) =>{
    const { receiverId } = req.params
    
    if (!isValidObjectId(receiverId)){ 
        throw new ApiError(404, "Invalid receiver id")
     }

    const { blogId } = req.body
    if (!isValidObjectId(blogId)){ 
        throw new ApiError(404, "Invalid blog id")
     }
    const senderId = req.user._id;

     
    try {
        const sender = await User.findById(senderId)
        
       if (!sender){
         throw new ApiError(404, "You can not send blogs: Register if not else try again after login again")
       }

       const receiver = await User.findById(receiverId)
      
      if (!receiver){
         throw new ApiError(404, "Receiver not found")
       }
    
        // find user if blog model
      const blog = await Blog.findById(blogId)
      
      if (!(blog || blog.isPublished)){
         throw new ApiError(404, "Blog not found")
      }
      console.log("ebefkjg")
      const existingShare = await Share.findOne({ receiver: receiverId, creator: blog.author, sender:senderId, sentBlog:blogId })
     console.log(existingShare,"ijebf")
      if (existingShare && existingShare != null) {
        console.log("1")
        res
       .status(201)
       .json(new ApiResponse(201, {blog , existingShare}, "Blog shared successfully"))
       return
     }
   else{
    console.log("@")
     const share = await Share.create(
        {
            receiver:receiverId,
            sender:senderId,
            creator:blog.author,
            sentBlog:blog._id
        }
     )
     
     if (!share) {
         throw new ApiError(500, "Could not share due to error creating share") 
     }

    res
    .status(201)
    .json(new ApiResponse(201, {blog, share}, "Blog shared successfully"))
    }} catch (error) {
        throw new ApiError(500, "An error occurred while sending blog to receiver")
    }
})//DONE!


const  undoBlogShare = asyncHandler(async (req, res)=>{
        const { receiverId } = req.params

        if (!isValidObjectId(receiverId)){ 
            throw new ApiError(404, "Invalid receiver id")
         }
        
        try {
            const share = await Share.findOne({receiver: receiverId})
    
            if (!share) {
                throw new ApiError(404, `No blog was shared with ${receiverId}`)
            }
    
            const deleteShare = await Share.deleteOne({
                receiver: receiverId
            })
    
            if (!deleteShare) {
                throw new ApiError(500, "can not undo share this time")
            }
    
            res
           .status(200)
           .json(new ApiResponse(200, deleteShare, "Blog unshared successfully"))
    
        } catch (error) {
            throw new ApiError(500, "An error occurred while undoing share")
        }
})//DONE


export {
    shareOneBlog,
    undoBlogShare
}