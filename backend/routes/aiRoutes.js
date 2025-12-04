import express from "express";
import fetch from "node-fetch"; 
import { getRecommendations } from "../controller/aiController.js";

const router = express.Router();

router.post("/smart-reply", async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
      Generate 3 short, friendly reply suggestions for:
      "${message}"
      Return ONLY a JSON array of strings.
    `;

    const apiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!data.candidates) {
      console.error("Gemini API Error:", data);
      return res.status(500).json({ error: "Gemini returned no candidates" });
    }

    let output = data.candidates[0].content.parts[0].text
      .replace(/```json|```/g, "")
      .trim();

    return res.json(JSON.parse(output));

  } catch (err) {
    console.error("Gemini AI Error:", err);
    return res.status(500).json({ error: "AI generation failed" });
  }
});

router.post("/recommend", getRecommendations);

export default router;
