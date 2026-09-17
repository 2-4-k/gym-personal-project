import { useEffect, useState } from "react";
import * as api from "./api";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(api.getToken()));

  useEffect(() => {
    if (!api.getToken()) return;
    api
      .getCurrentUser()
      .then(setUser)
      .catch(() => api.setToken(null))
      .finally(() => setLoading(false));
  }, []);

  async function signup(email, password, profile) {
    const data = await api.signup(email, password, profile);
    api.setToken(data.token);
    setUser(data.user);
  }

  async function login(email, password) {
    const data = await api.login(email, password);
    api.setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    api.setToken(null);
    setUser(null);
  }

  async function updateProfile(payload) {
    const updated = await api.updateProfile(payload);
    setUser(updated);
    return updated;
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
