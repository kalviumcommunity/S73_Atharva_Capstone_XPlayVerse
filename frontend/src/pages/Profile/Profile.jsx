import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Divider,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";

import VerifiedIcon from "@mui/icons-material/Verified";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", username: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleGetVerified = () => {
    navigate("/verify");
  };

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/me`, {
          withCredentials: true,
        });

        const currentUser = res.data.user || res.data;
        if (!mounted) return;

        setUser(currentUser);

        setForm({
          name: currentUser.name || "",
          username: currentUser.username || "",
          email: currentUser.email || "",
        });

        const postsRes = await axios.get(
          `${BACKEND_URL}/api/posts/user/${currentUser._id}`,
          { withCredentials: true }
        );
        setUserPosts(postsRes.data || []);
      } catch {
        navigate("/login");
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchUser();
    return () => (mounted = false);
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${BACKEND_URL}/api/users/${user._id}`,
        form,
        { withCredentials: true }
      );
      setUser(res.data);
      setIsEditing(false);
      showToast("Profile updated successfully", "success");
    } catch {
      showToast("Failed to update profile", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/users/${user._id}`, {
        withCredentials: true,
      });
      showToast("Profile deleted successfully", "success");
      setTimeout(() => navigate("/signup"), 1200);
    } catch {
      showToast("Failed to delete profile", "error");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/posts/${postId}`, {
        withCredentials: true,
      });
      setUserPosts((prev) => prev.filter((p) => p._id !== postId));
      showToast("Post deleted", "info");
    } catch {
      showToast("Failed to delete post", "error");
    }
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 15 }}>
        <CircularProgress color="inherit" />
      </Box>
    );

  return (
    <>
      <Navbar />

      <Box sx={{ mt: "100px", px: 4 }}>
        <Card
          sx={{
            maxWidth: "520px",
            mx: "auto",
            background: "rgba(20,20,40,0.85)",
            border: "1px solid #3a3a5a",
            borderRadius: "16px",
            color: "#ffffff",
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Avatar
              src={user.profilePicture || "https://avatar.iran.liara.run/public"}
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                mb: 2,
                border: "3px solid #6c5ce7",
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
              <Typography sx={{ fontSize: "1.4rem", fontWeight: 700 }}>
                @{user.username}
              </Typography>
              {user.isVerified && (
                <Tooltip title="Verified Account">
                  <VerifiedIcon sx={{ color: "#4fc3f7" }} />
                </Tooltip>
              )}
            </Box>

            <Divider
              sx={{
                my: 3,
                height: "1px",
                border: "none",
                background:
                  "linear-gradient(to right, transparent, #6c5ce7, transparent)",
                opacity: 0.8,
              }}
            />

            {!isEditing ? (
              <>
                <Box sx={infoBox}>
                  <PersonIcon sx={{ color: "#a29bfe" }} />
                  <Typography fontWeight={600}>{user.name}</Typography>
                </Box>

                <Box sx={infoBox}>
                  <EmailIcon sx={{ color: "#a29bfe" }} />
                  <Typography>{user.email}</Typography>
                </Box>

                {!user.isVerified && (
                  <Button
                    fullWidth
                    startIcon={<VerifiedIcon />}
                    onClick={handleGetVerified}
                    sx={{
                      mt: 1,
                      mb: 2,
                      background:
                        "linear-gradient(135deg, #6c5ce7, #4a3fcf)",
                      color: "#ffffff",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #5a4fe0, #3f36c5)",
                      },
                    }}
                  >
                    Get Verified
                  </Button>
                )}

                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                  <Button
                    startIcon={<EditIcon />}
                    fullWidth
                    variant="outlined"
                    onClick={() => setIsEditing(true)}
                    sx={{ color: "#ffffff", borderColor: "#6c5ce7" }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    fullWidth
                    color="error"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  sx={inputStyle}
                />
                <TextField
                  fullWidth
                  label="Username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  sx={inputStyle}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  sx={inputStyle}
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button fullWidth variant="contained" onClick={handleUpdate}>
                    Save
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>

        <Typography
          variant="h5"
          textAlign="center"
          sx={{ mt: 6, color: "#ffffff" }}
        >
          Your Posts
        </Typography>

        {userPosts.length ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "24px",
              mt: 4,
            }}
          >
            {userPosts.map((post) => (
              <Card
                key={post._id}
                sx={{
                  background: "rgba(15,15,30,0.9)",
                  border: "1px solid #3a3a5a",
                  borderRadius: "14px",
                  color: "#ffffff",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography fontWeight={600} fontSize="0.85rem">
                      @{post.userId?.username}
                    </Typography>
                    <DeleteIcon
                      sx={{ cursor: "pointer", color: "#ff6b6b" }}
                      onClick={() => handleDeletePost(post._id)}
                    />
                  </Box>

                  <Box
                    sx={{
                      fontSize: "0.85rem",
                      lineHeight: 1.6,
                      fontFamily:
                        '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
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
                      sx={{
                        width: "100%",
                        borderRadius: "10px",
                        border: "1px solid #3a3a5a",
                        mt: 1.5,
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Typography textAlign="center" sx={{ mt: 3, color: "#cfcfff" }}>
            No posts found
          </Typography>
        )}
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

const inputStyle = {
  mb: 2,
  "& input": { color: "#ffffff" },
  "& label": { color: "#cfcfff" },
  "& fieldset": { borderColor: "#3a3a5a" },
};

const infoBox = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  background:
    "linear-gradient(135deg, rgba(108,92,231,0.15), rgba(74,63,207,0.15))",
  border: "1px solid rgba(108,92,231,0.4)",
  borderRadius: "10px",
  px: 3,
  py: 1.5,
  mb: 2,
};

export default Profile;
