import express from "express";
import { users } from "../data.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.json(users);
});

router.post("/", (req,res) => {
    const { name, username, email, games, achievements, highScore } = req.body;
    if (!name || !username || !email) {
        return res.status(400).json({ message: "Name, username and email are required!" });
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

router.put("/:username", (req, res) => {
    const { username } = req.params;
    const { name, email, games, achievements, highScore } = req.body;
    const userIndex = users.findIndex(user => user.username == username);
    if(userIndex == -1){
        return res.status(400).json({ "message" : "User not found!" })
    }
    const updateUser = {
        ...users[userIndex],
        name: name || users[userIndex].name,
        email: email || users[userIndex].email,
        games: games || users[userIndex].games,
        achievements: achievements || users[userIndex].achievements,
        highScore: (highScore !== undefined && highScore !== null) ? highScore : users[userIndex].highScore

    };
    users[userIndex] = updateUser;
    res.json(updateUser)
})

export default router;