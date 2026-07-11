import APiError from "../utils/ApiError.js";
import ApiEror from "../utils/ApiError.js";
import {ApiResponse} from '../utils/ApiRespose.js'
import {uplaodclounary} from '../utils/cloudnary.js'
import { User, user } from "../Models/User.js";
import validator from "validator";

const register = async (req, res) => {
  // get user detail e.g username,email password etc.
  const {
    username,
    email,
    fullname,
    avatar,
    coverImage,
    password,
    refreshToken,
  } = req.body;

  if (
    [username, email, fullname, avatar, password].some(
      (fields) => !fields?.trim(),
    )
  ) {
    throw new ApiEror(400, "All fields are required");
  }

  if (!validator.isEmail(email)) {
    throw new APiError(400, "Wrong Email fromat");
  }
  if (!validator.isNumeric(fullname)) {
    throw new ApiEror("fullname is invalid");
  }

  //check that if teh suer already exist or not
  const userexisting = await User.findOne({
    $or: [{ email, username }],
  });
  if (userexisting) {
    throw new ApiEror(500, "USer already exist");
  }

  const avatarlocalpath = req.files?.avatar[0]?.path;
  const coverlocalpath = req.files?.coverImage[0]?.path;

  const avatarIMG = uplaodclounary(avatarlocalpath);
  const coverIMG = uplaodclounary(coverlocalpath);

  if(!avatarlocalpath){
    throw new ApiEror(500,'Avatar is requried')
  }

  //register user in database
  const userregistered = await User.create({
    username,
    email,
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
    refreshToken,
  });

  //remove the password and refreshtoken 
    const createuser = await User.findById(userregistered._id).select(
        "-password -refreshToken"
    )

    // print the api response
    return res.status(201).json(
         new ApiResponse(200,"user registered sucessfully")
    )
};

const login = (req, res) => {
  res.status(200).json({
    message: "this is login",
  });
};

const forgotpassword = async (req, res) => {
  res.status(200).json({
    message: "this is forgot password",
  });
};
export { login, register, forgotpassword };
