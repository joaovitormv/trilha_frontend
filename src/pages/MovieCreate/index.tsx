import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';
import { movieService } from '../../api/services/movieService';
import type { MoviePayload } from '../../api/types/movie.types';
import { getFriendlyApiError } from '../../api/utils/errorHandler';
import { Button } from '../../components/Button';
import { Modal, type ModalVariant } from '../../components/Modal';
import './styles.css';

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

export const CreateMovie = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [createdMovieId, setCreatedMovieId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    releaseYear: '',
    rating: '',
    genre: '',
    director: '',
    posterUrl: '',
    description: '',
  });

  const [modal, setModal] = useState<{
    isOpen: boolean;
    variant: ModalVariant;
    title: string;
    message: string;
  }>({
    isOpen: false,
    variant: 'error',
    title: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'posterUrl') {
      setImageLoadError(false);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.releaseYear ||
      formData.rating === '' ||
      !formData.genre ||
      !formData.director.trim() ||
      !formData.description.trim()
    ) {
      setModal({
        isOpen: true,
        variant: 'error',
        title: 'Campos Obrigatórios',
        message: 'Preencha todos os campos obrigatórios para cadastrar o filme.',
      });
      return;
    }

    const parsedYear = Number(formData.releaseYear);
    const parsedRating = Number(formData.rating);

    if (isNaN(parsedYear) || parsedYear < 1888 || parsedYear > 2100) {
      setModal({
        isOpen: true,
        variant: 'error',
        title: 'Ano Inválido',
        message: 'Informe um ano de lançamento válido (entre 1888 e 2100).',
      });
      return;
    }

    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 10) {
      setModal({
        isOpen: true,
        variant: 'error',
        title: 'Avaliação Inválida',
        message: 'A nota do filme deve estar entre 0 e 10.',
      });
      return;
    }

    const payload: MoviePayload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      genre: formData.genre,
      director: formData.director.trim(),
      releaseYear: parsedYear,
      rating: parsedRating,
      posterUrl: formData.posterUrl.trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      const created = await movieService.create(payload);
      setCreatedMovieId(created?.id || null);

      setModal({
        isOpen: true,
        variant: 'success',
        title: 'Filme Adicionado!',
        message: `"${payload.title}" foi cadastrado no catálogo com sucesso.`,
      });
    } catch (err) {
      const apiError = getFriendlyApiError(err);
      setModal({
        isOpen: true,
        variant: 'error',
        title: apiError.title,
        message: apiError.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
    if (modal.variant === 'success') {
      navigate(createdMovieId ? `/filmes/${createdMovieId}` : '/filmes');
    }
  };

  const hasPosterUrl = formData.posterUrl.trim().length > 0;

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

          <form onSubmit={handleSubmit} className="create-movie-layout">
            {/* Coluna Esquerda: Campos do Formulário */}
            <div className="create-form-column">
              <div className="form-field">
                <label htmlFor="title">Título do Filme *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Ex: Interstellar"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-row-two">
                <div className="form-field">
                  <label htmlFor="releaseYear">Ano de Lançamento *</label>
                  <input
                    id="releaseYear"
                    name="releaseYear"
                    type="number"
                    placeholder="Ex: 2014"
                    min="1888"
                    max="2100"
                    value={formData.releaseYear}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="rating">Avaliação (0 a 10) *</label>
                  <input
                    id="rating"
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="Ex: 8.7"
                    value={formData.rating}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-row-two">
                <div className="form-field">
                  <label htmlFor="genre">Gênero *</label>
                  <select
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    <option value="">Selecione um gênero...</option>
                    {GENRE_OPTIONS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="director">Direção *</label>
                  <input
                    id="director"
                    name="director"
                    type="text"
                    placeholder="Ex: Christopher Nolan"
                    value={formData.director}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="posterUrl">URL do Pôster (Opcional)</label>
                <input
                  id="posterUrl"
                  name="posterUrl"
                  type="url"
                  placeholder="https://exemplo.com/poster.jpg"
                  value={formData.posterUrl}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-field">
                <label htmlFor="description">Sinopse *</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Escreva a sinopse do filme..."
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

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
            </div>

            {/* Coluna Direita: Pré-visualização do Pôster */}
            <div className="create-poster-column">
              <div className="poster-preview-box">
                {hasPosterUrl && !imageLoadError ? (
                  <img
                    src={formData.posterUrl}
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
          </form>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        variant={modal.variant}
        title={modal.title}
        message={modal.message}
        onClose={handleCloseModal}
      />
    </main>
  );
};