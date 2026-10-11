import React from 'react';
import './styles.css';

export const Header = () => {
  return (
    <header className="app-header">
      <div className="logo-container">
        {/* COLE O CAMINHO DA SUA IMAGEM DE LOGO AQUI */}
        <img src="COLE_AQUI_A_LOGO.png" alt="CineComp Logo" className="logo-icon" />
        <span className="logo-text">CineComp</span>
      </div>
      <nav className="nav-links">
        <a href="/filmes">Filmes</a>
        <a href="/cadastro">Cadastro</a>
        <a href="/login">Login</a>
      </nav>
    </header>
  );
};