import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { api } from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginAsGuest: (name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const setSession = (
  setUser: (user: User | null) => void,
  token: string,
  userData: { id: string; name: string; email?: string; isGuest: boolean }
) => {
  localStorage.setItem('taskflow_token', token);
  setUser({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    isGuest: userData.isGuest,
  });
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('taskflow_token');
    setUser(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.login(email, password);
    setSession(setUser, response.data.token, response.data.user);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const response = await api.register(name, email, password);
      setSession(setUser, response.data.token, response.data.user);
    },
    []
  );

  const loginAsGuest = useCallback(async (name?: string) => {
    const response = await api.guestLogin(name);
    setSession(setUser, response.data.token, response.data.user);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('taskflow_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .getProfile()
      .then((res) => {
        setUser({
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          isGuest: res.data.user.isGuest,
        });
      })
      .catch(() => {
        localStorage.removeItem('taskflow_token');
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
