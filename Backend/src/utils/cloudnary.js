import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "atwlzm3l",
  api_key: "257274111174497",
  api_secret: "pOLYUCCEejiFZjeMvqDi2EVkug8",
});

const uploadfile = async function (filepath) {
  try {
    if (!filepath) return null;

    const response = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });

    console.log("file has been uploaded successfully", response.url);

    fs.unlinkSync(filepath); 
    return response;
  } catch (error) {
    console.error("cloudinary upload failed:", error.message); 
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    return null;
  }
};

export default uploadfile;