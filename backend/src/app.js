import express from 'express';//Fast, unopinionated, minimalist web framework for Node.js. Robust routing .Focus on high performance. Super-high test coverage. HTTP helpers (redirection, caching, etc)
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

const allowedOrigins = ['http://localhost:5173', 'https:/deploy-mern-1whq.vercel.app']; // List of allowed origins

app.use(cors({
    origin: function (origin, callback) {
        // Check if the incoming origin is in the allowedOrigins list or if no origin (server-to-server request)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json({limit: "20kb"})); // help to parse incoming req and extract things from request
app.use(express.urlencoded({extended: true, limit:"20kb"}))
app.use(express.static("public"))
app.use(cookieParser())



//routes import 
import userRouter from "./routes/user.routes.js"
import blogRouter from "./routes/blog.routes.js"
import shareRouter from "./routes/share.routes.js"
import likeRouter from "./routes/like.routes.js"
import commentRouter from "./routes/comment.routes.js"
import { verifyJWT } from './middleware/auth.middleware.js';

//route declarations / api creation
app.use("/api/v1/user", userRouter) // here /user will act as prefix then whatever is the route of userRouter will be added e.g hhtps://localhost/9000/api/v1/user/regiter etc  
app.use("/api/v1/blog",verifyJWT, blogRouter) // here /blog will act as prefix then '' '' '' '' '' '' '' '' '' 
app.use("/api/v1/share", shareRouter)// here /blog will act as prefix 
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/comment", commentRouter)

export { app }