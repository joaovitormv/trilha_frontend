import axios from 'axios';
import { getStoredToken, notifyUnauthorized } from './session';

const BASE_URL = import.meta.env.VITE_API_URL;

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  (config) => {
    // Busca o token salvo no armazenamento do navegador
    const token = getStoredToken();
    
    // Se achou o token, anexa no cabeçalho de Autorização
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Interceptor de Resposta: Trata erros globais antes de chegarem ao componente
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
       console.error(`Erro da API [${error.response.status}]:`, error.response.data);
    } else if (error.request) {
       console.error('Servidor não respondeu. Verifique sua conexão ou se o backend está rodando.');
    }

    // 401 em uma requisição que enviou token = sessão expirada/inválida.
    // Requisições sem token (ex.: login com senha errada) não entram aqui,
    // para o erro "credenciais inválidas" continuar chegando na tela de Login.
    // A checagem do token salvo evita disparar o logout várias vezes quando
    // várias requisições falham com 401 ao mesmo tempo.
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.headers?.Authorization &&
      getStoredToken()
    ) {
      notifyUnauthorized();
    }

    // Propaga o erro para o componente poder tratar 
    return Promise.reject(error);
  }
);
