import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { movieService } from '../../api/services/movieService'; // Nosso serviço de API
import type { Movie } from '../../api/types/movie.types'; // Nossa interface

import './styles.css';

export const Catalog = () => {
  // Estados da tela
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // O useEffect com array vazio [] roda apenas UMA vez quando a tela abre
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const resposta = await movieService.getAll();
        
        console.log('Dados crus da API:', resposta);

        // Verifica os formatos mais comuns de resposta de backend
        if (Array.isArray(resposta)) {
          // Formato direto: [ {}, {} ]
          setMovies(resposta);
        } else if (resposta && Array.isArray((resposta as any).rows)) {
          // Padrão Sequelize (findAndCountAll): { count: X, rows: [ {}, {} ] }
          setMovies((resposta as any).rows);
        } else if (resposta && Array.isArray((resposta as any).data)) {
          // Padrão comum de APIs: { data: [ {}, {} ] }
          setMovies((resposta as any).data);
        } else {
          console.error(' O backend enviou um formato desconhecido:', resposta);
          setMovies([]); // Proteção para não quebrar a tela
          setError('Formato de dados inválido recebido do servidor.');
        }
      } catch (err) {
        console.error(' Erro ao buscar filmes:', err);
        setError('Não foi possível carregar o catálogo de filmes. Verifique se o backend está rodando.');
      } finally {
        // Independente de dar sucesso ou erro, para de mostrar "Carregando..."
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="catalog-page-container">
      <Header />
      
      <main className="catalog-main-content">
        <h1 className="catalog-title">Catálogo de Filmes</h1>

        {/* 1. Estado de Carregamento */}
        {isLoading && <p className="loading-text">Carregando filmes...</p>}

        {/* 2. Estado de Erro */}
        {error && <p className="error-text">{error}</p>}

        {/* 3. Estado Vazio (API funcionou, mas não tem filmes no banco) */}
        {!isLoading && !error && Array.isArray(movies) && movies.length === 0 && (
          <p className="empty-text">Nenhum filme encontrado. Adicione alguns no banco de dados!</p>
        )}

        {/* 4. Sucesso: Renderiza a lista de filmes (READ) */}
        {!isLoading && !error && movies.length > 0 && Array.isArray(movies) && (
          <div className="movies-grid">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card-simple">
                
                {/* Se o backend mandar uma URL de poster, mostra a imagem. Se não, mostra uma caixa cinza */}
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
        )}
      </main>

      <Footer />
    </div>
  );
};