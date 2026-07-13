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
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true
    }

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
        "Login successful"
      )
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
