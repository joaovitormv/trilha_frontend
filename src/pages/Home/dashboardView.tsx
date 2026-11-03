import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { movieService } from '../../api/services/movieService';
import type { Movie } from '../../api/types/movie.types';
import type { User } from '../../api/types/user.types';

export const DashboardView = ({ user }: { user: User | null }) => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const resposta = await movieService.getAll();
        setMovies(Array.isArray(resposta) ? resposta : resposta.data || resposta.rows || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const latestMovies = [...movies].slice(-5).reverse();

  return (
    <div className="dashboard-container">
      <div className="dashboard-top">
        <h2 className="welcome-user">Seja bem vindo, {user?.name || 'usuário'}</h2>
        <div className="dashboard-actions">
          <Button onClick={() => navigate('/filmes/novo')}>Adicionar Filme</Button>
          <p className="total-movies-text">Total de filmes adicionados: {movies.length}</p>
        </div>
      </div>

      <div className="dashboard-bottom">
        <h3 className="latest-movies-title">Últimos filmes adicionados:</h3>
        {isLoading ? <p className="dashboard-status">Carregando...</p> : (
          <div className="latest-movies-grid">
            {latestMovies.map((movie) => (
              <div key={movie.id} className="latest-movie-card" onClick={() => navigate('/filmes')}>
                {movie.posterUrl ? <img src={movie.posterUrl} className="latest-movie-poster" /> : <div className="latest-no-poster">{movie.title}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};