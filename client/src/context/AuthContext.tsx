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
  loginAsGuest: (name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('taskflow_token');
    setUser(null);
  }, []);

  const loginAsGuest = useCallback(async (name?: string) => {
    const response = await api.guestLogin(name);
    localStorage.setItem('taskflow_token', response.data.token);
    setUser({
      id: response.data.user.id,
      name: response.data.user.name,
      isGuest: response.data.user.isGuest,
    });
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
