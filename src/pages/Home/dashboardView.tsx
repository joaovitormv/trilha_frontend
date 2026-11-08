import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import type { GetMoviesParams } from '../../api/services/movieService';
import type { User } from '../../api/types/user.types';
import { PosterSkeleton } from '../../components/Skeleton';
import { Modal } from '../../components/Modal';
import { PosterImage } from '../../components/PosterImage';
import { useMovies } from '../../hooks/useMovies';
import fundoFilme from '../../assets/fundo-filme.png';

// A API já devolve só os 5 mais recentes; o total vem da paginação (não do tamanho da página)
const LATEST_MOVIES_PARAMS: GetMoviesParams = { limit: 5, sortBy: 'createdAt', order: 'desc' };

export const DashboardView = ({ user }: { user: User | null }) => {
  const navigate = useNavigate();
  const { movies: latestMovies, pagination, isLoading, error: apiError, clearError } =
    useMovies(LATEST_MOVIES_PARAMS);
  const totalMovies = pagination?.total ?? 0;

  return (
    <div 
      className="dashboard-container"
      style={{ backgroundImage: `url(${fundoFilme})` }}
    >
      <div className="dashboard-top">
        <h2 className="welcome-user">
          Seja bem-vindo, {user?.name || 'usuário'}
        </h2>
        <div className="dashboard-actions">
          <Button onClick={() => navigate('/filmes/novo')}>
            Adicionar Filme
          </Button>
          <p className="total-movies-text">
            Total de filmes adicionados: {totalMovies}
          </p>
        </div>
      </div>

      <div className="dashboard-bottom">
        <h3 className="latest-movies-title">Últimos filmes adicionados:</h3>
        
        {isLoading ? (
          <div className="latest-movies-grid">
            <PosterSkeleton count={5} />
          </div>
        ) : latestMovies.length === 0 ? (
          <p className="dashboard-status">Nenhum filme cadastrado ainda.</p>
        ) : (
          <div className="latest-movies-grid">
            {latestMovies.map((movie) => (
              <div 
                key={movie.id}
                className="latest-movie-card"
                onClick={() => navigate(`/filmes/${movie.id}`)}
                title={movie.title}
              >
                <PosterImage
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="latest-movie-poster"
                  fallback={<div className="latest-no-poster">{movie.title}</div>}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(apiError)}
        variant="error"
        title={apiError?.title || ''}
        message={apiError?.message || ''}
        onClose={clearError}
      />
    </div>
  );
};