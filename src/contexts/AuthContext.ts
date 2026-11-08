import { createContext } from 'react';
import type { User } from '../api/types/user.types';
import type { LoginPayload } from '../api/types/auth.types';

export interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  // true quando a API encerrou a sessão (401) e o usuário ainda não foi avisado
  sessionExpired: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  dismissSessionExpired: () => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);
