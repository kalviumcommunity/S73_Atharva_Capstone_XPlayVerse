import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import { fileURLToPath } from 'url';
import path from 'path';
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./sockets/socketHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

socketHandler(io);

const PORT = process.env.PORT || 3000
const URL = process.env.URL

mongoose.connect(URL)
  .then(() => {
    console.log("Database Connected!");
    startServer();
  })
  .catch((err) => {
    console.error("Database Connection Failed:", err.message);
    process.exit(1);
  });

const startServer = () => {
  app.get('/', (req, res) => {
    res.send("<h1>Welcome to XPlayVerse!!</h1>");
  });
  
  app.use("/api/users", userRouter);
  app.use("/api/posts", postRouter);
  app.use("/api/rooms", roomRouter);

  server.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });
};