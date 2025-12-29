import express from "express";
import auth from "../middleware/auth.js";
import adminOnly from "../middleware/adminOnly.js";
import Application from "../models/Application.js";

const router = express.Router();

/* ---------------- ADMIN STATS ---------------- */
router.get("/stats", auth, adminOnly, async (req, res) => {
  try {
    const total = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: "pending" });
    const approved = await Application.countDocuments({ status: "approved" });
    const rejected = await Application.countDocuments({ status: "rejected" });

    res.json({ total, pending, approved, rejected });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

/* ---------------- ADMIN NOTIFICATIONS ---------------- */
router.get("/notifications", auth, adminOnly, async (req, res) => {
  try {
    const apps = await Application.find({
      "notifications.read": false,
    }).select("notifications");

    const notifications = apps.flatMap((a) =>
      a.notifications.filter((n) => !n.read)
    );

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

/* ---------------- MARK ALL ADMIN NOTIFICATIONS READ ---------------- */
router.put("/notifications/read", auth, adminOnly, async (req, res) => {
  try {
    await Application.updateMany(
      { "notifications.read": false },
      { $set: { "notifications.$[].read": true } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark notifications" });
  }
});

/* ---------------- VOLUNTEER LEADERBOARD ---------------- */
router.get("/leaderboard", auth, adminOnly, async (req, res) => {
  const leaderboard = await Application.aggregate([
    { $match: { status: "approved" } },
    {
      $group: {
        _id: "$applicant",
        approvedCount: { $sum: 1 }
      }
    },
    { $sort: { approvedCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        approvedCount: 1,
        name: "$user.name",
        email: "$user.email",
      }
    }
  ]);

  res.json(leaderboard);
});


export default router;
