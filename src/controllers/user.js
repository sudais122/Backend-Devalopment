import APiError from "../utils/ApiError.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiRespose.js";
import uplaodclounary from "../utils/cloudnary.js";
import { User } from "../Models/User.js";
import validator from "validator";

const register = async (req, res) => {
  // Get text fields
  const { username, email, fullname, password } = req.body;
  console.log(req.body);
  // Validate required text fields
  if ([username, email, fullname, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Validate email
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Validate full name (letters and spaces only)

  if (validator.isNumeric(fullname)) {
    throw new ApiError(400, "Full name is invalid");
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // Get uploaded files
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // Upload to Cloudinary
  const avatar = await uplaodclounary(avatarLocalPath);

  let coverImage = null;

  if (coverImageLocalPath) {
    coverImage = await uplaodclounary(coverImageLocalPath);
  }

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar");
  }

  // Create user
  const createdUser = await User.create({
    username,
    email,
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  });

  // Remove sensitive fields
  const user = await User.findById(createdUser._id).select(
    "-password -refreshToken",
  );

  if (!user) {
    throw new ApiError(500, "Failed to register user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate required text fields
  if ([email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // match the password and email in database
  const emailmatch = await User.findOne({ email });

  //cehck if the email avalibale
  if (!emailmatch) {
    throw new ApiError(404, "email is invalid");
  }

  //comapre passowrd
  const isPasswordvalid = await user.isPasswordCorrect(password);

  if (!isPasswordvalid) {
    throw new ApiError(401, "invalid password");
  }

  const logedin = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  //generate tokens
  const AcessToken = user.generateAccessToken();
  const RefreshToken = user.generateRefreshToken();

  User.RefreshToken = RefreshToken;

  await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("acesstoken", AcessToken, options)
    .cookie("refreshtoken", RefreshToken, options)
    .json(
      new ApiResponse(200, {
        user: logedin,
        RefreshToken,
        AcessToken,
      }),
    );
};


const logoutUser = async (req, res) => {
  // Remove Refresh Token from database
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  // Remove cookies
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, {}, "User logged out successfully")
    );
};
const forgotpassword = async (req, res) => {
  res.status(200).json({
    message: "this is forgot password",
  });
};
export { login, register, forgotpassword, logoutUser };
