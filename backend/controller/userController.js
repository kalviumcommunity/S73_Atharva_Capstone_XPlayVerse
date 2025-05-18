import User from "../models/User.js";

export const SIGNUP = async (req, res) => {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: "Name, username, and email are required!" });
    }
    try {
        const newUser = new User({ name, username, email, password});
        await newUser.save();
        return res.status(201).json(newUser);
    } catch (err) {
        return res.status(500).json({ message: "Error creating user", error: err });
    }
}

export const LOGIN = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
        }
        res.status(200).json({ message: "Login successful", user });
    } catch (err) {
        return res.status(500).json({ message: "Error Logging User", error: err });
    }
}

export const GET = async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
          return res.status(404).json({ message: "No users found!" });
        }
        return res.json(users);
      } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
      }
}

export const GETBYID = async (req, res) => {
    const id  = req.params.id;
    try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    return res.json(user);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
}

export const UPDATE = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        const updatedData = await User.findByIdAndUpdate(id, req.body, {new:true});
        return res.json(updatedData);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
}

export const DELETE = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        await User.findByIdAndDelete(id);
        return res.status(200).json({ message: "User deleted successfully!" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
}