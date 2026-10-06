import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AuthContext as AuthContextType, UserCredentials, User } from '../types/types';
import {
  register as apiRegister,
  login as apiLogin,
  getMe as apiGetMe,
} from '../services/authService';

type AuthProviderProps = {
  children: ReactNode;
};

const TOKEN_KEY = 'token';
const USERNAME_KEY = 'username';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);

    try {
      setError(null);
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        const user = await apiGetMe();
        setUser(user);
      }
    } catch (err) {
      setError(new Error('Failed to check authentication'));
      console.error('Failed to verify user', err);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USERNAME_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const register = async (credentials: UserCredentials): Promise<void> => {
    setIsLoading(true);

    try {
      const { user, token } = await apiRegister(credentials);
      setUser(user);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USERNAME_KEY, user.username);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: UserCredentials): Promise<void> => {
    setIsLoading(true);

    try {
      const { user, token } = await apiLogin(credentials);
      setUser(user);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USERNAME_KEY, user.username);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    checkAuth,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth() context should be used within AuthProvider');
  }
  return context;
};
