import { Router } from "express";
import {
  register,
  login,
  updatepassword,
  logoutUser,
  GetCurrentUser,
  updateName,
  UpdateAvatar,
  UpdateCover
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import authmiddleware  from "../middlewares/auth.middleware.js";
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
router.post("/updatepasowrd", updatepassword);
router.post("/logout", authmiddleware, logoutUser);
router.get("/getcurrentuser",GetCurrentUser)
router.patch("/update-name", updateName);
router.patch("/update-avatar", UpdateAvatar);
router.patch("/update-cover-image", UpdateCover);

export default router;
