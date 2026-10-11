import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/Button';
import './styles.css';

export const Home = () => {
  return (
    <div className="home-page-container">
      <Header />
      
      <main className="home-main-content">
        <div className="hero-card">
          
          {/* A div hero-content agrupa os textos e fica por cima da imagem de fundo */}
          <div className="hero-content">
            
            {/* Lado Esquerdo (Título em cima, Login embaixo) */}
            <div className="hero-left">
              <h1>Crie, edite e favorite<br />seus filmes com o<br />CineComp</h1>
              
              <div className="action-box">
                <p>Já possui uma conta?</p>
                <Button>Login</Button>
              </div>
            </div>

            {/* Lado Direito (Cadastro em cima) */}
            <div className="hero-right">
              {/* Adicionamos uma classe extra para centralizar o botão de cadastrar com o texto */}
              <div className="action-box align-center">
                <p>É novo por aqui?</p>
                <Button>Cadastrar</Button>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};