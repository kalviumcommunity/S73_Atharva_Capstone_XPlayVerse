import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { otpStore } from "../utils/otpStore.js";
import { sendOTPEmail } from "../utils/mailer.js";

// export const SIGNUP = async (req, res) => {
//     const { name, username, email, password } = req.body;
//     const profilePicture = req.file ? req.file.filename : "";

//     if (!name || !username || !email || !password) {
//         return res.status(400).json({ message: "Name, username, email, and password are required!" });
//     }

//     try {
//         const existingUser = await User.findOne({ email });

//         if (existingUser && existingUser.provider === "google") {
//             return res.status(400).json({ message: "This email is already registered via Google. Please login using Google." });
//         }

//         if (existingUser) {
//             return res.status(400).json({ message: "Email already registered!" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new User({
//             name,
//             username,
//             email,
//             password: hashedPassword,
//             provider: "local",
//             profilePicture
//         });

//         await newUser.save();

//         return res.status(201).json({
//             message: "User registered successfully!",
//             newUser
//         });
//     } catch (err) {
//         console.log("SIGNUP ERROR:", err);
//         return res.status(500).json({ message: "Error creating user", error: err });
//     }
// };

export const LOGIN = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (user.provider === "google") {
            return res.status(400).json({ message: "This account is registered with Google. Please login using Google." });
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        user.lastLogin = new Date();
        await user.save();  

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful",
            userId: user._id
        });

    } catch (err) {
        console.log("LOGIN ERROR:", err);
        return res.status(500).json({ message: "Error Logging User", error: err });
    }
};

export const LOGOUT = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
    path: '/'
  });

  return res.json({ message: "Logged out successfully!" });
};

export const GET = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
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
        const user = await User.findById(id).select("-password");
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

        const updatedData = await User.findByIdAndUpdate(id, req.body, { new: true }).select("-password");
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

export const SEND_SIGNUP_OTP = async (req, res) => {
  const { name, username, email, password } = req.body;
  const profilePicture = req.file ? req.file.filename : "";

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.provider === "google") {
      return res.status(400).json({
        message: "This email is registered via Google. Please login using Google."
      });
    }

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(email, {
      otp,
      data: { name, username, email, password, profilePicture },
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      message: "OTP sent successfully to your email"
    });

  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res.status(500).json({ message: "Failed to send OTP", error: err });
  }
};

export const VERIFY_SIGNUP_OTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = otpStore.get(email);

    if (!record) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (record.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const { name, username, password, profilePicture } = record.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      provider: "local",
      profilePicture
    });

    await newUser.save();
    otpStore.delete(email);

    return res.status(201).json({
      message: "User registered successfully!"
    });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ message: "OTP verification failed", error: err });
  }
};
