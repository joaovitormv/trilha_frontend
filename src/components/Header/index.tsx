// src/components/Header/index.tsx
import React from 'react';
import { Link } from 'react-router-dom'; 
import './styles.css';

export const Header = () => {
  return (
    <header className="app-header">
      <Link to="/" className="logo-container">
        <img src="/CINECOMP.png" alt="CineComp Logo" className="logo-icon" />
        <span className="logo-text">CineComp</span>
      </Link>
      
      <nav className="nav-links">
        <Link to="/filmes">Filmes</Link>
        <Link to="/cadastro">Cadastro</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
};