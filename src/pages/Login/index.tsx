import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../../api/services/authService';
import { getFriendlyApiError, type FriendlyError } from '../../api/utils/errorHandler';
import { AuthLayout } from '../../components/AuthLayout';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import loginBg from '../../assets/loginImg.jpeg'; 

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<FriendlyError | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setApiError({
        title: 'Campos Obrigatórios',
        message: 'Por favor, preencha o seu e-mail e a sua senha para continuar.',
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem('@CineComp:token', token);
      localStorage.setItem('@CineComp:user', JSON.stringify(user));

      navigate('/');
    } catch (err) {
      setApiError(getFriendlyApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        subtitle="Bem-vindo de volta!"
        title="Faça o login novamente"
        imageSrc={loginBg}
      >
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Entre com o endereço de email"
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
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
              </button>
            </div>
          </div>

          <Button type="submit" isLoading={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>

          <p className="auth-redirect-text">
            Ainda não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </form>
      </AuthLayout>

      <Modal
        isOpen={Boolean(apiError)}
        variant="error"
        title={apiError?.title || ''}
        message={apiError?.message || ''}
        onClose={() => setApiError(null)}
      />
    </>
  );
};