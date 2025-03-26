import express from "express";

const router = express.Router();

const users = [
    { username: "Player1", email: "player1@example.com" },
    { username: "Player2", email: "player2@example.com" }
];

router.get('/', (req, res) => {
    res.json(users);
});


export default router;