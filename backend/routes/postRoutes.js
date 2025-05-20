import express from 'express';
import { upload } from "../middleware/uploadMiddleware.js";
import { createPost, getPostsByUser, getAllPosts, deletePost } from '../controller/postController.js';

const postRouter = express.Router();

postRouter.post('/', upload.single('image'), createPost);
postRouter.get('/', getAllPosts);
postRouter.get('/user/:userId', getPostsByUser);
postRouter.delete('/:id', deletePost);

export default postRouter;
