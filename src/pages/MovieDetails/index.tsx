import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { movieService } from '../../api/services/movieService';
import { Modal } from '../../components/Modal';
import { Skeleton } from '../../components/Skeleton';
import { useFeedbackModal } from '../../hooks/useFeedbackModal';
import { useMovie } from '../../hooks/useMovie';
import { MovieReadView } from './components/movieReadView';
import { MovieEditForm } from './components/movieEditForm';
import './styles.css';

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { movie, isLoading, error: loadError, setMovie } = useMovie(id);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const { modal, showSuccess, showApiError, closeModal } = useFeedbackModal();

  const handleDeleteMovie = async () => {
    if (!movie) return;
    setIsDeleteConfirmOpen(false);
    try {
      await movieService.remove(movie.id);
      showSuccess('Filme Excluído', 'O filme foi removido do catálogo com sucesso.');
    } catch (err) {
      showApiError(err);
    }
  };

  // Depois de excluir com sucesso, volta para o catálogo
  const handleCloseFeedbackModal = () => {
    closeModal();
    if (modal.variant === 'success') navigate('/filmes');
  };

  return (
    <main className="movie-details-page">
      <div className="movie-details-wrapper">
        <div className="details-top-bar">
          <button type="button" className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>
        </div>

        {isLoading && (
          <div className="details-card">
            <div className="details-poster-column">
              <Skeleton height="450px" borderRadius="12px" />
            </div>
            <div className="details-info-column">
              <Skeleton width="65%" height="38px" />
              <Skeleton width="40%" height="22px" />
              <Skeleton width="100%" height="120px" />
              <Skeleton width="80%" height="60px" />
            </div>
          </div>
        )}

        {!isLoading && movie && (
          isEditing ? (
            <MovieEditForm
              movie={movie}
              onCancel={() => setIsEditing(false)}
              onSuccess={(updatedMovie) => {
                setMovie(updatedMovie);
                setIsEditing(false);
              }}
            />
          ) : (
            <MovieReadView
              movie={movie}
              onEdit={() => setIsEditing(true)}
              onDelete={() => setIsDeleteConfirmOpen(true)}
            />
          )
        )}
      </div>

      <Modal
        isOpen={isDeleteConfirmOpen}
        variant="confirm"
        title="Excluir filme?"
        message={`Tem certeza que deseja excluir "${movie?.title}"? Esta ação não poderá ser desfeita.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        onConfirm={handleDeleteMovie}
        onClose={() => setIsDeleteConfirmOpen(false)}
      />

      <Modal {...modal} onClose={handleCloseFeedbackModal} />

      {/* Falha ao carregar o filme: ao fechar, volta para o catálogo */}
      <Modal
        isOpen={Boolean(loadError)}
        variant="error"
        title={loadError?.title ?? ''}
        message={loadError?.message ?? ''}
        onClose={() => navigate('/filmes')}
      />
    </main>
  );
};