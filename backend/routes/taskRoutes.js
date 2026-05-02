const express = require("express");
const { body } = require("express-validator");
const { createTask, getProjectTasks, updateTaskStatus } = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post(
  "/project/:projectId",
  [
    body("title").notEmpty().withMessage("Task title is required"),
    body("assignedTo").notEmpty().withMessage("assignedTo is required"),
    body("dueDate").isISO8601().withMessage("Valid dueDate is required"),
    body("status").optional().isIn(["Todo", "In Progress", "Done"]).withMessage("Invalid status"),
  ],
  createTask
);
router.get("/project/:projectId", getProjectTasks);
router.patch(
  "/:taskId/status",
  [body("status").isIn(["Todo", "In Progress", "Done"]).withMessage("Invalid status")],
  updateTaskStatus
);

module.exports = router;
