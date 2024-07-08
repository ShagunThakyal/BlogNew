import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY 
});

const uploadOncloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null;
        const uploadResponse = await cloudinary.uploader.upload(localFilePath,
             {
                resource_type:"auto"
             })
        fs.unlinkSync(localFilePath)
        //console.log("Uploaded file on cloudinary: " , uploadResponse.url) 
        return uploadResponse
    } catch (error) {
        fs.unlinkSync(localFilePath)// remove local saved file from server as upload opeartion is failed , bcz file might be corrupted or mallicious
        return null;
    }
}

const deleteFromCloudinary = async (oldFilePublicId) => {
    try {
      if(!oldFilePublicId) return null;
      // delete the file on cloudinary.
      const response = await cloudinary.uploader.destroy(oldFilePublicId, { invalidate: true, resource_type:"image"});
      console.log("File deleted on cloudinary", oldFilePublicId);
      return response;
    } 
    catch (error) {
      return error;
    }
  };

export {uploadOncloudinary, deleteFromCloudinary}

































// imp definitions and diff between multer and clouding
/*
File is upload by multer from incoming req while cloudinary is a service like aws
Multer is a simple middleware for handling file uploads in Node.js, while Cloudinary provides a comprehensive cloud-based solution for managing media assets with advanced features and integrations.
*/