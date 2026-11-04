import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartOff, Star, Trash2 } from 'lucide-react';
import { favoriteService } from '../../api/services/favoriteService';
import type { Movie } from '../../api/types/movie.types';
import { getFriendlyApiError, type FriendlyError } from '../../api/utils/errorHandler';
import { MovieCardSkeleton } from '../../components/Skeleton';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import './styles.css';

export const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [apiError, setApiError] = useState<FriendlyError | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const data = await favoriteService.getAll();
        setFavorites(data);
      } catch (err) {
        setApiError(getFriendlyApiError(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (e: React.MouseEvent, movieId: number) => {
    // Impede que o clique no botão de remover abra a tela de detalhes do filme
    e.stopPropagation();

    try {
      setRemovingId(movieId);
      await favoriteService.remove(movieId);
      setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
    } catch (err) {
      setApiError(getFriendlyApiError(err));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <main className="favorites-main-content">
      <div className="favorites-header">
        <h1 className="favorites-title">Meus Filmes Favoritos</h1>
        {!isLoading && favorites.length > 0 && (
          <span className="favorites-count">
            {favorites.length} {favorites.length === 1 ? 'filme salvo' : 'filmes salvos'}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="movies-grid">
          <MovieCardSkeleton count={5} />
        </div>
      ) : !apiError && favorites.length === 0 ? (
        <div className="favorites-empty-box">
          <HeartOff size={48} color="#555555" />
          <h2>Sua lista de favoritos está vazia</h2>
          <p>Explore o catálogo e adicione seus filmes preferidos para acessá-los rapidamente aqui.</p>
          <Button onClick={() => navigate('/filmes')}>Explorar Catálogo</Button>
        </div>
      ) : (
        <div className="movies-grid">
          {favorites.map((movie) => (
            <div
              key={movie.id}
              className="movie-card-simple favorite-card-wrapper"
              onClick={() => navigate(`/filmes/${movie.id}`)}
            >
              <button
                type="button"
                className="remove-fav-badge"
                onClick={(e) => handleRemoveFavorite(e, movie.id)}
                disabled={removingId === movie.id}
                title="Remover dos favoritos"
              >
                <Trash2 size={16} />
              </button>

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