import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import StarIcon from "@mui/icons-material/Star";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function GameSuggestor() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiText, setAiText] = useState(null);
  const [games, setGames] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAiText(null);
    setGames([]);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/ai/recommend`, {
        query,
      });
      if (res.data.ok) {
        setAiText(res.data.aiText);
        setGames(res.data.rawgResults || []);
      } else {
        setAiText("No recommendations returned.");
      }
    } catch (err) {
      console.error(err);
      setAiText("Server error. Check console.");
    } finally {
      setLoading(false);
    }
  };

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
            fontWeight: 700,
            mb: 1,
            background: "linear-gradient(135deg, #6c5ce7, #a29bfe)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AI Game Suggestor
        </Typography>

        <Typography textAlign="center" sx={{ color: "#cfcfff", mb: 4 }}>
          Ask for personalized game recommendations using natural language
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: "700px",
            mx: "auto",
            display: "flex",
            gap: 2,
            mb: 5,
          }}
        >
          <TextField
            fullWidth
            placeholder='e.g., "FPS games like Valorant"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{
              "& input": { color: "#ffffff" },
              "& fieldset": { borderColor: "#3a3a5a" },
              background: "rgba(20,20,40,0.8)",
              borderRadius: "8px",
            }}
          />

          <Button
            type="submit"
            disabled={loading}
            startIcon={<AutoAwesomeIcon />}
            sx={{
              px: 3,
              background: "linear-gradient(135deg, #6c5ce7, #4a3fcf)",
              color: "white",
            }}
          >
            {loading ? "Thinking..." : "Suggest"}
          </Button>
        </Box>

        {loading && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <CircularProgress color="inherit" />
          </Box>
        )}

        {aiText && (
          <Box
            sx={{
              maxWidth: "900px",
              mx: "auto",
              mb: 6,
              background: "rgba(20,20,40,0.7)",
              border: "1px solid #3a3a5a",
              borderRadius: "12px",
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: "#a29bfe" }}>
              AI Explanation
            </Typography>

            <Divider
              sx={{
                mb: 2,
                background:
                  "linear-gradient(to right, transparent, #6c5ce7, transparent)",
              }}
            />

            <Box
              sx={{
                "& p": { color: "#e0e0ff", lineHeight: 1.7 },
                "& li": { color: "#e0e0ff" },
                "& strong": { color: "#ffffff" },
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {aiText}
              </ReactMarkdown>
            </Box>
          </Box>
        )}

        {games.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "24px",
            }}
          >
            {games.map((g) => (
              <Card
                key={g.id}
                sx={{
                  background: "rgba(15,15,30,0.9)",
                  border: "1px solid #3a3a5a",
                  borderRadius: "14px",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 25px rgba(108,92,231,0.35)",
                    borderColor: "#6c5ce7",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={
                    g.background_image ||
                    "https://via.placeholder.com/400x225?text=Game+Image"
                  }
                  alt={g.name}
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/400x225?text=Game+Image")
                  }
                />

                <CardContent sx={{ color: "#ffffff" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      mb: 1,
                      color: "#ffffff",
                    }}
                  >
                    {g.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    <StarIcon sx={{ fontSize: "1rem", color: "#fbc531" }} />
                    <Typography fontSize="0.9rem" sx={{ color: "#ffffff" }}>
                      {g.rating || "N/A"}
                    </Typography>
                  </Box>

                  <Typography
                    fontSize="0.8rem"
                    sx={{ color: "#cfcfff", mb: 1 }}
                  >
                    Released: {g.released || "N/A"}
                  </Typography>

                  {g.genres && (
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {g.genres.map((x) => (
                        <Chip
                          key={x.id}
                          label={x.name}
                          size="small"
                          sx={{
                            background:
                              "linear-gradient(135deg, rgba(108,92,231,0.25), rgba(74,63,207,0.25))",
                            color: "#ffffff",
                            border: "1px solid rgba(108,92,231,0.6)",
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
