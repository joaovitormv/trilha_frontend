// src/api/services/movieService.ts
import { axiosClient } from '../config/axiosClient';
import type { Movie, MoviePayload } from '../types/movie.types';

export type MovieSortBy = 'title' | 'releaseYear' | 'rating' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

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

interface SingleMovieResponse {
  success: boolean;
  message?: string;
  data: Movie;
}

export const movieService = {
  getAll: async (params?: GetMoviesParams): Promise<GetMoviesResponse> => {
    const response = await axiosClient.get<GetMoviesResponse>('/api/movies', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Movie> => {
    const response = await axiosClient.get<SingleMovieResponse | Movie>(`/api/movies/${id}`);
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data as Movie;
  },

  create: async (payload: MoviePayload): Promise<Movie> => {
    const response = await axiosClient.post<SingleMovieResponse | Movie>('/api/movies', payload);
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data as Movie;
  },

  update: async (id: number, payload: MoviePayload): Promise<Movie> => {
    const response = await axiosClient.put<SingleMovieResponse | Movie>(`/api/movies/${id}`, payload);
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data as Movie;
  },

  remove: async (id: number): Promise<void> => {
    await axiosClient.delete(`/api/movies/${id}`);
  },
};