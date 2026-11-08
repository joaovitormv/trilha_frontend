import { useCallback, useEffect, useState } from 'react';
import { movieService } from '../api/services/movieService';
import type { Movie } from '../api/types/movie.types';
import { getFriendlyApiError, type FriendlyError } from '../api/utils/errorHandler';

interface MovieResult {
  id: string; // id (da rota) a que o resultado pertence
  movie: Movie | null;
  error: FriendlyError | null;
}

// Busca um filme pelo id da rota e cuida de loading/erro. Refaz a busca quando o id muda.
export const useMovie = (id: string | undefined) => {
  const [result, setResult] = useState<MovieResult | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const loadMovie = async () => {
      try {
        const movie = await movieService.getById(Number(id));
        if (!cancelled) setResult({ id, movie, error: null });
      } catch (err) {
        if (!cancelled) setResult({ id, movie: null, error: getFriendlyApiError(err) });
      }
    };

    loadMovie();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Atualiza o filme localmente (ex.: depois de editar) sem nova requisição
  const setMovie = useCallback((movie: Movie) => {
    setResult((prev) => (prev ? { ...prev, movie } : prev));
  }, []);

  const isCurrent = result !== null && result.id === id;

  return {
    movie: isCurrent ? result.movie : null,
    isLoading: Boolean(id) && !isCurrent,
    error: isCurrent ? result.error : null,
    setMovie,
  };
};
