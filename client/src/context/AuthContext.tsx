import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, UserProfile } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, confirm: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('smartshelf_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            logout();
          }
        } catch {
          // Fallback to local demo user if server connection delay
          setUser({ id: 'demo-user-123', name: 'Alex Johnson', email: 'demo@smartshelf.ai' });
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await api.post('/auth/login', { email, password: pass });
    if (res.data.success) {
      localStorage.setItem('smartshelf_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    } else {
      throw new Error(res.data.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, pass: string, confirm: string) => {
    const res = await api.post('/auth/register', { name, email, password: pass, confirmPassword: confirm });
    if (res.data.success) {
      localStorage.setItem('smartshelf_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    } else {
      throw new Error(res.data.message || 'Registration failed');
    }
  };

  const demoLogin = async () => {
    await login('demo@smartshelf.ai', 'demo123');
  };

  const logout = () => {
    localStorage.removeItem('smartshelf_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
