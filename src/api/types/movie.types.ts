export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  director: string;
  releaseYear: number;
  rating: number;
  posterUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MoviePayload {
  title: string;
  description: string;
  genre: string;
  director: string;
  releaseYear: number;
  rating: number;
  posterUrl?: string;
}