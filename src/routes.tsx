import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { BaseLayout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Filmes';
import {Login} from './pages/Login';

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
        element: <Login/>,
      },
      {
        path: '/cadastro',
        element: <div style={{ padding: '40px' }}>Tela de Cadastro (Em breve)</div>,
      }
    ]
  }
]);