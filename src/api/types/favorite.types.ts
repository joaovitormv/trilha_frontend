import type { Movie } from './movie.types';

export interface Favorite {
  id: number;
  userId: number;
  movieId: number;
  Movie?: Movie; 
}