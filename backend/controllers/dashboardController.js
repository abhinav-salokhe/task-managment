const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboard = async (req, res, next) => {
  try {
    const projectFilter = req.query.projectId ? { project: req.query.projectId } : {};
    let taskFilter = { ...projectFilter };

    if (req.user.role === "Member") {
      taskFilter.assignedTo = req.user._id;
    } else {
      const ownedProjects = await Project.find({ owner: req.user._id }).select("_id");
      taskFilter.project = req.query.projectId ? req.query.projectId : { $in: ownedProjects.map((p) => p._id) };
    }

    const tasks = await Task.find(taskFilter);
    const now = new Date();

    const counts = tasks.reduce(
      (acc, task) => {
        acc.total += 1;
        acc.byStatus[task.status] += 1;
        if (task.status !== "Done" && new Date(task.dueDate) < now) acc.overdue += 1;
        return acc;
      },
      {
        total: 0,
        overdue: 0,
        byStatus: { Todo: 0, "In Progress": 0, Done: 0 },
      }
    );

    return res.json(counts);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getDashboard };
