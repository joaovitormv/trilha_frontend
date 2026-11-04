import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Bloqueia visitantes em rotas que exigem Auth: Sim
export const PrivateRoute = () => {
  const isAuthenticated = Boolean(localStorage.getItem('@CineComp:token'));
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Impede que usuários já logados voltem para as telas de Login ou Cadastro
export const PublicOnlyRoute = () => {
  const isAuthenticated = Boolean(localStorage.getItem('@CineComp:token'));
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};