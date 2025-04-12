import express from "express";
import User from "../models/User.js"

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        
        if (users.length === 0) {
          return res.status(404).json({ message: "No users found!" });
        }
    
        res.json(users);
      } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
      }
});

router.get('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err });
  }
});

router.post("/", async (req, res) => {
  const { name, username, email, password,games, achievements, highScore } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "Name, username, and email are required!" });
  }

  try {
    const newUser = new User({ name, username, email, password, games, achievements, highScore });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err });
  }
});

router.put("/:username", async (req, res) => {
  const { username } = req.params;
  const { name, email, games, achievements, highScore } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (games) user.games = games;
    if (achievements) user.achievements = achievements;
    if (typeof highScore === "number") user.highScore = highScore;

    await user.save();
    res.json({ message: "User updated successfully", updatedUser: user });

  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err });
  }
});

export default router;