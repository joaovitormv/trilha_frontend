import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { BaseLayout } from './components/Layout';
import { PrivateRoute, PublicOnlyRoute } from './components/PrivateRoute';
import { Home } from './pages/Home';
import { Catalog } from './pages/Filmes';
import { MovieDetails } from './pages/MovieDetails';
import { Favorites } from './pages/Favorites';
import { CreateMovie } from './pages/MovieCreate';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      // Rotas Públicas
      { path: '/', element: <Home /> },
      { path: '/filmes', element: <Catalog /> },
      { path: '/filmes/:id', element: <MovieDetails /> },

      // Rotas exclusivas para visitantes
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: '/login', element: <Login /> },
          { path: '/cadastro', element: <Cadastro /> },
        ],
      },

      // Rotas Protegidas (Auth: Sim)
      {
        element: <PrivateRoute />,
        children: [
          { path: '/favoritos', element: <Favorites /> },
          { path: '/filmes/novo', element: <CreateMovie /> },
          { path: '/perfil', element: <Profile /> },
        ],
      },
    ],
  },
]);