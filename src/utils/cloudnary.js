import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from 'fs';

cloudinary.config({
    cloud_name:process.env.CLOUDNARY_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
})

const uploadfile = async function (filepath) {
    try {
        if(!filepath) return;
    
       const response = await cloudinary.uploader.upload(filepath,{
            resource_type: 'auto'
        },
        console.log('fiel has been uploaded sucessfully',response.url)
        );   
    } catch (error) {
        fs.unlinkSync(filepath)
    }
}

export default uploadfile