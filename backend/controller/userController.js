import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const SIGNUP = async (req, res) => {
    const { name, username, email, password } = req.body;
    const profilePicture = req.file ? req.file.filename : "";

    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: "Name, username, email, and password are required!" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
            profilePicture
        });

        await newUser.save();

        console.log(newUser);
        return res.status(201).json({
            message: "User registered successfully!",
            newUser
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error creating user", error: err });
    }
};

export const LOGIN = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 10 * 60 * 1000,
        });

        console.log(user);

        return res.status(200).json({
            message: "Login successful",
            userId: user._id
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Error Logging User", error: err });
    }
};

export const LOGOUT = (req, res) => {
    res.clearCookie("token");
    return res.json({ message: "Logged out successfully!" });
};

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
};

export const GETBYID = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
};

export const UPDATE = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const updatedData = await User.findByIdAndUpdate(id, req.body, { new: true });

        return res.json(updatedData);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
};

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
};
