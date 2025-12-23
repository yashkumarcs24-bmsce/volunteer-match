const express = require("express");
const router = express.Router();

const Application = require("../models/Application");
const authMiddleware = require("../middleware/auth");

// Volunteer applies
router.post("/:opportunityId", authMiddleware, async (req, res) => {
  try {
    const application = new Application({
      opportunity: req.params.opportunityId,
      applicant: req.user.id,
    });

    await application.save();
    res.json({ message: "Applied successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Org views applicants
router.get("/", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("applicant", "name email")
      .populate("opportunity", "title");

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Accept / Reject
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

