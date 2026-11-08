import type { MoviePayload } from '../api/types/movie.types';
import type { FriendlyError } from '../api/utils/errorHandler';

export const MIN_RELEASE_YEAR = 1888;
export const MAX_RELEASE_YEAR = 2100;
const MIN_RATING = 0;
const MAX_RATING = 10;

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
