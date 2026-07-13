import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const verifyJWT = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify Access Token
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // Find user in database
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
};

export { verifyJWT };