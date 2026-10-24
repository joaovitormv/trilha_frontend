import { axiosClient } from '../config/axiosClient';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth.types';

export const authService = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  }
};