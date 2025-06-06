import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { GET, GETBYID, LOGIN, SIGNUP, DELETE, UPDATE } from "../controller/userController.js";

const userRouter = express.Router();

userRouter.get('/', GET);
userRouter.get('/:id', GETBYID);
userRouter.post('/', upload.single('profilePicture'), SIGNUP);
userRouter.post('/login', LOGIN);
userRouter.put('/:id', UPDATE);
userRouter.delete('/:id', DELETE);

export default userRouter;