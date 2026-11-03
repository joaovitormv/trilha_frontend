import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/services/authService';
import { Button } from '../../components/Button';
import './styles.css';

export const Cadastro = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    try {
      setIsLoading(true);
      await authService.register({ name, email, password });

      setSuccessMessage('Usuário criado com sucesso! Redirecionando para o login...');

      // Aguarda 1.5s para o usuário ler a mensagem de sucesso antes de ir para o login
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        const apiMessage = err.response.data?.message;

        if (status === 409) {
          setError(apiMessage || 'Este e-mail já está em uso.');
        } else if (status === 400) {
          setError(apiMessage || 'Erro de validação. Verifique os dados informados.');
        } else {
          setError('Ocorreu um erro ao realizar o cadastro. Tente novamente.');
        }
      } else {
        setError('Erro de conexão com o servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-main-content">
      <div className="auth-split-card">
        
        <div className="auth-form-side">
          <div className="auth-content-wrapper">
            
            <div className="auth-titles">
              <p className="welcome-back">Junte-se ao CineComp!</p>
              <h1 className="main-title">Crie a sua conta</h1>
            </div>
            
            <form onSubmit={handleCadastro} className="auth-form">
              <div className="input-group">
                <label htmlFor="name">Nome</label>
                <input 
                  type="text" 
                  id="name"
                  placeholder="Digite seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading || !!successMessage}
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email"
                  placeholder="Entre com endereço de email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || !!successMessage}
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Senha</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    id="password"
                    placeholder="Crie uma senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || !!successMessage}
                  />
                  <button 
                    type="button" 
                    className="eye-icon-btn" 
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && <p className="auth-error-message">{error}</p>}
              {successMessage && <p className="auth-success-message">{successMessage}</p>}

              <Button type="submit" disabled={isLoading || !!successMessage}>
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>

              <p className="auth-redirect-text">
                Já possui uma conta? <Link to="/login">Faça login</Link>
              </p>
            </form>
            
          </div>
        </div>

        <div className="auth-image-side"></div>

      </div>
    </main>
  );
};