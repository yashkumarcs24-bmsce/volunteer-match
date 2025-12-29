import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  image: {
    type: String,
    default: "",
  },
});

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    category: { type: String, default: "Community" },
    location: { type: String, default: "Remote" },
    skills: [String],
    image: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ⚠️ Legacy (not used by current app logic)
    applicants: [applicantSchema],
  },
  { timestamps: true }
);

// Search optimization indexes
opportunitySchema.index({ title: 'text', description: 'text' });
opportunitySchema.index({ category: 1 });
opportunitySchema.index({ location: 1 });
opportunitySchema.index({ skills: 1 });
opportunitySchema.index({ deadline: 1 });
opportunitySchema.index({ createdAt: -1 });

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

export default Opportunity;
