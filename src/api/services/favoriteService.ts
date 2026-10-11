// src/api/services/favoriteService.ts
import { axiosClient } from '../config/axiosClient';
import type { Favorite } from '../types/favorite.types';

export const favoriteService = {
  // GET /api/favorites (Retorna a lista de favoritos do usuário logado)
  getAll: async (): Promise<Favorite[]> => {
    const response = await axiosClient.get<Favorite[]>('/api/favorites');
    return response.data;
  },

  // POST /api/favorites/:movieId (Adiciona um filme aos favoritos)
  add: async (movieId: number): Promise<Favorite> => {
    const response = await axiosClient.post<Favorite>(`/api/favorites/${movieId}`);
    return response.data;
  },

  // DELETE /api/favorites/:movieId (Remove um filme dos favoritos)
  remove: async (movieId: number): Promise<void> => {
    await axiosClient.delete(`/api/favorites/${movieId}`);
  }
};