import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Divider } from "@mui/material";

const features = [
  {
    title: "Community Feeds",
    description:
      "Share posts, images, and updates with the gaming community. Engage with other players and stay connected across XPlayVerse.",
    image:
      "/feeds.png",
  },
  {
    title: "SquadVerse Chat",
    description:
  "Create chat rooms for your squad, communicate in real-time, and build strategies together using Socket-powered chat, enhanced with Gemini-powered smart reply suggestions based on the latest message.",
    image:
      "/chat.png",
  },
  {
    title: "Trending Games Leaderboard",
    description:
      "Discover top trending games powered by live RAWG data with rankings, ratings, and release dates.",
    image:
      "/leaderboard.png",
  },
  {
    title: "AI Game Suggestor",
    description:
      "Get intelligent AI-powered game recommendations using natural language queries.",
    image:
      "/suggest.png",
  },
  {
    title: "Verified Profiles",
    description:
      "Stand out in the community with verified profiles that build trust and credibility.",
    image:
      "/badge.png",
  },
];

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #0f1026, #05050f)",
        color: "#ffffff",
        px: { xs: 2, md: 8 },
        pt: "90px",
      }}
    >
      <Box
        sx={{
          maxWidth: "1100px",
          mx: "auto",
          mb: 6,
          position: "relative",
        }}
      >
        <Box
          component="img"
          src="/banner.png"
          alt="Gaming Hero"
          sx={{
            width: "100%",
            height: "420px",
            objectFit: "cover",
            borderRadius: "20px",
            maskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
            opacity: 0.85,
          }}
        />
      </Box>

      <Box textAlign="center" sx={{ mb: 10, mt: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 2,
            background:
              "linear-gradient(135deg, #6c5ce7, #a29bfe)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome to XPlayVerse
        </Typography>

        <Typography
          sx={{
            maxWidth: "820px",
            mx: "auto",
            color: "#d8d8ff",
            fontSize: "1.1rem",
            mb: 4,
          }}
        >
          The ultimate gaming platform where players connect, compete,
          discover trending games, chat with squads, and rise through the ranks.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            component={Link}
            to="/login"
            sx={{
              px: 4,
              py: 1.3,
              fontWeight: 600,
              background:
                "linear-gradient(135deg, #6c5ce7, #4a3fcf)",
              color: "white",
            }}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/signup"
            variant="outlined"
            sx={{
              px: 4,
              py: 1.3,
              fontWeight: 600,
              color: "#ffffff",
              borderColor: "#6c5ce7",
            }}
          >
            Signup
          </Button>
        </Box>
      </Box>

      {features.map((feature, index) => (
        <Box key={index} sx={{ mb: 12 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: index % 2 === 0 ? "row" : "row-reverse",
              },
              alignItems: "center",
              gap: 6,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box
                component="img"
                src={feature.image}
                alt={feature.title}
                sx={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "16px",
                  border: "1px solid #3a3a5a",
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background:
                    "linear-gradient(135deg, #6c5ce7, #a29bfe)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {feature.title}
              </Typography>

              <Typography
                sx={{
                  color: "#d8d8ff",
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          </Box>

          <Divider
            sx={{
              mt: 10,
              background:
                "linear-gradient(to right, transparent, #6c5ce7, transparent)",
            }}
          />
        </Box>
      ))}

      <Box
        sx={{
          textAlign: "center",
          py: 6,
          borderTop: "1px solid #3a3a5a",
          mt: 6,
        }}
      >
        <Typography sx={{ color: "#cfcfff", mb: 1 }}>
          Developed by <strong>Atharva Dudhe</strong>
        </Typography>

        <Typography sx={{ color: "#9fa0ff", fontSize: "0.9rem" }}>
          Built with ❤️ using MERN Stack
        </Typography>

        <Typography sx={{ color: "#6f70ff", fontSize: "0.8rem", mt: 1 }}>
          © {new Date().getFullYear()} XPlayVerse. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
