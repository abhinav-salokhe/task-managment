import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { AuthContext } from "./authContextInstance";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const signup = async (payload) => {
    console.log(payload);
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setLoading(false);
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const value = useMemo(() => ({ user, loading, login, signup, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
