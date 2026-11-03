import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';

export const VisitorView = () => {
  const navigate = useNavigate();
  return (
    <div className="hero-card">
      <div className="hero-content">
        <div className="hero-left">
          <h1>Crie, edite e favorite<br/>seus filmes com o<br/>CineComp</h1>
          <div className="action-box">
            <p>Já possui uma conta?</p>
            <Button onClick={() => navigate('/login')}>Login</Button>
          </div>
        </div>
        <div className="hero-right">
          <div className="action-box align-center">
            <p>É novo por aqui?</p>
            <Button onClick={() => navigate('/cadastro')}>Cadastrar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};