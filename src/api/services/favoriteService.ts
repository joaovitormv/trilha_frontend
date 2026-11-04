import { axiosClient } from '../config/axiosClient';
import type { Movie } from '../types/movie.types';

export interface GetFavoritesResponse {
  success: boolean;
  data: Movie[];
}

export const favoriteService = {
  getAll: async (): Promise<Movie[]> => {
    const response = await axiosClient.get<GetFavoritesResponse>('/api/favorites');
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  },

  add: async (movieId: number): Promise<void> => {
    await axiosClient.post(`/api/favorites/${movieId}`);
  },

  remove: async (movieId: number): Promise<void> => {
    await axiosClient.delete(`/api/favorites/${movieId}`);
  },
};