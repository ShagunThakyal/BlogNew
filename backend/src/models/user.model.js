import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true // this should be true for those field which are going to be used for searching
    },
    email:{
        type:String,
        required: false,
        unique: true,
        lowercase: true,
        trim: true,
        validate:{
            validator: async function(value){
               // Regular expression to match the email format
               return /\S+@\S+\.\S+/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password:{
        type: String,
        required: false,
        minlength: 8,
        trim: true,
    },
    fullName:{
        type: String,
        required: false,
        trim: true,
        index: true 
    },
    avatar:{
        type: String,//to save url of profile picture
        required: false,
    },
    bio:{
        type: String,
        required: false,
        default:"blog writer"
    },
    role:{
        type:String,
        required: false,
        trim: true,
        default: "user"//Defines the user's role or permissions within the blog system. For example, "user", "admin", "editor", etc.
    },
    refreshToken:{
        type: String,
    }
},{timestamps: true});



userSchema.pre("save", async function (next){ // pre is middleware hook which executes evrytime just before saving document
    if(!this.isModified("password"))return next(); ;
    this.password =await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {  // methods is is used to add any property  in the schema
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function (){
   return jwt.sign(
        { // this is payload i.e user info will be stored in jwt token
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function (){ // these methods are used generate token using payload provided here like this_id
    return jwt.sign(
         { // this is payload i.e user info will be stored in jwt token
             _id: this._id,
         },
         process.env.REFRESH_TOKEN_SECRET_KEY,
         {
             expiresIn: process.env.REFRESH_TOKEN_EXPIRY
         }
     )
 }
//what is jwt ? ANS IS> IT IS a beare token anyone with this token will be allowed to recive data on sending request

export const User = mongoose.model("User", userSchema);