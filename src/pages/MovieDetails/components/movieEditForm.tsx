import React, { useState } from 'react';
import { Save, X, Film } from 'lucide-react';
import { movieService } from '../../../api/services/movieService';
import type { Movie, MoviePayload } from '../../../api/types/movie.types';
import { getFriendlyApiError } from '../../../api/utils/errorHandler';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';

const GENRE_OPTIONS = [
  { label: 'Ficção Científica', value: 'Ficcao Cientifica' },
  { label: 'Ação', value: 'Acao' },
  { label: 'Drama', value: 'Drama' },
  { label: 'Comédia', value: 'Comedia' },
  { label: 'Aventura', value: 'Aventura' },
  { label: 'Suspense', value: 'Suspense' },
  { label: 'Terror', value: 'Terror' },
  { label: 'Animação', value: 'Animacao' },
];

interface Props {
  movie: Movie;
  onCancel: () => void;
  onSuccess: (updatedMovie: Movie) => void;
}

export const MovieEditForm = ({ movie, onCancel, onSuccess }: Props) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: movie.title || '',
    description: movie.description || '',
    genre: movie.genre || '',
    director: movie.director || '',
    releaseYear: String(movie.releaseYear || ''),
    rating: String(movie.rating ?? ''),
    posterUrl: movie.posterUrl || '',
  });

  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !formData.genre.trim() || !formData.director.trim() || !formData.releaseYear || formData.rating === '') {
      setErrorModal({ isOpen: true, title: 'Campos Obrigatórios', message: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    const parsedYear = Number(formData.releaseYear);
    const parsedRating = Number(formData.rating);

    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 10) {
      setErrorModal({ isOpen: true, title: 'Nota Inválida', message: 'A avaliação deve ser um número entre 0 e 10.' });
      return;
    }

    const payload: MoviePayload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      genre: formData.genre.trim(),
      director: formData.director.trim(),
      releaseYear: parsedYear,
      rating: parsedRating,
      posterUrl: formData.posterUrl.trim() || undefined,
    };

    try {
      setIsSaving(true);
      const updatedMovie = await movieService.update(movie.id, payload);
      onSuccess(updatedMovie);
    } catch (err) {
      const apiError = getFriendlyApiError(err);
      setErrorModal({ isOpen: true, title: apiError.title, message: apiError.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="details-card">
        <div className="details-poster-column">
          {formData.posterUrl ? (
            <img src={formData.posterUrl} alt="Pré-visualização" className="details-poster-img" />
          ) : (
            <div className="details-no-poster">
              <Film size={48} color="#555" /><span>Sem Pôster</span>
            </div>
          )}
        </div>

        <div className="details-info-column">
          <form onSubmit={handleSaveEdit} className="details-edit-form">
            <div className="edit-form-header">
              <h2>Editar Filme</h2>
              <button type="button" className="cancel-icon-btn" onClick={onCancel} title="Cancelar edição">
                <X size={22} />
              </button>
            </div>

            <div className="edit-grid">
              <div className="edit-field full-width">
                <label>Título</label>
                <input name="title" type="text" value={formData.title} onChange={handleInputChange} disabled={isSaving} />
              </div>

              <div className="edit-field">
                <label>Gênero</label>
                <select name="genre" value={formData.genre} onChange={handleInputChange} disabled={isSaving}>
                  <option value="">Selecione...</option>
                  {GENRE_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              <div className="edit-field">
                <label>Diretor</label>
                <input name="director" type="text" value={formData.director} onChange={handleInputChange} disabled={isSaving} />
              </div>

              <div className="edit-field">
                <label>Ano de Lançamento</label>
                <input name="releaseYear" type="number" min="1888" max="2099" value={formData.releaseYear} onChange={handleInputChange} disabled={isSaving} />
              </div>

              <div className="edit-field">
                <label>Avaliação (0 a 10)</label>
                <input name="rating" type="number" step="0.1" min="0" max="10" value={formData.rating} onChange={handleInputChange} disabled={isSaving} />
              </div>

              <div className="edit-field full-width">
                <label>URL do Pôster</label>
                <input name="posterUrl" type="url" placeholder="https://..." value={formData.posterUrl} onChange={handleInputChange} disabled={isSaving} />
              </div>

              <div className="edit-field full-width">
                <label>Sinopse</label>
                <textarea name="description" rows={4} value={formData.description} onChange={handleInputChange} disabled={isSaving} />
              </div>
            </div>

            <div className="edit-form-actions">
              <button type="button" className="action-btn cancel-edit-btn" onClick={onCancel} disabled={isSaving}>
                Cancelar
              </button>
              <Button type="submit" isLoading={isSaving}>
                <span className="save-btn-content"><Save size={18} /> Salvar Alterações</span>
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Modal isOpen={errorModal.isOpen} variant="error" title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ ...errorModal, isOpen: false })} />
    </>
  );
};