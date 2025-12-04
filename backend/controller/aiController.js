import dotenv from "dotenv";
import axios from "axios";
import fetch from "node-fetch";

dotenv.config();

const RAWG_KEY = process.env.RAWG_KEY;

async function fetchGames(query) {
  try {
    const url = `https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${query}&page_size=6`;
    const res = await axios.get(url);
    return res.data.results || [];
  } catch (err) {
    console.error("RAWG Error:", err.message);
    return [];
  }
}

export const getRecommendations = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query required" });
    }

    const games = await fetchGames(query);

    const gamesTable = games
      .map((g) => {
        const name = g.name;
        const rating = g.rating || "N/A";
        const released = g.released || "N/A";
        const genres = g.genres?.map((x) => x.name).join(", ") || "N/A";
        return `${name} | rating: ${rating} | released: ${released} | genres: ${genres}`;
      })
      .join("\n");

    const prompt = `
User query: "${query}"

RAWG game data:
${gamesTable}

Task:
1. Explain which games best match the user's request.
2. Recommend 5 games with one-line reasons for each.
`;

    const apiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY;

    const aiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await aiResponse.json();

    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Gemini Error:", data);
      return res.status(500).json({ error: "No AI response" });
    }

    const aiText = data.candidates[0].content.parts[0].text;

    return res.json({
      ok: true,
      aiText,
      rawgResults: games,
    });
  } catch (err) {
    console.error("AI Error:", err);
    res
      .status(500)
      .json({ error: "AI generation failed", details: err.message });
  }
};
