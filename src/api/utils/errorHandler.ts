// src/api/utils/errorHandler.ts
import axios from 'axios';

export interface FriendlyError {
  title: string;
  message: string;
}

export const getFriendlyApiError = (error: unknown): FriendlyError => {
  if (axios.isAxiosError(error)) {
    // 1. Falha de conexão (Backend desligado, CORS ou sem internet)
    if (!error.response || error.code === 'ERR_NETWORK') {
      return {
        title: 'Erro de Conexão',
        message: 'Não foi possível conectar ao servidor. Verifique se o back-end está rodando e tente novamente.'
      };
    }

    // 2. Tempo limite esgotado
    if (error.code === 'ECONNABORTED') {
      return {
        title: 'Tempo Esgotado',
        message: 'O servidor demorou muito para responder. Tente novamente em instantes.'
      };
    }

    const status = error.response.status;
    const backendMessage = error.response.data?.message;

    // 3. Tratamento por código HTTP
    switch (status) {
      case 400:
        return {
          title: 'Dados Inválidos',
          message: backendMessage || 'Verifique os campos preenchidos e tente novamente.'
        };
      case 401:
        return {
          title: 'Acesso Negado',
          message: backendMessage || 'E-mail ou senha incorretos, ou sua sessão expirou.'
        };
      case 403:
        return {
          title: 'Sem Permissão',
          message: backendMessage || 'Você não tem permissão para realizar esta ação.'
        };
      case 404:
        return {
          title: 'Não Encontrado',
          message: backendMessage || 'O recurso solicitado não foi encontrado no servidor.'
        };
      case 409:
        return {
          title: 'Conflito de Dados',
          message: backendMessage || 'Este registro já está em uso.'
        };
      default:
        return {
          title: 'Erro no Servidor',
          message: backendMessage || 'Ocorreu uma falha interna no servidor. Tente novamente mais tarde.'
        };
    }
  }

  return {
    title: 'Erro Inesperado',
    message: 'Ocorreu um erro desconhecido na aplicação.'
  };
};