import { axiosClient } from '../config/axiosClient';
import type { Movie, MoviePayload } from '../types/movie.types';

export type MovieSortBy = 'title' | 'releaseYear' | 'rating' | 'createdAt';
export type SortOrder = 'asc' | 'desc';


export const movieService = {
  // GET /api/movies (Não exige auth)
  getAll: async (params?: GetMoviesParams): Promise<GetMoviesResponse> => {
    const response = await axiosClient.get<GetMoviesResponse>('/api/movies', { params });
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
  },
  
};

export interface GetMoviesParams {
  search?: string;
  genre?: string;
  director?: string;
  releaseYear?: number;
  minRating?: number;
  page?: number;
  limit?: number;
  sortBy?: MovieSortBy;
  order?: SortOrder;
}

export interface GetMoviesResponse {
  success: boolean;
  data: Movie[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}