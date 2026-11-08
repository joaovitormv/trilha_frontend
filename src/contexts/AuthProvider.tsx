import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/services/authService';
import type { LoginPayload } from '../api/types/auth.types';
import type { User } from '../api/types/user.types';
import {
  clearSession,
  getStoredToken,
  getStoredUser,
  saveSession,
  saveUser,
  setUnauthorizedHandler,
} from '../api/config/session';
import { AuthContext, type AuthContextData } from './AuthContext';

interface SessionState {
  token: string | null;
  user: User | null;
}

const EMPTY_SESSION: SessionState = { token: null, user: null };

// Precisa ficar DENTRO do roteador (usa useNavigate para redirecionar no 401).
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [session, setSession] = useState<SessionState>(() => ({
    token: getStoredToken(),
    user: getStoredUser(),
  }));

  const [sessionExpired, setSessionExpired] = useState(false);

  const login = useCallback(async (credentials: LoginPayload) => {
    const response = await authService.login(credentials);
    const { token, user } = response.data;

    saveSession(token, user);
    setSession({ token, user });
    setSessionExpired(false);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(EMPTY_SESSION);
  }, []);

  const updateUser = useCallback((user: User) => {
    saveUser(user);
    setSession((current) => ({ ...current, user }));
  }, []);

  const dismissSessionExpired = useCallback(() => setSessionExpired(false), []);

  // 401 vindo da API: o interceptor já limpou o localStorage, aqui sincronizamos o estado e redirecionamos.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setSession(EMPTY_SESSION);
      setSessionExpired(true);
      navigate('/login', { replace: true });
    });

    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  const value = useMemo<AuthContextData>(
    () => ({
      user: session.user,
      isAuthenticated: Boolean(session.token),
      sessionExpired,
      login,
      logout,
      updateUser,
      dismissSessionExpired,
    }),
    [session, sessionExpired, login, logout, updateUser, dismissSessionExpired],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
