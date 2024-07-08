import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addComment = asyncHandler(async (req, res) => {
    console.log("Request Body:", req.body);
    console.log("Request Params:", req.params);
    console.log("User ID:", req.user?._id);

    const { blogId } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
        console.log("Comment content is missing or not a valid string.");
        throw new ApiError(400, "Comment content is required and must be a non-empty string.");
    }

    if (!isValidObjectId(blogId)) {
        console.log("Invalid blogId.");
        throw new ApiError(400, "Invalid blogId");
    }

    try {
        if (!req.user || !req.user._id) {
            throw new ApiError(401, "User must be authenticated.");
        }

        const newComment = await Comment.create({
            content,
            blog: blogId,
            owner: req.user._id,
        });

        res.status(201).json(new ApiResponse(201, newComment, "Comment added successfully"));
    } catch (error) {
        console.error('Error adding comment:', error);
        throw new ApiError(500, error.message, "Some error occurred while adding the comment");
    }
});



const getBlogComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { blogId } = req.params
    const { page = 1, limit = 10 } = req.query
    
    console.log(blogId, "blogid from request")

    if (!isValidObjectId(blogId)) {
        throw new ApiError(404,"enter valid blogid to find comments")
    }
    
    try {
        const blogComments = await Comment.find({blog:blogId}).skip((page-1)*limit).limit(limit).exec();
        // console.log(blogComments, "comments")
        if (!blogComments || blogComments.length === 0) {
            throw new ApiError(404,"Could not find comments for specified blog")
        }
        
        res
        .status(200)
        .json(new ApiResponse(200, blogComments, "All comments fetched successfully"))

    } catch (error) {
        throw new ApiError(500, error, "Couldn't find blog comments")
    }
})//DONE!


/*----------------UPDATECOMMENT--------------*/

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params;

    const {newComment} = req.body;

    console.log(newComment, commentId, "Comment and blogId ");

    if (!(isValidObjectId(commentId) || newComment)) {
        throw new ApiError(404, "Invalid commentId : can not update empty");
    }

    try {
        const updatedComment = await Comment.findByIdAndUpdate(commentId,
            {
                content: newComment
            },
            {
                new: true,
                validateBeforeSave: false
            })
        
            console.log(updatedComment,"Comment updated")

        res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated successfully"))

    } catch (error) {
        throw new ApiError(500, error, "Some error occurred while updating comment");
    }
}) //DONE!



const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    console.log(commentId,"Comment id")

    if (!isValidObjectId(commentId)) {
        throw new ApiError(404, "Enter Comment Id to delete comment")
    }

    try {
        const comment = await Comment.findById({_id:commentId})
        
        if (!comment) {
            throw new ApiError(404, "comment not found : See if comment id is correct")
        }
       
        if (comment.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not allowed to delete this comment")
        }
        
        const deletedComment = await Comment.findByIdAndDelete(commentId)
        
        if (!deletedComment) {
            throw new ApiError(500, "Comment could not deleted: try again")
        }

        res
        .status(200)
        .json(new ApiResponse(200, deletedComment, "Comment deleted successfully"))
    } catch (error) {
        throw new ApiError(500, "An error occured while deleting your comment: please try again later")
    }
})//DONE!



export {
    getBlogComments, 
    addComment, 
    updateComment,
    deleteComment
}