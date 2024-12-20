import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import messageRoutes from "./routes/messageRouter.js";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const connection_string = process.env.CONNECTION_STRING;
const port = process.env.PORT || 5001;

mongoose
  .connect(connection_string)
  .then(() => console.log("MongoDB connection successful"))
  .catch((error) => console.log("MongoDB connection failed:", error));

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/channel", channelRoutes);

app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to our messaging app...");
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("joinChannel", (channelId) => {
    socket.join(channelId);
    console.log(`User ${socket.id} joined channel ${channelId}`);
  });

  socket.on("leaveChannel", (channelId) => {
    socket.leave(channelId);
    console.log(`User ${socket.id} left channel ${channelId}`);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});
// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { io };
