import { useNavigate } from 'react-router-dom';
import {
  Film,
  Code2,
  Layers,
  ShieldCheck,
  Award,
  ArrowLeft,
  Server,
  Sparkles,
  GitBranchMinus
} from 'lucide-react';
import './styles.css';

export const Credits = () => {
  const navigate = useNavigate();

  return (
    <main className="credits-page">
      <div className="credits-wrapper">
        <div className="credits-top-bar">
          <button type="button" className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            <span>Voltar</span>
          </button>
        </div>

        <section className="credits-hero-card">
          <div className="credits-badge">
            <Sparkles size={15} />
            <span>Trilha Trainee Front-end • Comp Júnior</span>
          </div>
          <h1 className="credits-main-title">Sobre o CineComp & Créditos</h1>
          <p className="credits-subtitle">
            O CineComp é uma plataforma web moderna para curadoria, descoberta e gestão de
            catálogos cinematográficos, projetada sob padrões reais de engenharia de software,
            escalabilidade e experiência do usuário (UI/UX).
          </p>
        </section>

        {/* Esta seção agora será apenas 3 colunas simples e limpas */}
        <section className="credits-grid">
          <div className="credits-info-card">
            <div className="card-icon-box">
              <Award size={24} color="#8a2be2" />
            </div>
            <h2>Propósito Acadêmico</h2>
            <p>
              Desenvolvido como projeto prático para o processo de capacitação da{' '}
              <strong>Comp Júnior</strong>, aplicando conceitos de componentização, rotas
              protegidas, consumo assíncrono de API REST e tratamento global de exceções.
            </p>
          </div>

          <div className="credits-info-card">
            <div className="card-icon-box">
              <Layers size={24} color="#8a2be2" />
            </div>
            <h2>Arquitetura & Stack</h2>
            <p>
              Construído com <strong>React 18</strong>, <strong>TypeScript</strong>,{' '}
              <strong>Vite</strong>, <strong>React Router DOM</strong>, <strong>Axios</strong> e{' '}
              <strong>Lucide Icons</strong>, seguindo a organização <em>Folder-as-Component</em>.
            </p>
          </div>

          <div className="credits-info-card">
            <div className="card-icon-box">
              <ShieldCheck size={24} color="#8a2be2" />
            </div>
            <h2>Termos & Privacidade</h2>
            <p>
              Aplicação de caráter demonstrativo e educacional. Os dados de autenticação e sessão
              são processados localmente via tokens JWT exclusivamente para simulação das
              funcionalidades do sistema.
            </p>
          </div>
        </section>

        <section className="credits-roll-card">
          <div className="credits-roll-header">
            <Film size={24} color="#8a2be2" />
            <h2>Ficha Técnica</h2>
          </div>

          <div className="credits-roll-list">
            <div className="credits-roll-item">
              <span className="roll-role">Desenvolvimento Front-end & UI/UX</span>
              <span className="roll-name">João Vitor Maximiano Vieira</span>
            </div>

            <div className="credits-roll-item">
              <span className="roll-role">Integração Back-end (API RESTful)</span>
              <span className="roll-name">API Oficial CineComp 2026.2</span>
            </div>
          </div>

          <div className="credits-links-footer">
            <a
              href="https://github.com/joaovitormv/trilha_frontend"
              target="_blank"
              rel="noreferrer"
              className="credits-ext-link"
            >
              <Code2 size={17} />
              <span>Repositório Front-end</span>
            </a>

            <a
              href="https://github.com/jpedroreiss/backend-cinecomp-2026-2"
              target="_blank"
              rel="noreferrer"
              className="credits-ext-link"
            >
              <Server size={17} />
              <span>Repositório da API</span>
            </a>

            <a
              href="https://github.com/joaovitormv"
              target="_blank"
              rel="noreferrer"
              className="credits-ext-link"
            >
              <GitBranchMinus size={17} />
              <span>Perfil no GitHub</span>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
};