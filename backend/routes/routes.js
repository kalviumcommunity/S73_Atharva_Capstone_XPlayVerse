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

export default router;