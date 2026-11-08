import { useCallback, useEffect, useState } from 'react';
import {
  movieService,
  type GetMoviesParams,
  type GetMoviesResponse,
} from '../api/services/movieService';
import type { Movie } from '../api/types/movie.types';
import { getFriendlyApiError, type FriendlyError } from '../api/utils/errorHandler';

type Pagination = GetMoviesResponse['pagination'];

interface MoviesResult {
  key: string; // parâmetros usados na busca; identifica a qual consulta o resultado pertence
  movies: Movie[];
  pagination: Pagination | null;
  error: FriendlyError | null;
}

// Busca a lista de filmes e cuida de loading/erro. Refaz a busca quando os parâmetros mudam.
// `debounceMs` atrasa a requisição (útil para filtros de texto); `isLoading` fica true desde a mudança.
export const useMovies = (params: GetMoviesParams = {}, debounceMs = 0) => {
  // Os parâmetros são só valores primitivos, então a serialização serve de chave estável de dependência.
  const key = JSON.stringify(params);
  const [result, setResult] = useState<MoviesResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchMovies = async () => {
      try {
        const response = await movieService.getAll(JSON.parse(key) as GetMoviesParams);
        if (cancelled) return;

        setResult({
          key,
          movies: Array.isArray(response?.data) ? response.data : [],
          pagination: response?.pagination ?? null,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;

        // Em caso de erro, mantém a última lista/paginação conhecidas
        setResult((prev) => ({
          key,
          movies: prev?.movies ?? [],
          pagination: prev?.pagination ?? null,
          error: getFriendlyApiError(err),
        }));
      }
    };

    const timer = setTimeout(fetchMovies, debounceMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [key, debounceMs]);

  const clearError = useCallback(() => {
    setResult((prev) => (prev ? { ...prev, error: null } : prev));
  }, []);

  const isCurrent = result?.key === key;

  return {
    movies: result?.movies ?? [],
    pagination: result?.pagination ?? null,
    isLoading: !isCurrent,
    error: isCurrent ? result.error : null,
    clearError,
  };
};
