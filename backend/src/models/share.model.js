import mongoose, { Schema } from "mongoose";
const shareSchema = new Schema(
  {
    sender: {
      // one who is sending blog
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      //to whome you send blog : reciever
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    creator: {
      // whose blog is being shared 
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    sentBlog:{ //blog which is being shared
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    }
  },
  { timestamps: true }
);

export const Share = mongoose.model("Share", shareSchema);
