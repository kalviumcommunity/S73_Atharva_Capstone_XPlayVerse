import express from "express";
import { users } from "../data.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.json(users);
});

router.post("/", (req,res) => {
    const { name, username, email, games, achievements, highScore } = req.body;
    if (!username || !email) {
        return res.status(400).json({ message: "Username and email are required!" });
    }
    const newUser = {
        name,
        username,
        email,
        games: games || [],
        achievements: achievements || [],
        highScore: highScore || 0
    };
    users.push(newUser);
    res.status(201).json(newUser);
})

export default router;