import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Modal } from '../Modal';
import './styles.css';
import logoImg from '../../assets/logo.png';

export const Header = () => {
  useLocation();
  const navigate = useNavigate();
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
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
        <Link to="/" className="logo-container" onClick={closeMenu}>
          <img src={logoImg} alt="Logo CineComp" className="header-logo-img" />
          <span className="logo-text">CineComp</span>
        </Link>
        
        <button
          type="button"
          className="menu-toggle"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}>
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

      <Modal       isOpen={isLogoutModalOpen}
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