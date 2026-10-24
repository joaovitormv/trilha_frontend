import axios from 'axios';

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
    const token = localStorage.getItem('@CineComp:token');
    
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
    // Propaga o erro para o componente poder tratar 
    return Promise.reject(error);
  }
);