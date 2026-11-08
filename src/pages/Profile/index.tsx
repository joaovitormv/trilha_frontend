import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Lock,
  Calendar,
  Save,
  Eye,
  EyeOff,
  Pencil,
  Home,
  X,
} from 'lucide-react';
import { userService } from '../../api/services/userService';
import type { User, UpdateProfilePayload } from '../../api/types/user.types';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Skeleton } from '../../components/Skeleton';
import { useAuth } from '../../hooks/useAuth';
import { useFeedbackModal } from '../../hooks/useFeedbackModal';
import './styles.css';

export const Profile = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { modal, showError, showSuccess, showApiError, closeModal } = useFeedbackModal();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await userService.getProfile();
        setProfile(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          password: '',
        });
      } catch (err) {
        showApiError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [showApiError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        password: '',
      });
    }
    setShowPassword(false);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      showError('Campos Obrigatórios', 'O nome e o endereço de e-mail não podem ficar em branco.');
      return;
    }

    const payload: UpdateProfilePayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
    };

    if (formData.password.trim()) {
      payload.password = formData.password.trim();
    }

    try {
      setIsSaving(true);
      const updatedUser = await userService.updateProfile(payload);
      setProfile(updatedUser);
      setFormData({
        name: updatedUser.name || payload.name,
        email: updatedUser.email || payload.email,
        password: '',
      });

      updateUser(updatedUser);
      setIsEditing(false);
      setShowPassword(false);

      showSuccess('Perfil Atualizado', 'Suas informações cadastrais foram salvas com sucesso.');
    } catch (err) {
      showApiError(err);
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <main className="profile-page">
      <div className="profile-wrapper">
        <div className="profile-top-bar">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate('/')}
          >
            <Home size={18} />
            <span>Ir para a Tela Inicial</span>
          </button>
        </div>

        <div className="profile-title-row">
          <h1 className="profile-page-title">Configurações da Conta</h1>
          <p className="profile-page-subtitle">
            Gerencie seus dados pessoais, credenciais de acesso e preferências de segurança.
          </p>
        </div>

        {isLoading ? (
          <div className="profile-card">
            <div className="profile-header-skeleton">
              <Skeleton width="80px" height="80px" borderRadius="50%" />
              <div className="profile-header-lines">
                <Skeleton width="220px" height="24px" />
                <Skeleton width="160px" height="16px" />
              </div>
            </div>
            <Skeleton width="100%" height="52px" borderRadius="10px" />
            <Skeleton width="100%" height="52px" borderRadius="10px" />
          </div>
        ) : (
          <section className="profile-card">
            <div className="profile-banner">
              <div className="profile-banner-left">
                <div className="profile-avatar">
                  <span>{getInitials(profile?.name || formData.name)}</span>
                </div>
                <div className="profile-identity">
                  <h2>{profile?.name || 'Usuário'}</h2>
                  <p>{profile?.email}</p>
                  {profile?.createdAt && (
                    <span className="profile-member-since">
                      <Calendar size={13} />
                      Membro desde {formatDate(profile.createdAt)}
                    </span>
                  )}
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  className="enable-edit-btn"
                  onClick={handleStartEdit}
                  title="Editar informações do perfil"
                >
                  <Pencil size={16} />
                  <span>Editar Perfil</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="profile-fields-grid">
                <div className="profile-field">
                  <label htmlFor="name">Nome Completo</label>
                  <div className={`profile-input-wrapper ${!isEditing ? 'read-only' : ''}`}>
                    <UserIcon size={18} className="field-left-icon" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing || isSaving}
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="email">Endereço de E-mail</label>
                  <div className={`profile-input-wrapper ${!isEditing ? 'read-only' : ''}`}>
                    <Mail size={18} className="field-left-icon" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing || isSaving}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="profile-field full-width">
                    <label htmlFor="password">
                      Nova Senha <span className="optional-tag">(deixe em branco para manter a atual)</span>
                    </label>
                    <div className="profile-input-wrapper">
                      <Lock size={18} className="field-left-icon" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite uma nova senha caso deseje alterar"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isSaving}
                      />
                      <button
                        type="button"
                        className="profile-eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="profile-edit-actions">
                  <button
                    type="button"
                    className="cancel-profile-btn"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    <X size={18} />
                    <span>Cancelar</span>
                  </button>

                  <Button type="submit" isLoading={isSaving} style={{ width: 'auto', padding: '12px 24px' }}>
                    <span className="profile-save-content">
                      <Save size={18} />
                      <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
                    </span>
                  </Button>
                </div>
              )}
            </form>
          </section>
        )}
      </div>

      <Modal {...modal} onClose={closeModal} />
    </main>
  );
};