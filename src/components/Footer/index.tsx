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
          <div className="social-icons">
            <img src="caminho_icone_facebook.png" alt="Facebook" />
            <img src="caminho_icone_instagram.png" alt="Instagram" />
            <img src="caminho_icone_twitter.png" alt="Twitter" />
            <img src="caminho_icone_youtube.png" alt="YouTube" />
          </div>
          <p className="copyright-text">
            © 2026 CINECOMP. Todos os direitos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
};