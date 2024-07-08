import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const blogSchema = new Schema({
      title:{
        type: String,
        required: [true,"title required"],
        uppercase: true,
        index: true // this should be true for those field which are going to be used for searching
      },
      content:{
        type: String,
        required: [true,"content required"],
        index: true // this should be true so that user can directly search for required content
      },
      category:{
        type: String,
        required: true,
      },
      image:{
        type:String,
        required: false,
      },
      author:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      isPublished:{
        type:Boolean,
        default:true,
      },
      viewCount:{
        type:Number,
        default:0,
      }
},{timestamps: true});

blogSchema.plugin(mongooseAggregatePaginate);//Adding the plugin to a schema

export const Blog = mongoose.model("Blog", blogSchema);