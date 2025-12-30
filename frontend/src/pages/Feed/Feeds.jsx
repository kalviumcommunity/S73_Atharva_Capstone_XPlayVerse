import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Box,
  Button,
  TextField,
  Avatar,
  Typography,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VerifiedIcon from "@mui/icons-material/Verified";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Feeds = () => {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [openComments, setOpenComments] = useState({});

  const [user, setUser] = useState(null);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };
    fetchCurrentUser();
  }, []);

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get(`${BACKEND_URL}/api/posts`, {
      withCredentials: true,
    });

    setPosts(
      res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  };

  const handleLikeToggle = async (postId) => {
    if (!user) {
      showToast("Please login to like posts", "error");
      return;
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? res.data : post))
      );
    } catch {
      showToast("Failed to update like", "error");
    }
  };

  const handleAddComment = async (postId) => {
    if (!user) {
      showToast("Please login to comment", "error");
      return;
    }

    const text = commentInputs[postId];
    if (!text?.trim()) return;

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/posts/${postId}/comment`,
        { text },
        { withCredentials: true }
      );

      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? res.data : post))
      );

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch {
      showToast("Failed to add comment", "error");
    }
  };

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!caption && !image) {
      showToast("Please add text or image", "error");
      return;
    }

    setLoading(true);

    if (!user) {
      showToast("Please login to post", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("caption", caption);
    if (image) formData.append("image", image);

    try {
      await axios.post(`${BACKEND_URL}/api/posts`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setCaption("");
      setImage(null);
      setImageUploaded(false);
      fetchPosts();
      showToast("Post created successfully", "success");
    } catch {
      showToast("Failed to create post", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{
          display: "flex",
          gap: "30px",
          maxWidth: "1200px",
          padding: "20px",
          marginLeft: "200px",
          marginTop: "100px",
          minHeight: "100vh",
          color: "#e0e0ff",
        }}
      >
        <Box sx={{ flex: 1, marginRight: "420px" }}>
          <Typography variant="h5" textAlign="center" sx={{ mb: 3 }}>
            All Posts
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {posts.map((post) => {
              const isLiked = post.likes?.includes(user?._id);

              return (
                <Box
                  key={post._id}
                  sx={{
                    border: "1px solid #3a3a5a",
                    borderRadius: "12px",
                    background: "rgba(20,20,40,0.6)",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 20px rgba(108,92,231,0.3)",
                      borderColor: "#6c5ce7",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      padding: "25px",
                    }}
                  >
                    <Avatar
                      src={
                        post.userId?.profilePicture ||
                        "https://avatar.iran.liara.run/public"
                      }
                      sx={{
                        width: 55,
                        height: 55,
                        border: "2px solid #6c5ce7",
                      }}
                    />

                    <Box>
                      {post.userId?.isVerified && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <VerifiedIcon
                            sx={{
                              fontSize: "16px",
                              color: "#1DA1F2",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.75rem",
                              color: "#1DA1F2",
                              fontWeight: 500,
                            }}
                          >
                            Verified
                          </Typography>
                        </Box>
                      )}

                      <Typography
                        sx={{
                          fontSize: "1.25rem",
                          fontWeight: 600,
                        }}
                      >
                        @{post.userId?.username || "Anonymous"}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider
                    sx={{
                      mx: "25px",
                      height: "1.5px",
                      background:
                        "linear-gradient(to right, transparent, #6c5ce7, transparent)",
                    }}
                  />

                  <Box sx={{ padding: "25px" }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {post.caption}
                    </ReactMarkdown>

                    {post.image && (
                      <Box
                        component="img"
                        src={post.image}
                        alt="post"
                        sx={{
                          width: "100%",
                          maxHeight: "500px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          border: "1px solid #3a3a5a",
                          mt: 2,
                        }}
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      px: "25px",
                      pb: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Button
                      onClick={() => handleLikeToggle(post._id)}
                      startIcon={
                        isLiked ? (
                          <FavoriteIcon sx={{ color: "#e84393" }} />
                        ) : (
                          <FavoriteBorderIcon sx={{ color: "#e84393" }} />
                        )
                      }
                      sx={{
                        color: "#e84393",
                        textTransform: "none",
                        minWidth: "unset",
                      }}
                    >
                      {post.likes?.length || 0}
                    </Button>

                    <Typography sx={{ fontSize: "0.9rem" }}>
                      {post.likes?.length === 1 ? "Like" : "Likes"}
                    </Typography>
                  </Box>
                  <Box sx={{ px: "25px", pb: "20px" }}>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        mb: 1,
                        cursor: "pointer",
                        color: "#a29bfe",
                      }}
                      onClick={() => toggleComments(post._id)}
                    >
                      💬 {post.comments?.length || 0} Comments
                    </Typography>

                    {openComments[post._id] && (
                      <>
                        {post.comments?.map((comment, idx) => (
                          <Box
                            key={idx}
                            sx={{ display: "flex", gap: 1, mb: 1 }}
                          >
                            <Avatar
                              src={
                                comment.userId?.profilePicture ||
                                "https://avatar.iran.liara.run/public"
                              }
                              sx={{ width: 28, height: 28 }}
                            />

                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                <Typography
                                  fontSize="0.85rem"
                                  fontWeight={600}
                                  color="white"
                                >
                                  @{comment.userId?.username || "Unknown"}
                                </Typography>

                                {comment.userId?.isVerified && (
                                  <VerifiedIcon
                                    sx={{ fontSize: 14, color: "#1DA1F2" }}
                                  />
                                )}
                              </Box>

                              <Typography fontSize="0.9rem" color="white">
                                {comment.text}
                              </Typography>
                            </Box>
                          </Box>
                        ))}

                        {/* ADD COMMENT */}
                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder="Add a comment..."
                            value={commentInputs[post._id] || ""}
                            onChange={(e) =>
                              setCommentInputs({
                                ...commentInputs,
                                [post._id]: e.target.value,
                              })
                            }
                            InputProps={{
                              sx: {
                                color: "white",
                              },
                            }}
                            sx={{
                              "& fieldset": {
                                borderColor: "#3a3a5a",
                              },
                              "& input::placeholder": {
                                color: "rgba(255,255,255,0.6)",
                              },
                            }}
                          />

                          <Button
                            onClick={() => handleAddComment(post._id)}
                            sx={{
                              background:
                                "linear-gradient(135deg,#6c5ce7,#4a3fcf)",
                              color: "white",
                            }}
                          >
                            Post
                          </Button>
                        </Box>
                      </>
                    )}

                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box
          sx={{
            position: "fixed",
            top: "100px",
            right: "25px",
            width: "350px",
            background: "rgba(20,20,40,0.6)",
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #3a3a5a",
          }}
        >
          <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
            Create a Post
          </Typography>

          <form onSubmit={handlePostSubmit}>
            <TextField
              fullWidth
              multiline
              minRows={6}
              placeholder="Write in Markdown Format..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              sx={{
                mb: 2,
                "& textarea": { color: "#e0e0ff" },
                "& fieldset": { borderColor: "#3a3a5a" },
              }}
            />

            <Box sx={{ display: "flex", gap: "12px" }}>
              <Button
                component="label"
                startIcon={<AddPhotoAlternateIcon />}
                variant="outlined"
                sx={{
                  color: "#e0e0ff",
                  borderColor: "#6c5ce7",
                  flex: 1,
                }}
              >
                Upload Image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    setImageUploaded(true);
                    showToast("Image uploaded", "info");
                  }}
                />
              </Button>

              <Button
                type="submit"
                disabled={loading}
                sx={{
                  flex: 1,
                  background: "linear-gradient(135deg, #6c5ce7, #4a3fcf)",
                  color: "white",
                }}
              >
                {loading ? <CircularProgress size={20} /> : "Post"}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Feeds;
