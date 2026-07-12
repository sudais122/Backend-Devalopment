import APiError from "../utils/ApiError.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from '../utils/ApiRespose.js'
import uplaodclounary from '../utils/cloudnary.js'
import { User} from "../Models/User.js";
import validator from "validator";

const register = async (req, res) => {
  // Get text fields
  const {
    username,
    email,
    fullname,
    password,
  } = req.body;
  console.log(req.body);
  // Validate required text fields
  if (
    [username, email, fullname, password].some(
      (field) => !field?.trim()
    )
  ) {
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
    $or: [
      { email },
      { username },
    ],
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
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(500, "Failed to register user");
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      user,
      "User registered successfully"
    )
  );
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
