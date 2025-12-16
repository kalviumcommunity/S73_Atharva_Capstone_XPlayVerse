import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

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

  const [user, setUser] = useState(null);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/me`, { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
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

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!caption && !image) {
      showToast("Please add text or image", "error");
      return;
    }

    setLoading(true);

    if (!user) {
      showToast('Please login to post', 'error');
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("userId", user?._id);
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
            {posts.map((post) => (
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
                          sx={{ fontSize: "16px", color: "#1DA1F2" }}
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
                        letterSpacing: "0.2px",
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
                    border: "none",
                    background:
                      "linear-gradient(to right, transparent, #6c5ce7, transparent)",
                    opacity: 0.8,
                  }}
                />

                <Box sx={{ padding: "25px" }}>
                  <Box
                    sx={{
                      fontSize: "1.05rem",
                      lineHeight: 1.8,
                      fontWeight: 400,
                      fontFamily:
                        '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',

                      "& h1, & h2, & h3": {
                        marginTop: "20px",
                        marginBottom: "10px",
                        fontWeight: 600,
                        color: "#c7c3ff",
                      },
                      "& p": {
                        marginBottom: "12px",
                      },
                      "& li": {
                        marginLeft: "22px",
                        marginBottom: "6px",
                      },
                      "& code": {
                        background: "rgba(0,0,0,0.45)",
                        padding: "4px 6px",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                      },
                      "& pre": {
                        background: "rgba(0,0,0,0.6)",
                        padding: "14px",
                        borderRadius: "10px",
                        overflowX: "auto",
                        fontSize: "0.95rem",
                      },
                      "& a": {
                        color: "#8c7bff",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {post.caption}
                    </ReactMarkdown>
                  </Box>

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
              </Box>
            ))}
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
              multiline
              minRows={6}
              placeholder="Write in Markdown Fromat..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              sx={{
                mb: 2,
                "& textarea": {
                  color: "#e0e0ff",
                  fontSize: "0.95rem",
                },
                "& fieldset": { borderColor: "#3a3a5a" },
                background: "rgba(30,30,50,0.8)",
                borderRadius: "8px",
                width: "100%",
              }}
            />

            <Box sx={{ display: "flex", gap: "12px" }}>
              <Button
                component="label"
                startIcon={<AddPhotoAlternateIcon />}
                variant="outlined"
                sx={{ color: "#e0e0ff", borderColor: "#6c5ce7", flex: 1 }}
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
