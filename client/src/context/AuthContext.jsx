import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setLoading(false);
    api.me()
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { token, user } = await api.login({ email, password });
    localStorage.setItem('token', token);
    setUser(user);
  }
  async function register(name, email, password) {
    const { token, user } = await api.register({ name, email, password });
    localStorage.setItem('token', token);
    setUser(user);
  }
  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
