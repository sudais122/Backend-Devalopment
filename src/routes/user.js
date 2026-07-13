import { Router } from "express";
import {
  register,
  login,
  forgotpassword,
  logoutUser,
} from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";
import { authmiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

router.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  register,
);

router.post("/login", login);
router.get("/forgot-password", forgotpassword);
router.post("/logout", authmiddleware, logoutUser);

export default router;
