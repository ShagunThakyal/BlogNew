import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import dotenv from 'dotenv';

dotenv.config();

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "Invalid Access Token: no token provided");
        }

        console.log("Token received:", token);

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

        const user = await User.findById(decodeToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Invalid Access Token: user not found");
        }

        req.user = user; // add user object in request
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        throw new ApiError(401, error.message, "Invalid Access Token: error in auth.middleware");
    }
});
