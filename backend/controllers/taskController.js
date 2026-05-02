const { validationResult } = require("express-validator");
const Project = require("../models/Project");
const Task = require("../models/Task");

const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only owner can assign tasks" });
    }

    const { title, description, assignedTo, status, dueDate } = req.body;
    if (!project.members.map((id) => id.toString()).includes(assignedTo)) {
      return res.status(400).json({ message: "Assignee must be a project member" });
    }

    const task = await Task.create({
      project: projectId,
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      status,
      dueDate,
    });

    await task.populate("assignedTo", "name email");
    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
};

const getProjectTasks = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const memberIds = project.members.map((id) => id.toString());
    const canView = memberIds.includes(req.user._id.toString()) || project.owner.toString() === req.user._id.toString();
    if (!canView) return res.status(403).json({ message: "Forbidden" });

    const query =
      req.user.role === "Admin"
        ? { project: req.params.projectId }
        : { project: req.params.projectId, assignedTo: req.user._id };

    const tasks = await Task.find(query).populate("assignedTo", "name email").sort({ dueDate: 1 });
    return res.json(tasks);
  } catch (error) {
    return next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role === "Member" && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Members can only update their own tasks" });
    }

    task.status = status;
    await task.save();
    await task.populate("assignedTo", "name email");
    return res.json(task);
  } catch (error) {
    return next(error);
  }
};

module.exports = { createTask, getProjectTasks, updateTaskStatus };
