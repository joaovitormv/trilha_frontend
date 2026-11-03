import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../../api/services/authService';
import { getFriendlyApiError } from '../../api/utils/errorHandler';
import { Button } from '../../components/Button';
import { Modal, type ModalVariant } from '../../components/Modal';
import './styles.css';

export const Cadastro = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [modalState, setModalState] = useState<{ isOpen: boolean; variant: ModalVariant; title: string; message: string }>({
    isOpen: false,
    variant: 'error',
    title: '',
    message: ''
  });

  const navigate = useNavigate();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      setModalState({
        isOpen: true,
        variant: 'error',
        title: 'Campos Obrigatórios',
        message: 'Por favor, preencha todos os campos para criar a sua conta.'
      });
      return;
    }

    try {
      setIsLoading(true);
      await authService.register({ name, email, password });

      setModalState({
        isOpen: true,
        variant: 'success',
        title: 'Conta Criada!',
        message: 'Seu cadastro foi concluído com sucesso. Agora você já pode fazer login.'
      });

    } catch (err) {
      const apiError = getFriendlyApiError(err);
      setModalState({
        isOpen: true,
        variant: 'error',
        title: apiError.title,
        message: apiError.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (modalState.variant === 'success') {
      navigate('/login');
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
                  placeholder="Digite o seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

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
                    placeholder="Crie uma senha"
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

              <Button type="submit" disabled={isLoading}>
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

      <Modal
        isOpen={modalState.isOpen}
        variant={modalState.variant}
        title={modalState.title}
        message={modalState.message}
        onClose={handleCloseModal}
      />
    </main>
  );
};