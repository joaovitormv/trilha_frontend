// src/App.tsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes'; // Importamos a configuração que acabamos de criar

function App() {
  // O RouterProvider é o "motor" que escuta a URL do navegador
  // e exibe o elemento correto baseado no arquivo routes.tsx
  return <RouterProvider router={router} />;
}

export default App;