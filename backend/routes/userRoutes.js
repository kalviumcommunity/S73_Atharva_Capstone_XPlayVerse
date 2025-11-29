import express from "express";
import { upload, uploadToCloudinaryMiddleware } from "../middleware/uploadMiddleware.js";
import { GET, GETBYID, LOGIN, SIGNUP, DELETE, UPDATE } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get('/', GET);
userRouter.get('/:id', authMiddleware, GETBYID);
userRouter.post('/', upload.single('profilePicture'), uploadToCloudinaryMiddleware, SIGNUP);
userRouter.post('/login', LOGIN);
userRouter.put('/:id', authMiddleware, UPDATE);
userRouter.delete('/:id', authMiddleware, DELETE);
userRouter.post('/logout', LOGOUT);

export default userRouter;