import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('bem_token'));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    if (token) {
      authApi.getMe()
        .then((res) => {
          setUser(res.user);
        })
        .catch(() => {
          localStorage.removeItem('bem_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login(email, password);
    localStorage.setItem('bem_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authApi.register(data);
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('bem_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
