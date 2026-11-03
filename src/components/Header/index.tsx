import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Modal } from '../Modal';
import './styles.css';

export const Header = () => {
  useLocation();
  const navigate = useNavigate();
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const isAuthenticated = Boolean(localStorage.getItem('@CineComp:token'));

  const handleLogout = () => {
    localStorage.removeItem('@CineComp:token');
    localStorage.removeItem('@CineComp:user');
    setIsLogoutModalOpen(false);
    navigate('/login');
  };

  return (
    <>
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
              <button 
                type="button" 
                onClick={() => setIsLogoutModalOpen(true)} 
                className="nav-logout-btn"
              >
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

      <Modal
        isOpen={isLogoutModalOpen}
        variant="confirm"
        title="Deseja mesmo sair?"
        message="Sua sessão será encerrada e você precisará fazer login novamente para acessar o sistema."
        confirmText="Sair"
        cancelText="Cancelar"
        onConfirm={handleLogout}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};