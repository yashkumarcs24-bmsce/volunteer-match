import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import opportunityRoutes from "./routes/opportunities.js";
import applicationRoutes from "./routes/applications.js";
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();

/* Middleware */
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, "https://volunteer-match-frontend.onrender.com"]
    : ["http://localhost:5173"],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

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

/* DB Connection */
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB error:", err));
}

/* Start server */
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
