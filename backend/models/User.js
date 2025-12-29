import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["volunteer", "org", "admin"],
      default: "volunteer",
    },
    bio: String,
    skills: [String],
    experience: String,
    location: String,
    phone: String,
    avatar: String,
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
  },
  { timestamps: true }
);

// Search optimization indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ location: 1 });

export default mongoose.model("User", userSchema);
