import type { Movie } from './movie.types';

export interface Favorite {
  id: number;
  userId: number;
  movieId: number;
  Movie?: Movie; // Opcional, pois ao listar os favoritos, o backend pode trazer os dados do filme junto
}