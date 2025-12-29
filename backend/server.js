import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import opportunityRoutes from "./routes/opportunities.js";
import applicationRoutes from "./routes/applications.js";
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://volunteer-match-c6yg.vercel.app", "https://volunteer-match-c6yg-cwnsd7axj-yashs-projects-cae7ec31.vercel.app", "https://volunteer-match-c6yg-git-main-yashs-projects-cae7ec31.vercel.app"]
      : ["http://localhost:5173"],
    methods: ["GET", "POST"]
  }
});

/* Middleware */
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ["https://volunteer-match-c6yg.vercel.app", "https://volunteer-match-c6yg-cwnsd7axj-yashs-projects-cae7ec31.vercel.app", "https://volunteer-match-c6yg-git-main-yashs-projects-cae7ec31.vercel.app"]
    : ["http://localhost:5173"],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

/* Socket.IO */
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(userId);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

/* Make io available to routes */
app.set('io', io);

/* Routes */
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);

/* Test route */
app.get("/", (req, res) => {
  res.send("Volunteer Match API is running 🚀");
});

/* DB + Server */
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
