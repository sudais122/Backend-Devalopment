import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiRespose.js";
import uplaodclounary from "../utils/cloudnary.js";
import { User } from "../Models/User.model.js";
import validator from "validator";
import { response } from "express";

//Register Controller
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

//Login Controller
const login = async (req, res) => {
  const { email, password } = req.body || {};

  // Validate request body
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "Invalid email");
  }

  // Check password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Get user without sensitive fields
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Login successful",
      ),
    );
};

//Logout Controller
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
    },
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
    .json(new ApiResponse(200, {}, "User logged out successfully"));
};

//update passowrd
const updatepassword = async (req, res) => {
  // get the old adn new password from the body
  const { oldpassword, newpassword } = req.body;

  // find the user from the db the user object is returened by the middleware
  const user = await User.findById(req.user?._id, { new: true });

  // check that is the old passowrd correct or not
  user.isPasswordCorrect(oldpassword);

  // if old passowrd is not corect throw apierror
  if (!oldpassword) {
    throw new ApiError(404, "Old password is incorrect");
  }

  //update the old password to new
  user.password = newpassword;

  // save the udpated passowrd to database
  await user.save({ validateBeforeSave: false });

  //send api response
  res.status.json(new ApiResponse(200, "Password change sucessfully"));
};

//update passowrd
const updateName = async (req, res) => {
  // get full name from the body
  const { fullname } = req.body;

  //update the name by database query "findByIdAndUpdate"
  const udpateduser = await findByIdAndUpdate(
    // find user by id
    req.user?._id,
    {
      //update the fullname
      $set: {
        fullname,
      },
    },
    //return teh update user
    {
      new: true,
    },
    // remove the passowrd and refreshtokena nd retuen us the user
  ).select("-password -refreshToken");

  return res.json(
    new ApiResponse(200, udpateduser, "Full name udated sucessfully"),
  );
};

// get current user
const GetCurrentUser = async (req, res) => {
  return res.json(new ApiResponse(200, req.user, "User fetched sucessfullt"));
};

//Upadte the Avatar
const UpdateAvatar = async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Local path not found");
  }

  await uplaodclounary(avatarLocalPath);

  await User.findByIdAndUpdate(
    req.file?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    },
  ).select("-passowrd -refreshToken");

    return res
  .status(200)
  .json(new ApiResponse(200,"Avatar updated sucessfully"))
};

// update cover image
const UpdateCover = async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Local path not found of cover image");
  }

  await uplaodclounary(coverImageLocalPath);

  await User.findByIdAndUpdate(
    req.file?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    },
  ).select("-passowrd -refreshToken");

  return res
  .status(200)
  .json(new ApiResponse(200,"Cover image updated sucessfully"))
};
export {
  login,
  register,
  updatepassword,
  logoutUser,
  GetCurrentUser,
  updateName,
  UpdateAvatar,
  UpdateCover
};
