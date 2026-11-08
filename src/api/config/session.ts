import type { User } from '../types/user.types';

const TOKEN_KEY = '@CineComp:token';
const USER_KEY = '@CineComp:user';

// Único ponto da aplicação que conhece as chaves do localStorage.
// Componentes devem usar o AuthContext (useAuth); o axiosClient usa estas funções
// porque roda fora da árvore do React.

export const getStoredToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = (): User | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const saveSession = (token: string, user: User): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Ponte entre o interceptor do Axios (fora do React) e o AuthContext (dentro do React).
type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null): void => {
  unauthorizedHandler = handler;
};

// Chamado quando a API recusa um token (401): limpa a sessão persistida e avisa o AuthContext.
export const notifyUnauthorized = (): void => {
  clearSession();
  unauthorizedHandler?.();
};
