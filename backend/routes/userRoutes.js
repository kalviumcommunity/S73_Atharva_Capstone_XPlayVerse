import express from "express";
import { upload, uploadToCloudinaryMiddleware } from "../middleware/uploadMiddleware.js";
import { GET, GETBYID, LOGIN, SIGNUP, DELETE, UPDATE, LOGOUT } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import loginRateLimiter from "../middleware/loginRateLimiter.js";

const userRouter = express.Router();

userRouter.get('/', GET);
userRouter.get('/:id', authMiddleware, GETBYID);
userRouter.post('/', upload.single('profilePicture'), uploadToCloudinaryMiddleware, SIGNUP);
userRouter.post('/login', loginRateLimiter, LOGIN);
userRouter.put('/:id', authMiddleware, UPDATE);
userRouter.delete('/:id', authMiddleware, DELETE);
userRouter.post('/logout', LOGOUT);

export default userRouter;