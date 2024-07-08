import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema(
    {
        comment:  // if we like a comment 
        {
            type:Schema.Types.ObjectId,
            ref:"Comment",
        },
        blog: // if we like a blog
        {
            type:Schema.Types.ObjectId,
            ref:"Blog"
        },
        likedBy: // who liked 
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }

    },{timestamps:true})

    export const Like = mongoose.model("Like", likeSchema);