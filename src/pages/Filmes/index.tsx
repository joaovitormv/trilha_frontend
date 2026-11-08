import { useState } from 'react';
import { Star, Plus } from 'lucide-react';
import { PosterImage } from '../../components/PosterImage';
import type { GetMoviesParams } from '../../api/services/movieService';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { MovieCardSkeleton } from '../../components/Skeleton';
import { FilterBar, INITIAL_FILTERS, type FilterState } from '../../components/FilterBar';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import {Button} from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { useMovies } from '../../hooks/useMovies';

const ITEMS_PER_PAGE = 10;
const FILTER_DEBOUNCE_MS = 300;

const buildParams = (page: number, filters: FilterState): GetMoviesParams => {
  const params: GetMoviesParams = {
    page,
    limit: ITEMS_PER_PAGE,
    sortBy: filters.sortBy,
    order: filters.order,
  };

  if (filters.search.trim()) params.search = filters.search.trim();
  if (filters.genre.length > 0) params.genre = filters.genre.join(',');
  if (filters.director.trim()) params.director = filters.director.trim();
  if (filters.releaseYear) params.releaseYear = Number(filters.releaseYear);
  if (filters.minRating) params.minRating = Number(filters.minRating);

  return params;
};

export const Catalog = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // O esqueleto aparece assim que página/filtro mudam; a requisição sai após o debounce
  const { movies, pagination, isLoading, error: apiError, clearError } = useMovies(
    buildParams(currentPage, filters),
    FILTER_DEBOUNCE_MS,
  );
  const totalPages = pagination?.totalPages || 1;

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

      <div className="catalog-header-row">
        <h1 className="catalog-title" style={{ margin: 0 }}>Catálogo de Filmes</h1>
        
        {isAuthenticated && (
          <Button onClick={() => navigate('/filmes/novo')} style={{ width: 'auto', padding: '10px 20px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} />
              Adicionar Filme
            </span>
          </Button>
        )}
      </div>


      {/* Se estiver carregando, mostra o esqueleto */}
      {isLoading ? (
        <div className="movies-grid">
          <MovieCardSkeleton count={ITEMS_PER_PAGE} />
        </div>
      ) : !apiError && movies.length === 0 ? (
        <p className="empty-text">Nenhum filme encontrado para os filtros selecionados.</p>
      ) : !apiError && movies.length > 0 ? (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="movie-card-simple"
              onClick={() => navigate(`/filmes/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <PosterImage
                src={movie.posterUrl}
                alt={movie.title}
                className="movie-poster"
                fallback={<div className="no-poster">Sem Pôster</div>}
              />
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-year">
                {movie.releaseYear} • <Star size={13} color="#f5c518" fill="#f5c518" /> {movie.rating}
              </p>
              <p className="movie-genre">{movie.genre}</p>
            </div>
          ))}
        </div>
      ) : null}

      {/* A paginação fica solta aqui embaixo para não sumir da tela durante o loading */}
      {!apiError && totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <Modal
        isOpen={Boolean(apiError)}
        variant="error"
        title={apiError?.title || ''}
        message={apiError?.message || ''}
        onClose={clearError}
      />
    </main>
  );
};