import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

import GoogleIcon from "@mui/icons-material/Google";
import LoginIcon from "@mui/icons-material/Login";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const showToast = (message, severity = "error") => {
    setToast({ open: true, message, severity });
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rateLimited) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/users/login`,
        form,
        { withCredentials: true }
      );

      navigate("/feeds");
    } catch (err) {
      const status = err?.response?.status;

      if (status === 429) {
        setCooldown(300);
        showToast(
          "Too many login attempts. Please wait 5 minutes.",
          "warning"
        );
      } else {
        showToast(
          err?.response?.data?.message || "Login failed",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ minHeight: "100vh", display: "flex" }}>
        <Box
          sx={{
            width: "420px",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(15,15,30,0.95)",
            color: "#ffffff",
            px: 4,
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                background:
                  "linear-gradient(135deg, #6c5ce7, #a29bfe)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome Back
            </Typography>

            <Typography sx={{ color: "#cfcfff", mb: 4 }}>
              Login to continue to XPlayVerse
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                sx={{
                  mb: 2,
                  "& input": { color: "#ffffff" },
                  "& label": { color: "#cfcfff" },
                  "& fieldset": { borderColor: "#3a3a5a" },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                sx={{
                  mb: 3,
                  "& input": { color: "#ffffff" },
                  "& label": { color: "#cfcfff" },
                  "& fieldset": { borderColor: "#3a3a5a" },
                }}
              />

              <Button
                fullWidth
                type="submit"
                startIcon={<LoginIcon />}
                disabled={loading || rateLimited}
                sx={{
                  py: 1.2,
                  mb: 2,
                  background:
                    "linear-gradient(135deg, #6c5ce7, #4a3fcf)",
                  color: "white",
                }}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : rateLimited ? (
                  `Try again in ${cooldown}s`
                ) : (
                  "Login"
                )}
              </Button>

              <Divider sx={{ my: 2, background: "#3a3a5a" }} />

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() =>
                  (window.location.href = `${BACKEND_URL}/api/auth/google`)
                }
                sx={{
                  color: "#ffffff",
                  borderColor: "#6c5ce7",
                  py: 1.1,
                }}
              >
                Sign in with Google
              </Button>

              <Typography sx={{ mt: 3, fontSize: "0.9rem" }}>
                Don&apos;t have an account?{" "}
                <Link to="/signup" style={{ color: "#a29bfe" }}>
                  Signup
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
          }}
        >
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e"
            alt="Gaming"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          sx={{ width: "100%" }}
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
