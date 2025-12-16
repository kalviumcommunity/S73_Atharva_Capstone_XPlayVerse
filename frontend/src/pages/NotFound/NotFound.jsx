import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #0f1026, #05050f)",
        color: "#ffffff",
        textAlign: "center",
        px: 3,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: "#6c5ce7", mb: 2 }} />

      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          background:
            "linear-gradient(135deg, #6c5ce7, #a29bfe)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 1,
        }}
      >
        404
      </Typography>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Page Not Found
      </Typography>

      <Typography sx={{ color: "#cfcfff", mb: 4, maxWidth: 420 }}>
        The page you are looking for doesn’t exist or has been moved.
      </Typography>

      <Button
        component={Link}
        to="/"
        sx={{
          px: 4,
          py: 1.2,
          fontWeight: 600,
          background:
            "linear-gradient(135deg, #6c5ce7, #4a3fcf)",
          color: "white",
        }}
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFound;
