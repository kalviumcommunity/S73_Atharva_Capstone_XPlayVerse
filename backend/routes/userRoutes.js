import express from "express";
import { upload, uploadToCloudinaryMiddleware } from "../middleware/uploadMiddleware.js";
import { GET, GETBYID, LOGIN, DELETE, UPDATE, LOGOUT, SEND_SIGNUP_OTP, VERIFY_SIGNUP_OTP } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import loginRateLimiter from "../middleware/loginRateLimiter.js";

const userRouter = express.Router();

userRouter.get('/', GET);
userRouter.get('/:id', authMiddleware, GETBYID);
userRouter.post('/signup', upload.single('profilePicture'), uploadToCloudinaryMiddleware, SEND_SIGNUP_OTP);
userRouter.post("/signup/verify-otp", VERIFY_SIGNUP_OTP);
userRouter.post('/login', loginRateLimiter, LOGIN);
userRouter.put('/:id', authMiddleware, UPDATE);
userRouter.delete('/:id', authMiddleware, DELETE);
userRouter.post('/logout', LOGOUT);

export default userRouter;