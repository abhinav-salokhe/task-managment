import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={submit}>
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back to your workspace.</p>
        {error && <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}
        <div className="mt-4 space-y-3">
          <input
            required
            type="email"
            placeholder="Email"
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
        <p className="mt-4 text-sm text-slate-600">
          No account?{" "}
          <Link to="/signup" className="font-medium text-indigo-600">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
