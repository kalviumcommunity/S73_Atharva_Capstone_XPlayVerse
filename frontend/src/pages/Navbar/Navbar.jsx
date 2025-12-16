import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

const Navbar = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userId");

    setToast(true);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={3}
        sx={{
          background: "rgba(20,20,40,0.95)",
          height: "64px",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(108,92,231,0.25)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: "64px !important",
            px: 3,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            onClick={() => navigate("/feeds")}
            sx={{
              fontWeight: 800,
              letterSpacing: "1.5px",
              cursor: "pointer",
              background:
                "linear-gradient(135deg, #6c5ce7, #a29bfe)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              transition: "0.3s",
              "&:hover": {
                textShadow: "0 0 12px rgba(162,155,254,0.6)",
                transform: "scale(1.03)",
              },
            }}
          >
            XPlayVerse
          </Typography>

          <Box className="d-flex align-items-center gap-2">
            {[
              { label: "Feeds", to: "/feeds" },
              { label: "Squad", to: "/squad" },
              { label: "Leaderboard", to: "/leaderboard" },
              { label: "Suggest", to: "/suggest" },
              { label: "Profile", to: "/profile" },
            ].map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.to}
                sx={{
                  color: "#e0e0ff",
                  fontWeight: 500,
                  position: "relative",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  transition: "0.3s",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 6,
                    left: "20%",
                    width: "60%",
                    height: "2px",
                    background:
                      "linear-gradient(135deg, #6c5ce7, #a29bfe)",
                    opacity: 0,
                    transform: "scaleX(0)",
                    transition: "0.3s",
                  },
                  "&:hover": {
                    color: "#a29bfe",
                    background: "transparent",
                  },
                  "&:hover::after": {
                    opacity: 1,
                    transform: "scaleX(1)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}

            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{
                ml: 2,
                color: "#e0e0ff",
                borderColor: "#6c5ce7",
                fontWeight: 600,
                transition: "0.3s",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #6c5ce7, #4a3fcf)",
                  color: "#fff",
                  boxShadow:
                    "0 0 12px rgba(108,92,231,0.6)",
                  borderColor: "#6c5ce7",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Snackbar
        open={toast}
        autoHideDuration={3000}
        onClose={() => setToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Logged out successfully
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;
