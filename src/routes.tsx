import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { BaseLayout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Filmes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />, 
    children: [
      {
        path: '/', 
        element: <Home />,
      },
      {
        path: '/filmes', 
        element: <Catalog />, 
      },
      {
        path: '/login',
        element: <div style={{ padding: '40px' }}>Tela de Login (Em breve)</div>,
      },
      {
        path: '/cadastro',
        element: <div style={{ padding: '40px' }}>Tela de Cadastro (Em breve)</div>,
      }
    ]
  }
]);