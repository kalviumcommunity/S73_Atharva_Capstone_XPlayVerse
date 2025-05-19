import express from 'express';
import { upload } from "../middleware/uploadMiddleware.js";
import { createPost, getPostsByUser, getAllPosts } from '../controller/postController.js';

const postRouter = express.Router();

postRouter.post('/', upload.single('image'), createPost);
postRouter.get('/', getAllPosts);
postRouter.get('/user/:userId', getPostsByUser);

export default postRouter;
