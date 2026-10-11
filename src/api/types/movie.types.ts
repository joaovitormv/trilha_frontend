export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  director: string;
  releaseYear: number;
  rating: number;
  posterUrl?: string; // Opcional, pois no Sequelize está allowNull: true
}

export type MoviePayload = Omit<Movie, 'id'>;