import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { movieService } from '../../api/services/movieService';
import type { Movie } from '../../api/types/movie.types';
import { getFriendlyApiError } from '../../api/utils/errorHandler';
import { Modal, type ModalVariant } from '../../components/Modal';
import { Skeleton } from '../../components/Skeleton';
import { MovieReadView } from './components/movieReadView';
import { MovieEditForm } from './components/movieEditForm';
import './styles.css';

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);

  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    variant: ModalVariant;
    title: string;
    message: string;
    redirectOnClose?: boolean;
  }>({
    isOpen: false,
    variant: 'error',
    title: '',
    message: '',
  });

  const loadMovie = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await movieService.getById(Number(id));
      setMovie(data);
    } catch (err) {
      const apiError = getFriendlyApiError(err);
      setFeedbackModal({
        isOpen: true,
        variant: 'error',
        title: apiError.title,
        message: apiError.message,
        redirectOnClose: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMovie();
  }, [loadMovie]);

  const handleDeleteMovie = async () => {
    if (!movie) return;
    setIsDeleteConfirmOpen(false);
    try {
      await movieService.remove(movie.id);
      setFeedbackModal({
        isOpen: true,
        variant: 'success',
        title: 'Filme Excluído',
        message: 'O filme foi removido do catálogo com sucesso.',
        redirectOnClose: true,
      });
    } catch (err) {
      const apiError = getFriendlyApiError(err);
      setFeedbackModal({
        isOpen: true,
        variant: 'error',
        title: apiError.title,
        message: apiError.message,
      });
    }
  };

  const handleCloseFeedbackModal = () => {
    const shouldRedirect = feedbackModal.redirectOnClose;
    setFeedbackModal((prev) => ({ ...prev, isOpen: false }));
    if (shouldRedirect) navigate('/filmes');
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

      <Modal
        isOpen={feedbackModal.isOpen}
        variant={feedbackModal.variant}
        title={feedbackModal.title}
        message={feedbackModal.message}
        onClose={handleCloseFeedbackModal}
      />
    </main>
  );
};