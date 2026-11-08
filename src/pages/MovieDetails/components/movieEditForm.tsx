import { useState } from 'react';
import { Save, X, Film } from 'lucide-react';
import { movieService } from '../../../api/services/movieService';
import type { Movie, MoviePayload } from '../../../api/types/movie.types';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import { MovieForm } from '../../../components/MovieForm';
import { useFeedbackModal } from '../../../hooks/useFeedbackModal';
import { movieToFormData } from '../../../utils/validateMovie';

interface Props {
  movie: Movie;
  onCancel: () => void;
  onSuccess: (updatedMovie: Movie) => void;
}

export const MovieEditForm = ({ movie, onCancel, onSuccess }: Props) => {
  const [isSaving, setIsSaving] = useState(false);
  // Só para a pré-visualização; os campos em si vivem dentro do MovieForm
  const [posterUrl, setPosterUrl] = useState(movie.posterUrl || '');

  const { modal, showApiError, showError, closeModal } = useFeedbackModal();

  const handleSaveEdit = async (payload: MoviePayload) => {
    try {
      setIsSaving(true);
      const updatedMovie = await movieService.update(movie.id, payload);
      onSuccess(updatedMovie);
    } catch (err) {
      showApiError(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="details-card">
        <div className="details-poster-column">
          {posterUrl ? (
            <img src={posterUrl} alt="Pré-visualização" className="details-poster-img" />
          ) : (
            <div className="details-no-poster">
              <Film size={48} color="#555" /><span>Sem Pôster</span>
            </div>
          )}
        </div>

        <div className="details-info-column">
          <MovieForm
            variant="edit"
            initialValues={movieToFormData(movie)}
            isSubmitting={isSaving}
            onSubmit={handleSaveEdit}
            onInvalid={(error) => showError(error.title, error.message)}
            onPosterUrlChange={setPosterUrl}
            header={
              <div className="edit-form-header">
                <h2>Editar Filme</h2>
                <button type="button" className="cancel-icon-btn" onClick={onCancel} title="Cancelar edição">
                  <X size={22} />
                </button>
              </div>
            }
            actions={
              <div className="edit-form-actions">
                <button type="button" className="action-btn cancel-edit-btn" onClick={onCancel} disabled={isSaving}>
                  Cancelar
                </button>
                <Button type="submit" isLoading={isSaving}>
                  <span className="save-btn-content"><Save size={18} /> Salvar Alterações</span>
                </Button>
              </div>
            }
          />
        </div>
      </div>

      <Modal {...modal} onClose={closeModal} />
    </>
  );
};
