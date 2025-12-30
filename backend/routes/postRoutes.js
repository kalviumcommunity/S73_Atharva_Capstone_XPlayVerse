import express from 'express';
import { upload, uploadToCloudinaryMiddleware } from "../middleware/uploadMiddleware.js";
import { createPost, getPostsByUser, getAllPosts, deletePost, toggleLikePost, addCommentToPost } from '../controller/postController.js';
import authMiddleware from "../middleware/authMiddleware.js";

const postRouter = express.Router();

postRouter.post('/', upload.single('image'), uploadToCloudinaryMiddleware, createPost);
postRouter.get('/', getAllPosts);
postRouter.get('/user/:userId', getPostsByUser);
postRouter.delete('/:id', authMiddleware, deletePost);
postRouter.post('/:postId/like', authMiddleware, toggleLikePost);
postRouter.post("/:postId/comment", authMiddleware, addCommentToPost);

export default postRouter;
