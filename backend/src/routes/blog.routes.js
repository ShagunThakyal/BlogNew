import { Router } from 'express';
import {
    publishBlog,
    getBlogById,
    getAllBlogs,
    updateBlog,
    deleteBlog,
    togglePublishStatus,
    filterBlogByTitle
} from '../controller/blog.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router
    .route('/')
    .get(getAllBlogs)
    .post(
        upload.fields([
            {
                name: 'image',
                maxCount: 1
            }
        ]),
        publishBlog
    );

router
    .route('/:blogId')
    .get(getBlogById)
    .delete(deleteBlog)
    .patch(upload.single('image'), updateBlog);

router
    .route('/toggle/publish/:blogId')
    .patch(togglePublishStatus);

router
    .route('/filter-title/:title')
    .get(filterBlogByTitle);

export default router;
