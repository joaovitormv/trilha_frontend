import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../../api/services/authService';
import { AuthLayout } from '../../components/AuthLayout';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { useFeedbackModal } from '../../hooks/useFeedbackModal';
import cadastroBg from '../../assets/registerImg.jpeg'; 

export const Cadastro = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { modal, showError, showSuccess, showApiError, closeModal } = useFeedbackModal();

  const navigate = useNavigate();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      showError('Campos Obrigatórios', 'Por favor, preencha todos os campos para criar a sua conta.');
      return;
    }

    try {
      setIsLoading(true);
      await authService.register({ name, email, password });

      showSuccess('Conta Criada!', 'Seu cadastro foi concluído com sucesso. Agora você já pode fazer login.');
    } catch (err) {
      showApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    closeModal();
    if (modal.variant === 'success') {
      navigate('/login');
    }
  };

  return (
    <>
      <AuthLayout
        subtitle="Junte-se ao CineComp!"
        title="Crie a sua conta"
        imageSrc={cadastroBg}
      >
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

          <Button type="submit" isLoading={isLoading}>
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>

          <p className="auth-redirect-text">
            Já possui uma conta? <Link to="/login">Faça login</Link>
          </p>
        </form>
      </AuthLayout>

      <Modal {...modal} onClose={handleCloseModal} />
    </>
  );
};