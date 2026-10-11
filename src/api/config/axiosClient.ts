import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  //Timeout de 10 segundos para cancelar requisições travadas
  timeout: 10000, 
});

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