import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";

import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

import initGooglePassport from "./config/passportGoogle.js";

import { fileURLToPath } from "url";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./sockets/socketHandler.js";

import "./cron/deleteInactiveUsers.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT || 3000;
const URL = process.env.URL;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, 
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

initGooglePassport(passport);
app.use(passport.initialize());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketHandler(io);

mongoose
  .connect(URL)
  .then(() => {
    console.log("Database Connected!");
    startServer();
  })
  .catch((err) => {
    console.error("Database Connection Failed:", err.message);
    process.exit(1);
  });

const startServer = () => {
  app.get("/", (req, res) => {
    res.send("<h1>Welcome to XPlayVerse!!</h1>");
  });

  app.use("/api", authRoutes);

  app.use("/api/users", userRouter);
  app.use("/api/posts", postRouter);
  app.use("/api/rooms", roomRouter);
  app.use("/api/ai", aiRoutes);

  server.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });
};
