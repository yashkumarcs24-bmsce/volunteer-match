import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: String,
  read: { type: Boolean, default: false },
});

const historySchema = new mongoose.Schema({
  status: String,
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
});

const applicationSchema = new mongoose.Schema(
  {
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    history: [historySchema],
    notifications: [notificationSchema],
  },
  { timestamps: true }
);

// Search optimization indexes
applicationSchema.index({ applicant: 1, status: 1 });
applicationSchema.index({ opportunity: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
