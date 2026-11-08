import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import type { MoviePayload } from '../../api/types/movie.types';
import type { FriendlyError } from '../../api/utils/errorHandler';
import { GENRE_OPTIONS } from '../../constants/genres';
import {
  EMPTY_MOVIE_FORM,
  MAX_RATING,
  MAX_RELEASE_YEAR,
  MIN_RATING,
  MIN_RELEASE_YEAR,
  validateMovie,
  type MovieFormData,
} from '../../utils/validateMovie';

export type MovieFormVariant = 'create' | 'edit';

// Cada tela tem seu próprio CSS/rótulos; o formulário é o mesmo.
interface VariantConfig {
  formClassName: string;
  fieldClassName: string;
  fullWidthFieldClassName: string;
  labels: Record<keyof MovieFormData, string>;
  placeholders: Partial<Record<keyof MovieFormData, string>>;
  genrePlaceholder: string;
}

const VARIANTS: Record<MovieFormVariant, VariantConfig> = {
  create: {
    formClassName: 'create-movie-layout',
    fieldClassName: 'form-field',
    fullWidthFieldClassName: 'form-field',
    labels: {
      title: 'Título do Filme *',
      releaseYear: 'Ano de Lançamento *',
      rating: 'Avaliação (0 a 10) *',
      genre: 'Gênero *',
      director: 'Direção *',
      posterUrl: 'URL do Pôster (Opcional)',
      description: 'Sinopse *',
    },
    placeholders: {
      title: 'Ex: Interstellar',
      releaseYear: 'Ex: 2014',
      rating: 'Ex: 8.7',
      director: 'Ex: Christopher Nolan',
      posterUrl: 'https://exemplo.com/poster.jpg',
      description: 'Escreva a sinopse do filme...',
    },
    genrePlaceholder: 'Selecione um gênero...',
  },
  edit: {
    formClassName: 'details-edit-form',
    fieldClassName: 'edit-field',
    fullWidthFieldClassName: 'edit-field full-width',
    labels: {
      title: 'Título',
      releaseYear: 'Ano de Lançamento',
      rating: 'Avaliação (0 a 10)',
      genre: 'Gênero',
      director: 'Diretor',
      posterUrl: 'URL do Pôster',
      description: 'Sinopse',
    },
    placeholders: { posterUrl: 'https://...' },
    genrePlaceholder: 'Selecione...',
  },
};

interface MovieFormProps {
  variant: MovieFormVariant;
  initialValues?: MovieFormData;
  isSubmitting: boolean;
  // Chamado só com dados já validados e prontos para a API
  onSubmit: (payload: MoviePayload) => void | Promise<void>;
  onInvalid: (error: FriendlyError) => void;
  // Permite à tela manter a pré-visualização do pôster
  onPosterUrlChange?: (url: string) => void;
  header?: ReactNode; // variant 'edit': título + botão de fechar
  aside?: ReactNode; // variant 'create': coluna do pôster
  actions: ReactNode; // botões (cancelar / salvar)
}

export const MovieForm = ({
  variant,
  initialValues = EMPTY_MOVIE_FORM,
  isSubmitting,
  onSubmit,
  onInvalid,
  onPosterUrlChange,
  header,
  aside,
  actions,
}: MovieFormProps) => {
  const [formData, setFormData] = useState<MovieFormData>(initialValues);
  const config = VARIANTS[variant];
  const { labels, placeholders } = config;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'posterUrl') onPosterUrlChange?.(value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const validation = validateMovie(formData);
    if (!validation.ok) {
      onInvalid(validation.error);
      return;
    }

    void onSubmit(validation.payload);
  };

  const common = { onChange: handleChange, disabled: isSubmitting };

  const field = (name: keyof MovieFormData, control: ReactNode, fullWidth = false) => (
    <div className={fullWidth ? config.fullWidthFieldClassName : config.fieldClassName}>
      <label htmlFor={name}>{labels[name]}</label>
      {control}
    </div>
  );

  const titleField = field(
    'title',
    <input id="title" name="title" type="text" placeholder={placeholders.title} value={formData.title} {...common} />,
    true,
  );

  const yearField = field(
    'releaseYear',
    <input
      id="releaseYear"
      name="releaseYear"
      type="number"
      placeholder={placeholders.releaseYear}
      min={MIN_RELEASE_YEAR}
      max={MAX_RELEASE_YEAR}
      value={formData.releaseYear}
      {...common}
    />,
  );

  const ratingField = field(
    'rating',
    <input
      id="rating"
      name="rating"
      type="number"
      step="0.1"
      min={MIN_RATING}
      max={MAX_RATING}
      placeholder={placeholders.rating}
      value={formData.rating}
      {...common}
    />,
  );

  const genreField = field(
    'genre',
    <select id="genre" name="genre" value={formData.genre} {...common}>
      <option value="">{config.genrePlaceholder}</option>
      {GENRE_OPTIONS.map((g) => (
        <option key={g.value} value={g.value}>
          {g.label}
        </option>
      ))}
    </select>,
  );

  const directorField = field(
    'director',
    <input id="director" name="director" type="text" placeholder={placeholders.director} value={formData.director} {...common} />,
  );

  const posterField = field(
    'posterUrl',
    <input id="posterUrl" name="posterUrl" type="url" placeholder={placeholders.posterUrl} value={formData.posterUrl} {...common} />,
    true,
  );

  const descriptionField = field(
    'description',
    <textarea
      id="description"
      name="description"
      rows={4}
      placeholder={placeholders.description}
      value={formData.description}
      {...common}
    />,
    true,
  );

  // Mesma ordem de campos nas duas telas; só o agrupamento no DOM muda.
  if (variant === 'create') {
    return (
      <form onSubmit={handleSubmit} className={config.formClassName}>
        <div className="create-form-column">
          {titleField}
          <div className="form-row-two">
            {yearField}
            {ratingField}
          </div>
          <div className="form-row-two">
            {genreField}
            {directorField}
          </div>
          {posterField}
          {descriptionField}
          {actions}
        </div>
        {aside}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={config.formClassName}>
      {header}
      <div className="edit-grid">
        {titleField}
        {genreField}
        {directorField}
        {yearField}
        {ratingField}
        {posterField}
        {descriptionField}
      </div>
      {actions}
    </form>
  );
};
