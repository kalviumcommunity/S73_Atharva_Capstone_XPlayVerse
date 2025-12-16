import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Chip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;

const Leaderboard = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-added&page_size=40`
        );
        setGames(response.data.results);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  return (
    <>
      <Navbar />

      <Box
        className="container-fluid"
        sx={{
          mt: "100px",
          px: 4,
          minHeight: "100vh",
          color: "#ffffff", 
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            mb: 5,
            fontWeight: 700,
            background:
              "linear-gradient(135deg, #ffffff, #c7c7ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Trending Games Leaderboard
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 10,
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "24px",
            }}
          >
            {games.map((game, index) => (
              <Card
                key={game.id}
                sx={{
                  height: "100%",
                  background: "rgba(15,15,30,0.9)",
                  border: "1px solid #3a3a5a",
                  borderRadius: "14px",
                  overflow: "hidden",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow:
                      "0 12px 25px rgba(108,92,231,0.35)",
                    borderColor: "#6c5ce7",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={
                    game.background_image ||
                    "https://via.placeholder.com/400x225?text=Game+Image"
                  }
                  alt={game.name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x225?text=Game+Image";
                  }}
                />

                <CardContent>
                  <Chip
                    label={`#${index + 1}`}
                    size="small"
                    sx={{
                      mb: 1,
                      background:
                        "linear-gradient(135deg, #6c5ce7, #4a3fcf)",
                      color: "#ffffff",
                      fontWeight: 600,
                    }}
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      mb: 1,
                      color: "#ffffff",
                    }}
                  >
                    {game.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <StarIcon
                      sx={{ fontSize: "1rem", color: "#fbc531" }}
                    />
                    <Typography
                      fontSize="0.9rem"
                      sx={{ color: "#ffffff" }}
                    >
                      {game.rating
                        ? game.rating.toFixed(1)
                        : "N/A"}{" "}
                      / 5
                    </Typography>
                  </Box>

                  <Typography
                    fontSize="0.8rem"
                    sx={{ color: "#cfcfff" }}
                  >
                    Released:{" "}
                    {game.released
                      ? new Date(game.released).toLocaleDateString()
                      : "Unknown"}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default Leaderboard;
