import { Router } from "express";
import { register, login, forgotpassword } from "../controllers/user.js";
import { multer } from "../middlewares/multer.js";
const router = Router();

router.post(
  "/register",
  multer.fields([
    {
      name: "avatar",
      maxcount: 1,
    },
    {
      name: "cover image",
      maxcount: 1,
    },
  ]),
  register,
);
router.get("/login", login);
router.get("/forgot-password", forgotpassword);

export default router;
