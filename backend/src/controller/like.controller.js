import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

/*--------------------toggleBlogLike----------------*/

const toggleBlogLike = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    // TODO: Toggle like on video
    if (!isValidObjectId(blogId)) {
        throw new ApiError(404, "Invalid video id provided");
    }

    try {

        // Check if the user has already liked the blog
    
        const existingLike = await Like.findOne({ blog: blogId, likedBy: req.user._id });

        if (existingLike) {
            // User has already liked the blog, remove the like
            await Like.deleteOne({ _id: existingLike._id });
            res.status(200).json(new ApiResponse(200, null, "Like removed on blog successfully"));
        } else {
            // User has not liked the blog, add the like
            const newLike = await Like.create({ blog: blogId , likedBy: req.user._id , });
            res.status(200).json(new ApiResponse(200, newLike, "Like added on blog successfully"));
        }
    } catch (error) {
        throw new ApiError(500, error, "Some error occurred while toggling video like: Try again later");
    }
});//DONE!

/*-----------------toggleCommentLike----------------*/

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    // TODO: Toggle like on comment
    if (!isValidObjectId(commentId)) {
        throw new ApiError(404, "Invalid commentId");
    }

    try {
        // Check if the user has already liked the comment
        const existingLike = await Like.findOne({ comment: commentId , likedBy:req.user._id});

        if (existingLike) {
            // User has already liked the comment, remove the like
            await Like.deleteOne({ _id: existingLike._id });
            res.status(200).json(new ApiResponse(200, null, "Like removed on commnent successfully"));
        } else {
            // User has not liked the comment, add the like
            const newLike = await Like.create({ comment: commentId , likedBy:req.user._id });
            res.status(200).json(new ApiResponse(200, newLike, "Like added on comment successfully"));
        }
    } catch (error) {
        throw new ApiError(500, error, "Some error occurred while toggling comment like: Try again later");
    }
});//DONE!


/*--------------------getLikesBlogs------------------*/

const getLikedBlog = asyncHandler(async (req, res) => {
    //TODO: get all liked blogs
    try {
        const likedBlogs = await Like.find({ blog: { $ne: null }, likedBy: req.user._id }) // find all liked blogd so pass without any argument
    
        if (!likedBlogs || likedBlogs.length === 0) {
            throw new ApiError(404, "No liked blogs found")
        }
    
        res
       .status(200)
       .json(new ApiResponse(200, likedBlogs, "Liked blogs fetched successfully"))
    } catch (error) {
        throw new ApiError(500, error, "Some error occured while getting liked blogs")
    }
})//DONE!


/*--------------------getLikesComments------------------*/

const getLikedComments = asyncHandler(async (req, res) => {
    // TODO: Get all liked comments
    try {
        console.log(req.user._id)
        const likedComments = await Like.find({ comment: { $ne: null } , likedBy: req.user._id}); // Find documents where the "comment" field is not empty
        console.log(likedComments)
        if (!likedComments || likedComments.length === 0) {
            throw new ApiError(404, "No liked comments found");
        }
    
        res.status(200).json(new ApiResponse(200, likedComments, "Liked comments fetched successfully"));
    } catch (error) {
        throw new ApiError(500, error, "Some error occurred while getting liked comments");
    }
});//DONE!




export {
    toggleCommentLike,
    toggleBlogLike,
    getLikedBlog,
    getLikedComments,
}