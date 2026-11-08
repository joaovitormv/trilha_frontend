import { axiosClient } from '../config/axiosClient';
import type { User, UpdateProfilePayload } from '../types/user.types';

interface UserApiResponse {
  success?: boolean;
  message?: string;
  data?: User;
  user?: User;
}

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await axiosClient.get<UserApiResponse | User>('/api/users/me');
    const resData = response.data;

    if (resData && typeof resData === 'object') {
      if ('data' in resData && resData.data) return resData.data;
      if ('user' in resData && resData.user) return resData.user;
    }
    return resData as User;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
    const response = await axiosClient.put<UserApiResponse | User>('/api/users/me', payload);
    const resData = response.data;

    if (resData && typeof resData === 'object') {
      if ('data' in resData && resData.data) return resData.data;
      if ('user' in resData && resData.user) return resData.user;
    }
    return resData as User;
  },

 //Nota: não há rota de Delete no backend
};