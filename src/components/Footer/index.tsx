import './styles.css';

export const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        
        <div className="footer-links">
          <a href="/Creditos">Sobre Nós</a>
          <a href="/Creditos">Termos</a>
          <a href="/Creditos">Privacidade</a>
          <a href="/Creditos">Ajuda</a>
          <a href="/Creditos">Contato</a>
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