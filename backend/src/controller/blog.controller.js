import { Blog } from "../models/blog.model.js"
import { User } from "../models/user.model.js"
import { Share } from "../models/share.model.js"
import { uploadOncloudinary, deleteFromCloudinary } from "../utils/cloudinaryFileUpload.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose, { isValidObjectId } from "mongoose"

const publishBlog = asyncHandler(async (req, res) => {
    console.log("1");
    const { title, content, category} = req.body;

    if (!(title || content)) {
        throw new ApiError(404, "Please provide a title and content");
    }

    if(!category){
        throw new ApiError(400, "Please provide a category");
    }

    console.log("2");
    const imageLocalPath = req.files?.image[0]?.path;
    console.log("3 - Image local path:", imageLocalPath);

    try {
        const uploadedImage = await uploadOncloudinary(imageLocalPath);

        if (!uploadedImage) {
            throw new ApiError(500, "couldn't upload image try again");
        }

        console.log("4 - Uploaded image:", uploadedImage);

        const blog = await Blog.create({
            title: title,
            content: content,
            category,
            image: uploadedImage.secure_url,
            author: req.user._id, // bcz we have added user object: verifyjwt 
            isPublished: true,
            viewCount: 0,
        });

        if (!blog) {
            throw new ApiError(400, "Can't create blog try again");
        }

        console.log("5 - Blog created:", blog);

        const newBlog = await Blog.findById(blog._id);

        if (!newBlog) {
            throw new ApiError(500, "Could not create blog: try again");
        }

        // console.log("6 - New blog found:", newBlog);

        res
            .status(201)
            .json(
                new ApiResponse(201, newBlog, "Successfully published blog")
            );
    } catch (error) {
        console.log("Error details:", error);
        throw new ApiError(500, "An error occurred while publishing your blog: Please try again");
    }
});



const getBlogById = asyncHandler(async (req, res) => {
      const {blogId} = req.params  // destructuring should be same as in defined route name

       if (!isValidObjectId(blogId)) {
           throw new ApiError(400, "Invalid blog id")
       }
       
      try {
        
         const blog = await Blog.findById(blogId)
  
        console.log(blog, "blogbyid")
         if (!blog) {
            throw new ApiError(404, "Blog not found")
         }
         
         if (blog.isPublished === false && blog.author.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Blog is not published yet")  // this step is important in this controller 
         }
         const updateBlog = await Blog.updateOne(
            {_id: blogId}, // This is the filter criteria that specifies which document to update.
            {$inc: {viewCount :1}},
            {new:true , validateBeforeSave:false}
        )

        if (updateBlog.nModified === 0) {
            throw new ApiError(404, "Blog not found: no updates done")
        }
        /*This line of code checks if no documents were modified during the update operation. If nModified is 0, it means that the document with the specified _id was not found or no updates were necessary. */
        
        // console.log(updateBlog, "updated",blog) both documents are different updated giev info like acknowledged: , modifiedCount: 1 in this case, upsertedId: null, upsertedCount: 0,
       
        res
         .status(200)
         .json(
          new ApiResponse(200, blog,  "Successfully fetched blog")
         )
      } catch (error) {
         throw new ApiError(500, `An error while fetching blog by ${blogId}`)
      }
})//DONE


const filterBlogByTitle = asyncHandler(async (req, res) => {
        const { title } = req.params;

        if (!title) {
                throw new ApiError(404, "No title provided")
        }

        try {
           const blog = await Blog.find({title: {$regex: title, $options: "i"}})
        /*
           ABOVE LINE EXPLAINATION
           It constructs a query object to perform a case-insensitive(BUT OUR TITKLE IS UPPERCASE) regular expression search 
           ($regex) on the title field. The $options: "i" option ensures a case-insensitive search. 
           REGEX
            apply regular expressions (regex) when you need to perform pattern matching, searching, 
            or extracting specific parts of text within a larger string or datase
        */

            if (!blog) {
               throw new ApiError(404, `No blogs found with title ${title}`)
            }

            res
            .status(200)
            .json(
             new ApiResponse(200, blog,  "Successfully fetched blogs by given title")
            )
         } catch (error) {
            throw new ApiError(500, "An error while fetching blogs by given title: Try again")
         }
})//DONE!


const getAllBlogs = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType } = req.query;

    const userId = req.user._id;

    if (!(query || isValidObjectId(userId))) {
        throw new ApiError(400, "Required field: query or userId");
    }

    // console.log(query, sortType, sortBy, userId, "query, sortType, sortBy, userId");

    try {
        // Parse page and limit parameters
        const pageLimit = parseInt(page);
        const limitNumber = parseInt(limit);
        // Calculate the skip value for pagination
        const skip = (pageLimit - 1) * limitNumber;
        console.log(pageLimit, skip, limitNumber, "from blog page limit");

        const pipeline = [
            {
                $match: {
                    $and: [
                        { $or: [
                            { author: new mongoose.Types.ObjectId(userId) },
                            { title: query ? { $regex: query, $options: "i" } : { $exists: true } },
                            { content: query ? { $regex: query, $options: "i" } : { $exists: true } }
                        ]}
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDetails",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                email: 1,
                                fullName: 1,
                                bio: 1,
                                role: 1,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "shares",
                    localField: "_id",
                    foreignField: "sentBlog",
                    as: "blogShares",
                    pipeline: [
                        {
                            $project: {
                                sender: 1,
                                receiver: 1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "blog",
                    as: "commentsOnBlog",
                    pipeline: [
                        {
                            $project: {
                                content: 1,
                                blog: 1,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "blog",
                    as: "likesOnBlog",
                    pipeline: [
                        {
                            $project: {
                                blog: 1,
                                likedBy: 1
                            }
                        }
                    ]
                }
            },
            {
                $sort: {
                    [sortBy]: sortType === "desc" ? -1 : 1,
                    createdAt: -1  // Sort by createdAt in descending order
                }
            },
            { $skip: skip },
            { $limit: limitNumber }
        ];

        // console.log(pipeline, "pipeline of blog");

        if (!pipeline || pipeline.length === 0) {
            throw new ApiError(500, "Loading Failed : Please try again later");
        }

        const blogsAggregated = await Blog.aggregatePaginate(pipeline); // aggregate and paginated results

        if (!blogsAggregated || blogsAggregated.length === 0) {
            console.log(blogsAggregated.length, "q");
            throw new ApiError(500, "Failed to get all blogs. Please try again later");
        }

        res.status(200).json(
            new ApiResponse(200, { blogsAggregated }, "Successfully fetched all blogs")
        );
    } catch (error) {
        console.error("An error occurred while fetching all blogs:", error);
        throw new ApiError(500, "An error occurred while fetching all blogs");
    }
});



 const updateBlog = asyncHandler(async (req, res) => {
    const { title, content, category } = req.body;

    if (!(title || content || category)) {
        throw new ApiError(400, "Please provide a title or content");
    }

    const imageLocalPath = req.file?.path;

    try {
        let uploadedImage;

        if (imageLocalPath) {
            uploadedImage = await uploadOncloudinary(imageLocalPath);
        }

        if (!uploadedImage && imageLocalPath) {
            throw new ApiError(500, "Cannot upload image this time, try again later");
        }

        const blog = await Blog.findOne({ _id: req.params.blogId, author: req.user._id });

        if (!blog) {
            throw new ApiError(401, "You are not allowed to update this blog");
        }

        // Delete the old image from Cloudinary
        if (blog.image) {
            const imagePublicId = blog.image.split('/').pop().split('.')[0];
            const deleteImage = await deleteFromCloudinary(imagePublicId);

            if (!deleteImage) {
                throw new ApiError(500, "Could not delete image from Cloudinary database so could not update");
            }
        }

        // Update the blog
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.category = category || blog.category;
        if (uploadedImage) {
            blog.image = uploadedImage.secure_url;
        }

        const updatedBlog = await blog.save({ validateBeforeSave: false });

        res.status(200).json(new ApiResponse(200, updatedBlog, "Blog updated successfully"));
    } catch (error) {
        throw new ApiError(500, "An error occurred while updating blog");
    }
});


const togglePublishStatus = asyncHandler(async (req, res) => {
        const {blogId} = req.params

        if (!isValidObjectId(blogId)) {
            throw new ApiError(401, "Invalid blog id")
        }

        try {
            const blog = await Blog.findById(blogId)
            
            if (!blog) {
                throw new ApiError(404, "Blog not found")
            }
    
            if (blog.author.toString() !== req.user._id.toString()) {
                throw new ApiError(401, "You are not allowed to this action")
            }
            
            const updatedBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $set:{
                    isPublished:!blog.isPublished,
                }},
                { new: true, validateBeforeSave:false }
            )
            console.log(updatedBlog, "updated blog")
            if (!updatedBlog) {
                 throw new ApiError(500, "Could not update blog status")
            }
            res
            .status(200)
            .json(new ApiResponse(200, updatedBlog, "blog status toggled successfully"))
        } catch (error) {
             throw new ApiError(500, "An error occurred while toggling your blog status:  Please try again")
        }
})//DONE!


const deleteBlog = asyncHandler(async (req, res) => {
            const { blogId } = req.params

            if (!isValidObjectId(blogId)) {
                throw new ApiError(401, "Invalid blog ID")
            }

            try {
                const blog = await Blog.findById(blogId)

                if (!blog) {
                    throw new ApiError(404, "No blog found with blogId ")
                }

                 if (blog.author.toString()!== req.user._id.toString()) {
                    throw new ApiError(401, "You are not author of this blog so you can not do this action")
                }
                
                const blogImagePublicId = blog.image.split('/').pop().split('.')[0]; // extracting image public id from image url
                
                if (blogImagePublicId) {
                    const result = await deleteFromCloudinary(blogImagePublicId)
                    if (!result) {
                        console.log("Deletion of blogImage from Cloudinary failed before blog deletion")
                    }
                }
                const deleteBlog = await Blog.findByIdAndDelete(blogId)

                 if (!deleteBlog) {
                    throw new ApiError(500, "Could not delete blog from database")
                 }

                 res
                 .status(200)
                 .json(new ApiResponse(200, deleteBlog, "blog deleted successfully"))
            } catch (error) {
                throw new ApiError(500, "An error occurred while deleting blog: Please try again")
            }
})//DONE!



export {
    publishBlog,
    getBlogById,
    getAllBlogs,
    updateBlog,
    deleteBlog,
    togglePublishStatus,
    filterBlogByTitle
}

/*------------------DEFINITION--------------------------------
 //---------------LOOKUP--------------------------------
The $lookup operator performs a left outer join to another collection in the 
same database. It pulls in documents from another collection (users in this case) based on matching criteria.
//---------------------left outer join---------------------------------------------------- 
A left outer join,NORMALLY "left join," is a type of database join operation that 
retrieves all records from the left table (or collection) and the matching records
 from the right table (or collection). If there is no matching record in the right table
 , NULL values are returned for the columns from the right table.

In the context of MongoDB's $lookup operator:

The "left" collection refers to the collection you are running the $lookup operation on.IN OUR CASE IT IS BLOG
The "right" collection is the collection you are joining with using the $lookup operator.LIKE USER SHARE ETC
*/