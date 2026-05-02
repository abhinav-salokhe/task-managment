import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
    <p className="mt-1 text-sm text-slate-600">{project.description || "No description"}</p>
    <p className="mt-2 text-xs text-slate-500">Members: {project.members?.length || 0}</p>
    <Link
      to={`/projects/${project._id}`}
      className="mt-4 inline-block rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
    >
      Open Project
    </Link>
  </div>
);

export default ProjectCard;
