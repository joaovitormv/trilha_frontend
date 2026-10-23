// src/pages/Catalog/index.tsx
import React, { useEffect, useState } from 'react';
import { movieService } from '../../api/services/movieService';
import type { Movie } from '../../api/types/movie.types';
import { Pagination } from '../../components/Pagination'; // Importação do nosso novo componente

import './styles.css';

export const Catalog = () => {
  // Estados de dados e carregamento
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de Paginação
  const [currentPage, setCurrentPage] = useState<number>(1);
  

  const ITEMS_PER_PAGE = 10; 

  // Cálculos para fatiar a lista de filmes exibida na tela atual
  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMovies = movies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const resposta = await movieService.getAll();
        
        // Verifica o formato dos dados que chegam da API
        if (Array.isArray(resposta)) {
          setMovies(resposta);
        } else if (resposta && Array.isArray((resposta as any).rows)) {
          setMovies((resposta as any).rows);
        } else if (resposta && Array.isArray((resposta as any).data)) {
          setMovies((resposta as any).data);
        } else {
          console.error('Formato desconhecido:', resposta);
          setMovies([]); 
          setError('Formato de dados inválido recebido do servidor.');
        }
      } catch (err) {
        console.error('Erro ao buscar filmes:', err);
        setError('Não foi possível carregar o catálogo de filmes. Verifique se o backend está rodando.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    // O <main> é injetado diretamente no Outlet do BaseLayout
    <main className="catalog-main-content">
      <h1 className="catalog-title">Catálogo de Filmes</h1>

      {isLoading && <p className="loading-text">Carregando filmes...</p>}
      
      {error && <p className="error-text">{error}</p>}

      {!isLoading && !error && Array.isArray(movies) && movies.length === 0 && (
        <p className="empty-text">Nenhum filme encontrado. Adicione alguns no banco de dados!</p>
      )}

      {/* Renderiza o catálogo e a paginação em caso de sucesso */}
      {!isLoading && !error && Array.isArray(movies) && movies.length > 0 && (
        <>
          <div className="movies-grid">
            {/* O map agora roda apenas nos filmes fatiados da página atual (currentMovies) */}
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

          {/* O componente de paginação assume a renderização dos botões */}
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </>
      )}
    </main>
  );
};