import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { userId, caption } = req.body;
    const image = req.file ? req.file.secure_url : null;

    const post = new Post({ userId, caption, image, likes: [], });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post', details: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username profilePicture isVerified')
      .populate("comments.userId", "username profilePicture isVerified")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post', details: err.message });
  }
}

export const toggleLikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const post = await Post.findById(postId).populate(
      "userId",
      "username profilePicture isVerified"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update like",
      details: err.message,
    });
  }
};

export const addCommentToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text.trim()) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    const post = await Post.findById(postId)
      .populate("userId", "username profilePicture isVerified")
      .populate("comments.userId", "username profilePicture isVerified");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push({
      userId,
      text,
    });

    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("userId", "username profilePicture isVerified")
      .populate("comments.userId", "username profilePicture isVerified");

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({
      error: "Failed to add comment",
      details: err.message,
    });
  }
};
