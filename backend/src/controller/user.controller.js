import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOncloudinary, deleteFromCloudinary } from "../utils/cloudinaryFileUpload.js";
import  jwt  from "jsonwebtoken";
import { isValidObjectId } from "mongoose";

const generateAccessAndRefreshToken = async (userId) =>{
     try {
      const user = await User.findById(userId);
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false })
      return {accessToken, refreshToken}
     } catch (error) {
          throw new ApiError(500,error, "Error while generating access and token")
     }
}//DONE!

const registerUser = asyncHandler(async (req, res) => {
  //steps1 get user information from client
  //steps2 validate user information
  //step3 check if user is already registered email or username
  //step4 check for avatar
  //step5 upload to cloudinary server and check
  //steps6 create user object document on db using dn create
  //step7 remove user refresh token and pass from reposne
  //steps8 check if user not created
  //steps9 return response

                      //step1
  const { username, email, password, bio, fullName, role } = req.body;
  console.log(username, email, password, fullName, role);

              // Step2
  if (
    [username, email, password, fullName, role].some(
      (value) => value?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required fields");
  }

             // Step3
    const existedUserEmail = await User.findOne({
        email:email
    });
    console.log(existedUserEmail)
    if (existedUserEmail) {
    throw new ApiError(409, "Email already exists :try login");
    }

    const existedUser = await User.findOne({
       username:username
    });
    console.log(existedUser)
     if (existedUser) {
      throw new ApiError(409, "username already taken");
     }

  // Step4
  if(!req.files.avatar) {
    throw new ApiError(400, "Avatar is required");
  } 
  const avatarLocalPath = req.files?.avatar[0].path; // bcz of multer storage 2ns cd originalfilename and  name:"avatar" bcs in register route name is this
  if (!avatarLocalPath) { // sicne our user schema don't have avatr as required true for avatr
    throw new ApiError(400, "Avatar is required");
  }
           // Step5 
 const avatarUploaded = await uploadOncloudinary(avatarLocalPath)

 if (!avatarUploaded) {
    throw new ApiError(400, "Avatar is required");
 }

         // step6
 const user = await User.create(
    {
        username,
        email, // this is same as others
        password: password,
        fullName: fullName,
        role: role,
        bio: bio||"",
        avatar: avatarUploaded.secure_url,
    })

   const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
   ) // select what we dont want to include in the response
   
   if(!createUser) {
    const avatarUrl = avatarUploaded.url  // extract  url 

    const urlArrayOfAvatar = avatarUrl.split("/") // split url into array from every / point

    const avatarFromUrl = urlArrayOfAvatar[urlArrayOfAvatar.length - 1] // extracting avatar name with format 

    const avatarName = avatarFromUrl.split(".")[0] // only name of avatar without any format
    
    const avatrDeleted = await deleteFromCloudinary(avatarName)
    //console.log(avatrDeleted,"avatar deleted")
    throw new ApiError(500, "Something went wrong while registring user: try again later");
   }

  return res
   .status(201)
   .json(new ApiResponse(201, createUser, "User registerd successfully"))
});//DONE!


const loginUser = asyncHandler(async (req, res) => {
  // get data -> body
  // check if data is valid
  //find if user eixst or not
  // check password
  //generate access and refesh token
  // send response
    const {username, password,email } = req.body;

    if (!(username || email)) {
        throw new ApiError(401, " email or username not provided");
    }

    try {
      const user = await User.findOne(
        {
          $or: [{ username: username?.toLowerCase() }, { email: email?.toLowerCase()}],
        });

  
      if (!user) {
        throw new ApiError(404, "No user found with username or email id")
      }
      const isPasswordCorrect = await user.isPasswordCorrect(password); //user not User bcz this method  will work on instance of user User model not User model


      if (!isPasswordCorrect) {
          throw new ApiError(401,"Invalid user password")
      }

      const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
  
      const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
      ) // select what we dont want to include in the response
  
      //  -- above {user} nd {loggedInUser} are different becuase above user will have empty refreshToken field {see user model} bcz we haven't specified refreshtoken earlier
      console.log(user, loggedInUser, "user ,  loggedInUser see diffrence"); 
      
      const options= {  // since by default cookies can be mmodified by anyone from frint-end or server so by doing this sookies can only be modified from server side
        httpOnly: true,
        secure:true,
       }

  
       return res.
       status(200). 
       cookie("refreshToken", refreshToken, options). // BCZ WE HAVE INSTALLED COOKIE-PARSER and we have inserted middleware cookie-parser() on app.cookie-parser() 
       cookie("accessToken",accessToken, options). // cookies are two way that can be useed with req and res both
       json(
         new ApiResponse(
           200, // status code
           { // data returned that we wanted
            user: loggedInUser,
            accessToken,
            refreshToken,
           },
           "User successfully logged in" // success message
         )
       )
  
    } catch (error) {
       console.log(error, "Error in Login")
       throw new ApiError(500, "Error while logging in user")
    }
})//DONE!



const logoutUser = asyncHandler(async (req, res) => {
   /* -------------STEPS TO LOG  OUT --------------------------------*/ 
          // step 1: ----  taking user datails from req.user that we have added while as middleware while logout request
          try {
            await  User.findByIdAndUpdate(
              req.user._id, 
              {
                $unset: {
                  refreshToken: 1 //this remove field from databse
                }
              },
              {
                new: true, // to get updated new value with a refresh token as undefined otherqise we will get same value of refresh token
              }
            ) 
            //  -clear cookies
            const options = {
              httpOnly: true,
              secure: true,
            }
            
            const username = req.user.username;
            //console.log(req.user, "LOG OUT")
            return res
            .status(200)
            .clearCookie("refreshToken", options)
            .clearCookie("accessToken", options)
            .json(new ApiResponse(200, {username}, "User Logged Out"))
          } catch (error) {
             console.log(error, "LOG OUT Error")
             throw new ApiError(500," An error while logging out user")
          }

})//DONE!

  /*------------------------Refreshing access token-----------------------*/

  //  The main purpose of the refreshAccessToken function is to refresh the access token for an authenticated user
const refreshAccessTooken = asyncHandler(async (req, res) => {
     
      const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

      console.log(incomingRefreshToken, "\n IncomingAccessToken in refreshAccessTooken");

      if (!incomingRefreshToken) {
       throw new ApiError(401,"Unathorized Access");
     }
         
     try {
      
      const decodeRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)
      
       const user =  await User.findById(decodeRefreshToken?._id)
       
       //we have genearetd refreshtoken with only _id
       if (!user) {
        
         throw new ApiError(401, "Inavalid refresh token")
       }
       
       if (incomingRefreshToken !== user?.refreshToken) {   // ja aa raha wo user ke pass hona bhi chahiye i.e the incomingrefreshtoken must be same as the on which user have at database
         throw new ApiError(401,"Refresh token is expired or used"); 
      }
      
       const {accessToken, newRefreshToken} = await generateAccessAndRefreshToke
       const options = {
         httpOnly: true,
         secure: true,
       }

       return res
       .status(200)
       .cookie("refreshToken", newRefreshToken, options)
       .cookie("accessToken", accessToken, options)
       .json(
         new ApiResponse(
           200,
           {
             refreshToken:newRefreshToken, accessToken           
           },
         "AccessToken generated succesfully"
       ))
     } catch (error) {
      console.log(error, "Error in refresh token")
       throw new ApiError(401, "Invalid refresh token");
     }
})//Done


const forgetPassword = asyncHandler(async (req, res) => {
        const {email, username, newPassword, confirmPassword} = req.body

        if (!(email || username)) {
            throw new ApiError(400, "Enter a valid email or username to change password")
        }

        if ((newPassword !== confirmPassword) && (newPassword.length < 8)) {
            throw new ApiError(400, "Passwords do not match")
        }
        //console.log(newPassword, "\n 11" , confirmPassword)

        try {
        const user = await User.findOne(
           {
              $or: [{ username: username.toLowerCase() }, { email }],
          })
  
        if (!user) {
              throw new ApiError(404, "User not found")
        }
        //console.log(user._id.toString(),"===", req.user._id)
        if (user._id.toString() !== req.user._id.toString()) {
              throw new ApiError(401, "You are not authorized to perform this action")
        }
  
        user.password = confirmPassword
        await user.save({validateBeforeSave: false});
  
        console.log("forget user password  changed")
        return res
        .status(200)
        .json(new ApiResponse(200, user.username, ": Password changed succesfully"))
        } catch (error) {
          console.log("error in forget password: ", error)
           throw new ApiError(500, "Error while updating user password: Please try again later")
        }
})//DONE!


const changeCurrentPassword = asyncHandler(async (req, res)  => {
       
  //take  old password and new and confrimnewpas from user 
  const {oldPassword, newPassword, confirmPassword} = req.body;
  if (!(newPassword === confirmPassword)) {
    throw new ApiError(400, "newPassword does match confirm password")
  }
  console.log(oldPassword, newPassword, "oldPassword and newPassword in changeCurrentPassword");
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "oldPassword and newPassword are reqiuired");
  }

  // now find user to update its oldpassword
 
    try {
      const user = await User.findById(req.user._id); // bcz while login we have added user in as obj in req through auth midd
      const isPasswordValid =  await user.isPasswordCorrect(oldPassword); // method we declared in schema
      if (!isPasswordValid) {
        throw new ApiError(404, "Password does not match with your old password : Try again");
      }
  
      //  update user password and save new password
  
      user.password = newPassword
      await user.save({validateBeforeSave:false})

      console.log("password changed successfully")

      return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password updated"))
    } catch (error) {
      console.log("error from change password:  ", error)
       throw new ApiError(500, error?.message || "An error occured while changing current password")
    }
})//DONE!


const getCurrentUser = asyncHandler(async (req, res) => {
     try {
      const user = await User.findById(req.user._id)
      if (!user) {
        throw new ApiError(404, "User not found")
      }
      const userFound = {
        userId: req.user._id,
       username: user.username,
       fullName: user.fullName,
       email: user.email,
       role: user.role,
       bio: user.bio,
       avatar: user.avatar,
      }
      return res
      .status(200)
      .json(new ApiResponse(200, userFound, "User details fetched succesfully"))
     } catch (error) {
      throw new ApiError(500, "An error occured while getting current user")
     }
})//DONE!

const getUserById = asyncHandler(async (req, res) => {
  const {userId} = req.params  // destructuring should be same as in defined route name

   if (!isValidObjectId(userId)) {
       throw new ApiError(400, "Invalid user id")
   }
   
  try {
    
     const user = await User.findById(userId)

    console.log(user, "userId")
     if (!user) {
        throw new ApiError(404, "Blog not found")
     }
     
    res
     .status(200)
     .json(
      new ApiResponse(200, user,  "Successfully fetched user by id")
     )
  } catch (error) {
     throw new ApiError(500, `An error while fetching blog by ${userId}`)
  }
})//DONE

const updateUserDetails = asyncHandler(async (req, res) => {
      const {username, email, fullName, role, bio} = req.body

       if (!username && !email && !fullName && !role && !bio) {
        throw new ApiError(400, "Please provide at least one field to update")
      }

       try {
        const user = await User.findByIdAndUpdate(
         req.user._id,
         {
          $set: {
            username,
            email,
            fullName,
            role,
            bio:bio // this is same as above field its just diff style of writing
          }
        },
        {new:true}
       ).select("-password -refreshToken");
 
       if (!user) {
           throw new ApiError(404, "User not found")
       }
 
       console.log("User details updated")

       return res
       .status(200)
       .json(new ApiResponse(200, user, "User details updated succesfully"))
      
      } catch (error) {
          console.log("User details updated:  "+ error)
          throw new ApiError(500, "An error occured whil updating user details")
       }

})//DONE!


const updateUserAvatar = asyncHandler(async (req, res) => {
        try {
        const user = await User.findById(req.user?._id)
          
        if (!user) {
             throw new ApiError(404, "User not found can not update avatar")
        }
          
        const avatarUrl = user.avatar  // extract video url from video document
  
        const urlArrayOfAvatar = avatarUrl.split("/") // split url into array from every / point
  
        const avatarFromUrl = urlArrayOfAvatar[urlArrayOfAvatar.length - 1] // extracting video name with format
  
        const avatarName = avatarFromUrl.split(".")[0] 
  
       if(avatarName)
       { 
        await  deleteFromCloudinary(avatarName)
      }
     // console.log("1")
      
     const avatarLocalPath = req.file?.path
      
      //console.log(avatarLocalPath,"avatar")

      if (!avatarLocalPath) {
         // console.log(avatarLocalPath , "\n Cannot", req.files.avatar.url, " because")
           throw new ApiError(404, "Please provide avatar to update")
       }

          const updatedAvatar = await uploadOncloudinary(avatarLocalPath)
            
          if (!updatedAvatar) {
               throw new ApiError(500, "An error occured while uploading avatar")
          }
          
          //console.log(user.avatar, "user.avatar in updateUserAvatar")
         
          const updatedUser =   await User.findByIdAndUpdate(
            req.user?._id,
      
            {
              $set:{
                avatar:updatedAvatar.url
              }
            },
            {new:true}
            ).select("-password -refreshToken")

          //console.log(user.avatar, "update user.avatar")
          return res
          .status(200)
          .json(new ApiResponse(200, updatedUser, "User avatar updated succesfully"))

        } catch (error) {
          console.log(error, "error in updateUserAvatar")
          throw new ApiError(500, "An error occured while updating avatar")
        }

        
})//DONE!


const getUserBlogProfile = asyncHandler(async (req, res) => {
  const {username} = req.params; // we are taking username form url not from body
    
    if (!username?.trim()) {
      throw new ApiError(400, "Username is missing");
    }
    console.log(username,"------------")
    try {
        const authorProfile = await User.aggregate([ // [{},{},{}] aggregate takes array as input and return arrray and each curly bracket represtn a stage
          {
            $match:{
              username: username?.toLowerCase()
            }
          },
          {
            $lookup: {
              from: "blogs",
              localField: "_id",
              foreignField: "author",
              as: "blogs"
            }
          },
          {
            $addFields:{ // number of blogs that user wrote
              blogs: {
                $size: "$blogs"
              }
            }
          },
          {
            $project:{  // this is what we want to  To include any other fields from the input documents in the output documents, you must explicitly specify the inclusion in 
              username:1,
              fullName:1,
              email:1,
              role:1,
              bio:1,
              avatar:1,
              blogs:1
            }
          }
         
        ])
      
        console.log("yuyuyuu", authorProfile[0], "blogProfile from channelpipleline", authorProfile )

        if (authorProfile?.length === 0 || authorProfile?.length === null || authorProfile[0] === undefined ) { // channel[0] === udefined means usr is searching for channel which does not ecxist
            throw new ApiError(404, `${username} has no existing blog profile`);
        }

        console.log(authorProfile, "user in getUserDetails")
        return res
       .status(200)
       .json(
        new ApiResponse(200, authorProfile, "successfully fetched user details")
       )
      
    } catch (error) {
      console.log(error, "error in getUserDetails")
      throw new ApiError(500,"An error occured while getting user details")
    }
})//DONE!


const deleteUser = asyncHandler(async (req, res) => {
         const {username, password} = req.body; // we are taking username form url not from body
    
         if (!(username?.trim() || password)) {
             throw new ApiError(400, "Username or password is missing");
        }

      try {
        const user  = await User.findOne({username: username})
        
        if (!user) {
           throw new ApiError(404, "User not found cannot be deleted")
        }
        
        const isPasswordValid =  await user.isPasswordCorrect(password); // method we declared in schema
        
        if (!isPasswordValid) {
          throw new ApiError(404, "Password does not match with your old password : Try again");
        }
        
        console.log(req.file?.path, "req.file.path in deleteUser")
       
        await  deleteFromCloudinary(req.file?.path)
        
        const deletedUser = await user.remove()

        console.log("User deleted: " + deleteUser)
        return res
       .status(200)
       .json(
        new ApiResponse(200, deleteUser, "successfully deleted user")
       )

      } catch (error) {
        console.log(error, "error in deleteUser")
        throw new ApiError(500, "An error occured while deleting user")
      }
})//DONE!






export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessTooken, 
    forgetPassword,
    changeCurrentPassword,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar, 
    deleteUser,
    getUserBlogProfile,
    getUserById,
};
