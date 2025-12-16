import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("FORM");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "confirmPassword") {
        formData.append(key, value);
      }
    });
    if (profilePicture) formData.append("profilePicture", profilePicture);

    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/api/users/signup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("OTP sent to your email", "success");
      setStep("OTP");
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Signup failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      showToast("Please enter OTP", "warning");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/api/users/signup/verify-otp`, {
        email: form.email,
        otp,
      });

      showToast("Signup successful! Please login", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      showToast(
        err?.response?.data?.message || "OTP verification failed",
        "error"
      );
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
              Create Account
            </Typography>

            <Typography sx={{ color: "#cfcfff", mb: 4 }}>
              Join XPlayVerse and start your journey
            </Typography>

            {step === "FORM" ? (
              <Box component="form" onSubmit={handleSubmit}>
                <TextField fullWidth label="Full Name" name="name" value={form.name} onChange={handleChange} required sx={inputStyle} />
                <TextField fullWidth label="Username" name="username" value={form.username} onChange={handleChange} required sx={inputStyle} />
                <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} required sx={inputStyle} />
                <TextField fullWidth label="Password" type="password" name="password" value={form.password} onChange={handleChange} required sx={inputStyle} />
                <TextField fullWidth label="Confirm Password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required sx={{ ...inputStyle, mb: 2 }} />

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={profilePicture ? <CheckCircleIcon /> : <PhotoCameraIcon />}
                  disabled={Boolean(profilePicture)}
                  sx={{
                    mb: 2,
                    color: profilePicture ? "#2ecc71" : "#ffffff",
                    borderColor: profilePicture ? "#2ecc71" : "#6c5ce7",
                    "&.Mui-disabled": {
                      color: "#2ecc71",
                      borderColor: "#2ecc71",
                    },
                  }}
                >
                  {profilePicture ? "Image Uploaded Successfully" : "Upload Profile Picture"}
                  {!profilePicture && (
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setProfilePicture(e.target.files[0]);
                        showToast("Profile image uploaded successfully", "info");
                      }}
                    />
                  )}
                </Button>

                <Button fullWidth type="submit" startIcon={<PersonAddIcon />} disabled={loading} sx={primaryButton}>
                  {loading ? <CircularProgress size={22} color="inherit" /> : "Begin Journey"}
                </Button>

                <Typography sx={{ mt: 3, fontSize: "0.9rem" }}>
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: "#a29bfe" }}>
                    Login
                  </Link>
                </Typography>
              </Box>
            ) : (
              <Box>
                <TextField fullWidth label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} sx={inputStyle} />
                <Button fullWidth sx={primaryButton} onClick={verifyOtp} disabled={loading}>
                  {loading ? <CircularProgress size={22} color="inherit" /> : "Verify OTP"}
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ flex: 1, display: { xs: "none", md: "flex" } }}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e"
            alt="Gaming"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
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

const primaryButton = {
  py: 1.2,
  mb: 2,
  background: "linear-gradient(135deg, #6c5ce7, #4a3fcf)",
  color: "white",
};

export default Signup;
