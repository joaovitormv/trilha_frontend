import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/services/authService';
import { Button } from '../../components/Button';
import './styles.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      const { token } = response.data;
      localStorage.setItem('@CineComp:token', token);
      
      navigate('/filmes');
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError('E-mail ou senha inválidos.');
      } else {
        setError('Ocorreu um erro no servidor. Tente novamente mais tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="auth-main-content">
      <div className="auth-split-card">
        
        <div className="auth-form-side">
          {/* Wrapper centralizador para agrupar e dimensionar o formulário */}
          <div className="auth-content-wrapper">
            
            <div className="auth-titles">
              <p className="welcome-back">Bem vindo de volta!</p>
              <h1 className="main-title">Faça o login novamente</h1>
            </div>
            
            <form onSubmit={handleLogin} className="auth-form">
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email"
                  placeholder="Entre com endereço de email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Senha</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button 
                    type="button" 
                    className="eye-icon-btn" 
                    onClick={togglePasswordVisibility}
                    tabIndex={-1} 
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && <p className="auth-error-message">{error}</p>}

              <div className="auth-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  Lembrar
                </label>
                <a href="#" className="forgot-password">
                  Eu esqueci minha senha
                </a>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'A entrar...' : 'Entrar'}
              </Button>
            </form>
            
          </div>
        </div>

        <div className="auth-image-side"></div>

      </div>
    </main>
  );
};