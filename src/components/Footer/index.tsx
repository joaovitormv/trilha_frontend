import React from 'react';
import './styles.css';

export const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        
        <div className="footer-links">
          <a href="/sobre">Sobre Nós</a>
          <a href="/termos">Termos</a>
          <a href="/privacidade">Privacidade</a>
          <a href="/ajuda">Ajuda</a>
          <a href="/contato">Contato</a>
        </div>

        <div className="footer-social-section">
          <p className="copyright-text">
            © 2026 CINECOMP. Todos os direitos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
};