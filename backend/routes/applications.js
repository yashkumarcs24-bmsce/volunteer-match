import express from "express";
import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/* ---------------- APPLY (Volunteer) ---------------- */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { opportunityId } = req.body;

    // ❌ Block active applications
    const existing = await Application.findOne({
      opportunity: opportunityId,
      applicant: req.user.id,
      status: { $in: ["pending", "approved"] },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Application already active" });
    }

    const opportunity = await Opportunity.findById(opportunityId).populate("createdBy", "name email");
    const volunteer = await User.findById(req.user.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const application = new Application({
      opportunity: opportunityId,
      applicant: req.user.id,
      status: "pending",
      history: [
        {
          status: "pending",
          changedBy: req.user.id,
        },
      ],
      notifications: [
        {
          message: `${volunteer.name} applied for ${opportunity.title}`,
          read: false,
        },
      ],
    });

    await application.save();

    // 💬 Auto-create initial message from volunteer to organization
    const Message = (await import("../models/Message.js")).default;
    const initialMessage = new Message({
      senderId: req.user.id,
      receiverId: opportunity.createdBy._id,
      content: `Hi! I just applied for "${opportunity.title}". I'm excited about this opportunity and would love to discuss how I can contribute. Looking forward to hearing from you!`,
      eventContext: {
        opportunityId: opportunity._id,
        opportunityTitle: opportunity.title
      }
    });

    await initialMessage.save();

    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Apply failed" });
  }
});

/* -------- GET applications of logged-in volunteer -------- */
router.get("/volunteer/:id", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.params.id,
    })
      .populate("opportunity")
      .populate("history.changedBy", "name");

    // 🛠 Auto-fix missing history
    const fixed = applications.map((app) => {
      if (!Array.isArray(app.history) || app.history.length === 0) {
        app.history = [
          {
            status: app.status,
            changedAt: app.createdAt,
          },
        ];
      }
      return app;
    });

    res.json(fixed);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* ---------------- CANCEL (Volunteer) ---------------- */
router.put("/cancel/:id", authMiddleware, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (app.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending applications can be cancelled" });
    }

    app.status = "cancelled";
    app.history.push({
      status: "cancelled",
      changedBy: req.user.id,
    });

    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: "Cancel failed" });
  }
});

/* ---------------- APPROVE / REJECT (ORG) ---------------- */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "org") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id)
      .populate("applicant", "email name")
      .populate("opportunity");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 🔐 Ownership check
    if (
      application.opportunity.createdBy.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({ message: "Not your opportunity" });
    }

    application.status = status;
    application.history.push({
      status,
      changedBy: req.user.id,
    });

    // 🔔 Notify volunteer
    application.notifications.push({
      message: `Your application for ${application.opportunity.title} was ${status}`,
      read: false,
    });

    await application.save();

    // 📧 Email simulation
    console.log(
      `📧 Email sent to ${application.applicant.email}: Application ${status.toUpperCase()}`
    );

    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- ORG VIEW APPLICATIONS FOR THEIR OPPORTUNITIES ---------------- */
router.get("/", authMiddleware, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === "org") {
      // Organizations only see applications for their opportunities
      const userOpportunities = await Opportunity.find({ createdBy: req.user.id }).select('_id');
      const opportunityIds = userOpportunities.map(op => op._id);
      query.opportunity = { $in: opportunityIds };
    }
    // Admins see all applications (no filter)
    
    const applications = await Application.find(query)
      .populate("applicant", "name email")
      .populate("opportunity", "title")
      .populate("history.changedBy", "name");

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------- MARK APPLICATION NOTIFICATIONS AS READ -------- */
router.put("/notifications/read/:id", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.notifications.forEach((n) => (n.read = true));
    await application.save();

    res.json({ message: "Notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark notifications" });
  }
});

export default router;
