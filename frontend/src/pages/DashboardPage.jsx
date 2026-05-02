import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ProjectCard from "../components/ProjectCard";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

const DashboardPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [dashboard, setDashboard] = useState({ total: 0, overdue: 0, byStatus: { Todo: 0, "In Progress": 0, Done: 0 } });
  const [projectFilter, setProjectFilter] = useState("");
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projectsRes, dashboardRes] = await Promise.all([
        api.get("/projects"),
        api.get("/dashboard", { params: projectFilter ? { projectId: projectFilter } : {} }),
      ]);
      setProjects(projectsRes.data);
      setDashboard(dashboardRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectFilter]);

  const createProject = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/projects", newProject);
      setNewProject({ title: "", description: "" });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Project creation failed");
    }
  };

  const projectOptions = useMemo(() => [{ _id: "", title: "All Projects" }, ...projects], [projects]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <select
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            {projectOptions.map((project) => (
              <option key={project._id || "all"} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Tasks" value={dashboard.total} />
          <StatCard title="Todo" value={dashboard.byStatus.Todo} />
          <StatCard title="In Progress" value={dashboard.byStatus["In Progress"]} />
          <StatCard title="Overdue" value={dashboard.overdue} />
        </section>

        {user?.role === "Admin" && (
          <form onSubmit={createProject} className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Create Project</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input
                required
                placeholder="Project title"
                className="rounded-md border border-slate-300 px-3 py-2"
                value={newProject.title}
                onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
              />
              <input
                placeholder="Project description"
                className="rounded-md border border-slate-300 px-3 py-2"
                value={newProject.description}
                onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <button className="mt-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500">
              Create
            </button>
          </form>
        )}

        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">{loading ? "Loading projects..." : "Projects"}</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
