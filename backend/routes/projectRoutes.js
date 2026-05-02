const express = require("express");
const { body } = require("express-validator");
const {
  addMember,
  createProject,
  getProjectById,
  getProjects,
  removeMember,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  allowRoles("Admin"),
  [body("title").notEmpty().withMessage("Project title is required")],
  createProject
);
router.get("/", getProjects);
router.get("/:projectId", getProjectById);
router.post("/:projectId/members", allowRoles("Admin"), addMember);
router.delete("/:projectId/members/:memberId", allowRoles("Admin"), removeMember);

module.exports = router;
