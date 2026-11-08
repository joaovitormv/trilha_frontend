import { createBrowserRouter } from 'react-router-dom';

import { BaseLayout } from './components/Layout';
import { AuthProvider } from './contexts/AuthProvider';
import { PrivateRoute, PublicOnlyRoute } from './components/PrivateRoute';
import { Home } from './pages/Home';
import { Catalog } from './pages/Filmes';
import { MovieDetails } from './pages/MovieDetails';
import { Favorites } from './pages/Favorites';
import { CreateMovie } from './pages/MovieCreate';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { Credits } from './pages/Credits';

export const router = createBrowserRouter([
  {
    path: '/',
    // AuthProvider fica dentro do roteador para poder redirecionar ao receber 401
    element: (
      <AuthProvider>
        <BaseLayout />
      </AuthProvider>
    ),
    children: [
      // Rotas Públicas
      { path: '/', element: <Home /> },
      { path: '/filmes', element: <Catalog /> },
      { path: '/filmes/:id', element: <MovieDetails /> },
      { path: '/creditos', element: <Credits /> },

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