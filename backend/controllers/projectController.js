const { validationResult } = require("express-validator");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description } = req.body;
    const project = await Project.create({
      title,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });
    return res.status(201).json(project);
  } catch (error) {
    return next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const query = req.user.role === "Admin" ? { owner: req.user._id } : { members: req.user._id };
    const projects = await Project.find(query).populate("members", "name email role").sort({ createdAt: -1 });
    return res.json(projects);
  } catch (error) {
    return next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId).populate("members", "name email role");
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember = project.members.some((m) => m._id.toString() === req.user._id.toString());
    if (!isMember && project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.json(project);
  } catch (error) {
    return next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { memberEmail } = req.body;
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only project owner can add members" });
    }

    const member = await User.findOne({ email: memberEmail });
    if (!member) return res.status(404).json({ message: "User not found" });

    if (!project.members.map((id) => id.toString()).includes(member._id.toString())) {
      project.members.push(member._id);
      await project.save();
    }

    await project.populate("members", "name email role");
    return res.json(project);
  } catch (error) {
    return next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only project owner can remove members" });
    }

    project.members = project.members.filter((id) => id.toString() !== req.params.memberId);
    await project.save();

    await Task.deleteMany({ project: project._id, assignedTo: req.params.memberId });
    await project.populate("members", "name email role");
    return res.json(project);
  } catch (error) {
    return next(error);
  }
};

module.exports = { createProject, getProjects, getProjectById, addMember, removeMember };
