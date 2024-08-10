import express from 'express'; // Fast, unopinionated, minimalist web framework for Node.js
import cors from 'cors'; // CORS middleware for Express
import cookieParser from 'cookie-parser'; // Middleware for parsing cookies

const app = express();

// Middleware to enable CORS for all origins
app.use(cors({ origin: '*' }));

// Middleware to parse incoming JSON and URL-encoded requests
app.use(express.json({ limit: '20kb' })); // Limit JSON payload to 20kb
app.use(express.urlencoded({ extended: true, limit: '20kb' })); // Limit URL-encoded payload to 20kb

// Middleware to serve static files from the "public" directory
app.use(express.static('public'));

// Middleware to parse cookies
app.use(cookieParser());

// Importing route modules
import userRouter from './routes/user.routes.js';
import blogRouter from './routes/blog.routes.js';
import shareRouter from './routes/share.routes.js';
import likeRouter from './routes/like.routes.js';
import commentRouter from './routes/comment.routes.js';
import { verifyJWT } from './middleware/auth.middleware.js';

// Route declarations / API creation
app.use('/api/v1/user', userRouter); // Routes for user-related operations
app.use('/api/v1/blog', verifyJWT, blogRouter); // Routes for blog-related operations (JWT verification required)
app.use('/api/v1/share', shareRouter); // Routes for share-related operations
app.use('/api/v1/like', likeRouter); // Routes for like-related operations
app.use('/api/v1/comment', commentRouter); // Routes for comment-related operations

export { app };
