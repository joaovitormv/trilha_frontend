import type { Movie, MoviePayload } from '../api/types/movie.types';
import type { FriendlyError } from '../api/utils/errorHandler';

export const MIN_RELEASE_YEAR = 1888;
export const MAX_RELEASE_YEAR = 2100;
export const MIN_RATING = 0;
export const MAX_RATING = 10;

// Estado dos formulários de filme (campos numéricos ficam como string enquanto o usuário digita)
export interface MovieFormData {
  title: string;
  description: string;
  genre: string;
  director: string;
  releaseYear: string;
  rating: string;
  posterUrl: string;
}

export const EMPTY_MOVIE_FORM: MovieFormData = {
  title: '',
  description: '',
  genre: '',
  director: '',
  releaseYear: '',
  rating: '',
  posterUrl: '',
};

// Converte um filme da API no estado do formulário (números viram string)
export const movieToFormData = (movie: Movie): MovieFormData => ({
  title: movie.title || '',
  description: movie.description || '',
  genre: movie.genre || '',
  director: movie.director || '',
  releaseYear: String(movie.releaseYear || ''),
  rating: String(movie.rating ?? ''),
  posterUrl: movie.posterUrl || '',
});

export type MovieValidationResult =
  | { ok: true; payload: MoviePayload }
  | { ok: false; error: FriendlyError };

const fail = (title: string, message: string): MovieValidationResult => ({
  ok: false,
  error: { title, message },
});

// Valida o formulário e, se estiver tudo certo, já devolve o payload pronto para a API.
export const validateMovie = (form: MovieFormData): MovieValidationResult => {
  if (
    !form.title.trim() ||
    !form.description.trim() ||
    !form.genre.trim() ||
    !form.director.trim() ||
    !form.releaseYear ||
    form.rating === ''
  ) {
    return fail('Campos Obrigatórios', 'Preencha todos os campos obrigatórios.');
  }

  const releaseYear = Number(form.releaseYear);
  const rating = Number(form.rating);

  if (isNaN(releaseYear) || releaseYear < MIN_RELEASE_YEAR || releaseYear > MAX_RELEASE_YEAR) {
    return fail(
      'Ano Inválido',
      `Informe um ano de lançamento válido (entre ${MIN_RELEASE_YEAR} e ${MAX_RELEASE_YEAR}).`,
    );
  }

  if (isNaN(rating) || rating < MIN_RATING || rating > MAX_RATING) {
    return fail('Avaliação Inválida', `A nota do filme deve estar entre ${MIN_RATING} e ${MAX_RATING}.`);
  }

  return {
    ok: true,
    payload: {
      title: form.title.trim(),
      description: form.description.trim(),
      genre: form.genre.trim(),
      director: form.director.trim(),
      releaseYear,
      rating,
      posterUrl: form.posterUrl.trim() || undefined,
    },
  };
};
