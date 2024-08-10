import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend origin
  credentials: true, // Allow credentials (cookies, headers, etc.)
};

app.use(cors(corsOptions)); // Apply the CORS middleware with the options

// Middleware to parse incoming JSON and URL-encoded requests
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

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
app.use('/api/v1/user', userRouter);
app.use('/api/v1/blog', verifyJWT, blogRouter);
app.use('/api/v1/share', shareRouter);
app.use('/api/v1/like', likeRouter);
app.use('/api/v1/comment', commentRouter);

export { app };
