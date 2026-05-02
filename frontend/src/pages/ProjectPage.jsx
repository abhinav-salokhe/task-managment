import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TaskTable from "../components/TaskTable";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

const ProjectPage = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [memberEmail, setMemberEmail] = useState("");
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "Todo",
    dueDate: "",
  });
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/tasks/project/${projectId}`),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      if (!taskForm.assignedTo && projectRes.data.members?.[0]) {
        setTaskForm((prev) => ({ ...prev, assignedTo: projectRes.data.members[0]._id }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load project");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const addMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${projectId}/members`, { memberEmail });
      setMemberEmail("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/tasks/project/${projectId}`, taskForm);
      setTaskForm({ title: "", description: "", assignedTo: project?.members?.[0]?._id || "", status: "Todo", dueDate: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Task creation failed");
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      setTasks((prev) => prev.map((task) => (task._id === taskId ? { ...task, status } : task)));
    } catch (err) {
      setError(err.response?.data?.message || "Status update failed");
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-6xl p-4">{error || "Loading..."}</main>
      </div>
    );
  }

  const canAdminActions = user?.role === "Admin";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl p-4">
        <Link to="/dashboard" className="text-sm font-medium text-indigo-600">
          Back to Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{project.title}</h1>
        <p className="text-slate-600">{project.description || "No description provided."}</p>
        {error && <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        {canAdminActions && (
          <section className="mt-6 grid gap-4 md:grid-cols-2">
            <form onSubmit={addMember} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Add Member</h2>
              <input
                required
                type="email"
                placeholder="Member email"
                className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
              />
              <button className="mt-3 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white">Add</button>
            </form>

            <form onSubmit={createTask} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Create Task</h2>
              <div className="mt-3 space-y-2">
                <input
                  required
                  placeholder="Task title"
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
                />
                <input
                  placeholder="Description"
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))}
                />
                <select
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, assignedTo: e.target.value }))}
                >
                  {project.members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
                <input
                  required
                  type="date"
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <button className="mt-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white">Create Task</button>
            </form>
          </section>
        )}

        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Tasks</h2>
          <TaskTable tasks={tasks} canEditStatus={user?.role === "Member"} onStatusChange={updateTaskStatus} />
        </section>
      </main>
    </div>
  );
};

export default ProjectPage;
