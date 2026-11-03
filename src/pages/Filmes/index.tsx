import React, { useEffect, useState } from 'react';
import { movieService } from '../../api/services/movieService';
import type { Movie } from '../../api/types/movie.types';
import { Pagination } from '../../components/Pagination';
import { getFriendlyApiError, type FriendlyError } from '../../api/utils/errorHandler';
import { Modal } from '../../components/Modal';

import './styles.css';

export const Catalog = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Estado adaptado para o novo errorHandler
  const [apiError, setApiError] = useState<FriendlyError | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10; 

  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMovies = movies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const resposta = await movieService.getAll();
        
        if (Array.isArray(resposta)) {
          setMovies(resposta);
        } else if (resposta && Array.isArray((resposta as any).rows)) {
          setMovies((resposta as any).rows);
        } else if (resposta && Array.isArray((resposta as any).data)) {
          setMovies((resposta as any).data);
        } else {
          setMovies([]); 
          setApiError({ title: 'Erro de Formato', message: 'Formato de dados inválido recebido do servidor.' });
        }
      } catch (err) {
        // Envia o erro para o tradutor global
        setApiError(getFriendlyApiError(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <main className="catalog-main-content">
      <h1 className="catalog-title">Catálogo de Filmes</h1>

      {isLoading && <p className="loading-text">A carregar filmes...</p>}
      
      {!isLoading && !apiError && Array.isArray(movies) && movies.length === 0 && (
        <p className="empty-text">Nenhum filme encontrado no sistema.</p>
      )}

      {!isLoading && Array.isArray(movies) && movies.length > 0 && (
        <>
          <div className="movies-grid">
            {currentMovies.map((movie) => (
              <div key={movie.id} className="movie-card-simple">
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
                ) : (
                  <div className="no-poster">Sem Pôster</div>
                )}
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-year">{movie.releaseYear}</p>
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

      {/* Renderiza o popup de erro se algo falhar */}
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