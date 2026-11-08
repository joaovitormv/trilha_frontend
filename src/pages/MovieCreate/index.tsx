import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';
import { movieService } from '../../api/services/movieService';
import type { MoviePayload } from '../../api/types/movie.types';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { MovieForm } from '../../components/MovieForm';
import { useFeedbackModal } from '../../hooks/useFeedbackModal';
import './styles.css';

export const CreateMovie = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [createdMovieId, setCreatedMovieId] = useState<number | null>(null);
  // Só para a pré-visualização; os campos em si vivem dentro do MovieForm
  const [posterUrl, setPosterUrl] = useState('');

  const { modal, showError, showSuccess, showApiError, closeModal } = useFeedbackModal();

  const handlePosterUrlChange = (url: string) => {
    setImageLoadError(false);
    setPosterUrl(url);
  };

  const handleSubmit = async (payload: MoviePayload) => {
    try {
      setIsSubmitting(true);
      const created = await movieService.create(payload);
      setCreatedMovieId(created?.id || null);

      showSuccess('Filme Adicionado!', `"${payload.title}" foi cadastrado no catálogo com sucesso.`);
    } catch (err) {
      showApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    closeModal();
    if (modal.variant === 'success') {
      navigate(createdMovieId ? `/filmes/${createdMovieId}` : '/filmes');
    }
  };

  const hasPosterUrl = posterUrl.trim().length > 0;

  return (
    <main className="create-movie-page">
      <div className="create-movie-wrapper">
        <div className="create-top-bar">
          <button type="button" className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>
        </div>

        <div className="create-movie-card">
          <h1 className="create-movie-title">Adicionar Novo Filme</h1>

          <MovieForm
            variant="create"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onInvalid={(error) => showError(error.title, error.message)}
            onPosterUrlChange={handlePosterUrlChange}
            actions={
              <div className="create-form-actions">
                <button
                  type="button"
                  className="cancel-create-btn"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <Button type="submit" isLoading={isSubmitting}>
                  <span className="submit-btn-inner">
                    <Check size={18} />
                    Salvar Filme
                  </span>
                </Button>
              </div>
            }
            aside={
                <div className="create-poster-column">
                  <div className="poster-preview-box">
                    {hasPosterUrl && !imageLoadError ? (
                      <img
                        src={posterUrl}
                        alt="Pré-visualização do pôster"
                        className="poster-preview-img"
                        onError={() => setImageLoadError(true)}
                      />
                    ) : (
                      <div className="poster-placeholder-content">
                        {imageLoadError ? (
                          <>
                            <AlertCircle size={40} color="#ff4d4d" />
                            <span className="poster-placeholder-title">Imagem indisponível</span>
                            <p className="poster-placeholder-hint">
                              Não foi possível carregar a imagem a partir da URL informada.
                            </p>
                          </>
                        ) : (
                          <>
                            <ImageIcon size={42} color="#6a0dad" />
                            <span className="poster-placeholder-title">PÔSTER / CAPA</span>
                            <p className="poster-placeholder-hint">
                              Insira o link da imagem no campo "URL do Pôster" para pré-visualizar a capa aqui.
                            </p>
                            <div className="poster-format-badges">
                              <span>JPG</span>
                              <span>PNG</span>
                              <span>WEBP</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
            }
          />
        </div>
      </div>

      <Modal {...modal} onClose={handleCloseModal} />
    </main>
  );
};