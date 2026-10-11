import { axiosClient } from '../config/axiosClient';
import type { Movie, MoviePayload } from '../types/movie.types';

export const movieService = {
  // GET /api/movies (Não exige auth)
  getAll: async (): Promise<Movie[]> => {
    const response = await axiosClient.get<Movie[]>('/api/movies');
    return response.data;
  },

  // GET /api/movies/:id (Não exige auth)
  getById: async (id: number): Promise<Movie> => {
    const response = await axiosClient.get<Movie>(`/api/movies/${id}`);
    return response.data;
  },

  // POST /api/movies (Exige auth - Token será configurado depois)
  create: async (data: MoviePayload): Promise<Movie> => {
    const response = await axiosClient.post<Movie>('/api/movies', data);
    return response.data;
  },

  // PUT /api/movies/:id (Exige auth)
  update: async (id: number, data: Partial<MoviePayload>): Promise<Movie> => {
    const response = await axiosClient.put<Movie>(`/api/movies/${id}`, data);
    return response.data;
  },

  // DELETE /api/movies/:id (Exige auth)
  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/api/movies/${id}`);
  }
};