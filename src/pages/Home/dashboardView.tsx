import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { movieService } from '../../api/services/movieService';
import type { Movie } from '../../api/types/movie.types';
import type { User } from '../../api/types/user.types';
import { PosterSkeleton } from '../../components/Skeleton';
import { Modal } from '../../components/Modal';
import { getFriendlyApiError, type FriendlyError } from '../../api/utils/errorHandler';

export const DashboardView = ({ user }: { user: User | null }) => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<FriendlyError | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const resposta = await movieService.getAll();
        setMovies(Array.isArray(resposta) ? resposta : resposta.data || resposta.rows || []);
      } catch (err) {
        setApiError(getFriendlyApiError(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Pega os últimos 5 filmes adicionados (do mais recente para o mais antigo)
  const latestMovies = [...movies].slice(-5).reverse();

  return (
    <div className="dashboard-container">
      <div className="dashboard-top">
        <h2 className="welcome-user">
          Seja bem-vindo, {user?.name || 'usuário'}
        </h2>
        <div className="dashboard-actions">
          <Button onClick={() => navigate('/filmes/novo')}>
            Adicionar Filme
          </Button>
          <p className="total-movies-text">
            Total de filmes adicionados: {movies.length}
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
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt={movie.title} className="latest-movie-poster" />
                ) : (
                  <div className="latest-no-poster">{movie.title}</div>
                )}
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
        onClose={() => setApiError(null)}
      />
    </div>
  );
};