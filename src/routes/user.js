import { Router } from "express";
import {register,login,forgotpassword} from "../controllers/user.js";
const router = Router();

router.post('/register',register);
router.get('/login',login);
router.get('/forgot-password', forgotpassword);

export default router;