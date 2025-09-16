import { toast } from '@/hooks/use-toast';
import axios from 'axios';

// Change this URL to your API endpoint
export const API_BASE_URL = 'http://localhost:8000/api'; //This only works for web
// export const API_BASE_URL = 'http://192.168.164.18:8000/api'; //This only works for Mobile

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    toast({
        title: "Erro",
        description: error.response.data.message,
        variant: "destructive",
      });
    return Promise.reject(error.response.data);
  }
);