import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="text-lg font-bold text-indigo-700">
          Team Task Manager
        </Link>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            {user?.name} ({user?.role})
          </span>
          <button
            type="button"
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
