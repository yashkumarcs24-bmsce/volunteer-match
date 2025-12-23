const Opportunity = require("../models/Opportunity");

// CREATE OPPORTUNITY (ORG)
exports.createOpportunity = async (req, res) => {
  try {
    const opportunity = new Opportunity({
      title: req.body.title,
      description: req.body.description,
      deadline: req.body.deadline,
      createdBy: req.user.id,
    });

    await opportunity.save();
    res.json(opportunity);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET OPPORTUNITIES (VOL + ORG)
exports.getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("createdBy", "name email")
      .populate("applicants.user", "name email");

    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// APPLY (VOLUNTEER)
exports.applyToOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ msg: "Opportunity not found" });
    }

    const alreadyApplied = opportunity.applicants.find(
      (a) => a.user.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({ msg: "Already applied" });
    }

    opportunity.applicants.push({ user: req.user.id });
    await opportunity.save();

    res.json({ msg: "Applied successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ACCEPT / REJECT (ORG)
exports.updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }

  const opportunity = await Opportunity.findById(req.params.id);

  if (!opportunity) {
    return res.status(404).json({ msg: "Opportunity not found" });
  }

  if (opportunity.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ msg: "Unauthorized" });
  }

  const applicant = opportunity.applicants.find(
    (a) => a.user.toString() === req.params.userId
  );

  if (!applicant) {
    return res.status(404).json({ msg: "Applicant not found" });
  }

  applicant.status = status;
  await opportunity.save();

  res.json({ msg: `Application ${status}` });
};
























