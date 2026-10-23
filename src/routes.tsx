import React from 'react';
import { createBrowserRouter } from 'react-router-dom';


import { Home } from './pages/Home';
import { Catalog } from './pages/Filmes';

// O createBrowserRouter é a forma mais moderna (v6+) de configurar rotas no React.
// Ele recebe uma lista (array) de objetos, onde cada objeto é uma rota da sua aplicação.
export const router = createBrowserRouter([
  {
    path: '/', // Caminho raiz (quando o usuário acessa só localhost:3000)
    element: <Home />, // Qual componente desenhar na tela
  },
  {
    path: '/filmes', // Quando a URL for localhost:3000/filmes
    element: <Catalog />, 
  },
  // Já podemos deixar preparados os caminhos vazios para o que faremos a seguir:
  {
    path: '/login',
    element: <div style={{ color: 'white' }}>Tela de Login (Em breve)</div>,
  },
  {
    path: '/cadastro',
    element: <div style={{ color: 'white' }}>Tela de Cadastro (Em breve)</div>,
  }
]);