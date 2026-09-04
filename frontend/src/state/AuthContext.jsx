import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const login = async (identifier, password) => {
    const res = await api.post("/auth/login", { identifier, password });
    const { token: newToken, user: userData } = res.data;

    setToken(newToken);
    localStorage.setItem("token", newToken);
    setUser(userData);

    return userData;
  };

  const register = async ({ name, email, username, password, contactNumber }) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      username,
      password,
      contactNumber
    });
    const { token: newToken, user: userData } = res.data;

    setToken(newToken);
    localStorage.setItem("token", newToken);
    setUser(userData);

    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,              // ✅ REQUIRED for ProfileSetup
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
