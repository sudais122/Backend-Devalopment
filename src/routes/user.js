import { Router } from "express";
import { register, login, forgotpassword } from "../controllers/user.js";
import {upload} from "../middlewares/multer.js";

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
  register
);

router.get("/login", login);
router.get("/forgot-password", forgotpassword);

export default router;