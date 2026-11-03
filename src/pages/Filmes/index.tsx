import React, { useEffect, useState, useCallback } from 'react';
import { Star } from 'lucide-react';
import { movieService, type GetMoviesParams } from '../../api/services/movieService';
import type { Movie } from '../../api/types/movie.types';
import { Pagination } from '../../components/Pagination';
import { getFriendlyApiError, type FriendlyError } from '../../api/utils/errorHandler';
import { Modal } from '../../components/Modal';
import { MovieCardSkeleton } from '../../components/Skeleton';
import { FilterBar, INITIAL_FILTERS, type FilterState } from '../../components/FilterBar';
import './styles.css';

export const Catalog = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<FriendlyError | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const fetchMovies = useCallback(async (page: number, activeFilters: FilterState) => {
    try {
      setIsLoading(true);
      setApiError(null);

      const params: GetMoviesParams = {
        page,
        limit: ITEMS_PER_PAGE,
        sortBy: activeFilters.sortBy,
        order: activeFilters.order,
      };

      if (activeFilters.search.trim()) params.search = activeFilters.search.trim();
      
      if (activeFilters.genre.length > 0) params.genre = activeFilters.genre.join(',');
      
      if (activeFilters.director.trim()) params.director = activeFilters.director.trim();
      if (activeFilters.releaseYear) params.releaseYear = Number(activeFilters.releaseYear);
      if (activeFilters.minRating) params.minRating = Number(activeFilters.minRating);

      const response = await movieService.getAll(params);

      if (response && Array.isArray(response.data)) {
        setMovies(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setMovies([]);
        setTotalPages(1);
      }
    } catch (err) {
      setApiError(getFriendlyApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies(currentPage, filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, filters, fetchMovies]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  return (
    <main className="catalog-main-content">
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <h1 className="catalog-title">Catálogo de Filmes</h1>

      {isLoading && (
        <div className="movies-grid">
          <MovieCardSkeleton count={ITEMS_PER_PAGE} />
        </div>
      )}

      {!isLoading && !apiError && movies.length === 0 && (
        <p className="empty-text">Nenhum filme encontrado para os filtros selecionados.</p>
      )}

      {!isLoading && !apiError && movies.length > 0 && (
        <>
          <div className="movies-grid">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card-simple">
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
                ) : (
                  <div className="no-poster">Sem Pôster</div>
                )}
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-year">
                  {movie.releaseYear} • <Star size={13} color="#f5c518" fill="#f5c518" /> {movie.rating}
                </p>
                <p className="movie-genre">{movie.genre}</p>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <Modal
        isOpen={Boolean(apiError)}
        variant="error"
        title={apiError?.title || ''}
        message={apiError?.message || ''}
        onClose={() => setApiError(null)}
      />
    </main>
  );
};