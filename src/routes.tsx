import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { BaseLayout } from './components/Layout';
import { PrivateRoute, PublicOnlyRoute } from './components/privateRoute';
import { Home } from './pages/Home';
import { Catalog } from './pages/Filmes';
import { MovieDetails } from './pages/MovieDetails';
import { Favorites } from './pages/Favorites';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { CreateMovie } from './pages/MovieCreate';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      // Rotas Públicas (Auth: Não)
      { path: '/', element: <Home /> },
      { path: '/filmes', element: <Catalog /> },
      { path: '/filmes/:id', element: <MovieDetails /> },

      // Rotas exclusivas para visitantes (redireciona para '/' se já estiver logado)
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
          // As próximas duas telas já entrarão protegidas aqui:
          // { path: '/filmes/novo', element: <CreateMovie /> },
          // { path: '/perfil', element: <Profile /> },
        ],
      },
      {
        element: <PrivateRoute />,
        children: [
          { path: '/favoritos', element: <Favorites /> },
          { path: '/filmes/novo', element: <CreateMovie /> },
        ],
      },
    ],
  },
]);