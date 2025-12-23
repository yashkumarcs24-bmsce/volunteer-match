const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");

const {
  createOpportunity,
  getOpportunities,
  applyToOpportunity,
  updateApplicationStatus,
} = require("../controllers/opportunityController");

router.post("/", auth, role("org"), createOpportunity);
router.get("/", auth, getOpportunities);
router.post("/:id/apply", auth, role("volunteer"), applyToOpportunity);
router.put(
  "/:id/applicants/:userId",
  auth,
  role("org"),
  updateApplicationStatus
);

module.exports = router;























