import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './styles.css';

export const Header = () => {
  // O useLocation força o Header a revalidar o localStorage sempre que a rota muda
  useLocation();
  const navigate = useNavigate();

  const isAuthenticated = Boolean(localStorage.getItem('@CineComp:token'));

  const handleLogout = () => {
    localStorage.removeItem('@CineComp:token');
    localStorage.removeItem('@CineComp:user');
    navigate('/login');
  };

  return (
    <header className="app-header">
      <Link to="/" className="logo-container">
        <img src="/CINECOMP.png" alt="CineComp Logo" className="logo-icon" />
        <span className="logo-text">CineComp</span>
      </Link>
      
      <nav className="nav-links">
        {isAuthenticated ? (
          <>
            <Link to="/">Início</Link>
            <Link to="/filmes">Filmes</Link>
            <Link to="/favoritos">Favoritos</Link>
            <Link to="/perfil">Perfil</Link>
            <button type="button" onClick={handleLogout} className="nav-logout-btn">
              Sair
            </button>
          </>
        ) : (
          <>
            <Link to="/">Início</Link>
            <Link to="/filmes">Filmes</Link>
            <Link to="/cadastro">Cadastro</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
};