import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./GameSuggestor.css";

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
      const res = await axios.post(`${BACKEND_URL}/api/ai/recommend`, { query });
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

      <div className="suggestor-container">
        <div className="suggestor-content">
          <h1 className="suggestor-title">🤖 AI Game Suggestor</h1>
          <p className="suggestor-subtitle">
            Ask for personalized game recommendations using natural language.
          </p>

          <form onSubmit={handleSubmit} className="suggestor-form">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='e.g., "FPS games like Valorant"'
            />
            <button type="submit" disabled={loading}>
              {loading ? "Thinking..." : "Suggest"}
            </button>
          </form>

          {aiText && (
            <div className="ai-box">
              <h2>AI Explanation</h2>

              <div className="markdown-output">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {aiText}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {games.length > 0 && (
            <div className="games-grid-suggestor">
              {games.map((g) => (
                <div key={g.id} className="suggestor-card">
                  <div className="game-image-container">
                    <img
                      src={g.background_image || ""}
                      alt={g.name}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/400x225?text=Game+Image")
                      }
                    />
                  </div>
                  <div className="suggestor-info">
                    <h2>{g.name}</h2>
                    <p>⭐ {g.rating || "N/A"}</p>
                    <p>Released: {g.released || "N/A"}</p>
                    <p className="genres">
                      {(g.genres || []).map((x) => x.name).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
