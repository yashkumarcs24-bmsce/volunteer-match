import express from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import Opportunity from "../models/Opportunity.js";

const router = express.Router();

/* ---------------- CREATE OPPORTUNITY (ORG) ---------------- */
router.post("/", auth, role("org"), async (req, res) => {
  try {
    const opportunity = new Opportunity({
      ...req.body,
      createdBy: req.user.id,
    });

    await opportunity.save();
    res.status(201).json(opportunity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- GET OPPORTUNITIES (PUBLIC) ---------------- */
router.get("/", async (req, res) => {
  try {
    const { search, category, location, skills } = req.query;
    let query = {};
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by location
    if (location) {
      query.location = location;
    }
    
    // Filter by skills
    if (skills) {
      const skillsArray = skills.split(',');
      query.skills = { $in: skillsArray };
    }
    
    const opportunities = await Opportunity.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
      
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- GET MY OPPORTUNITIES (ORG) ---------------- */
router.get("/my-opportunities", auth, role("org"), async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ createdBy: req.user.id })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
      
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- UPDATE OPPORTUNITY (ORG) ---------------- */
router.put("/:id", auth, role("org"), async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // 🔐 OWNERSHIP CHECK
    if (opportunity.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to edit this opportunity",
      });
    }

    const updated = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

/* ---------------- DELETE OPPORTUNITY (ORG) ---------------- */
router.delete("/:id", auth, role("org"), async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // 🔐 OWNERSHIP CHECK
    if (opportunity.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this opportunity",
      });
    }

    await opportunity.deleteOne();
    res.json({ message: "Opportunity deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
