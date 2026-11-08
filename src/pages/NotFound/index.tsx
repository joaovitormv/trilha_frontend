import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';
import './styles.css';

// Exibida para qualquer URL que não exista (rota "*" em routes.tsx).
export const NotFound = () => {
  return (
    <section className="not-found-page">
      <div className="not-found-card">
        <Film className="not-found-icon" size={48} aria-hidden="true" />

        <p className="not-found-code">404</p>
        <h1 className="not-found-title">Página não encontrada</h1>
        <p className="not-found-text">
          O endereço que você tentou acessar não existe ou foi movido. Confira se a URL está
          correta ou volte para um dos caminhos abaixo.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-btn not-found-btn-primary">
            <Home size={18} />
            Voltar ao início
          </Link>
          <Link to="/filmes" className="not-found-btn not-found-btn-secondary">
            Ver catálogo de filmes
          </Link>
        </div>
      </div>
    </section>
  );
};
