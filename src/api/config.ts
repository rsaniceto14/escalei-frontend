import { toast } from '@/hooks/use-toast';
import axios from 'axios';

// Change this URL to your API endpoint
// export const API_BASE_URL = 'http://localhost:8000/api/v1'; //This only works for web
// export const API_BASE_URL = 'http://192.168.164.18:8000/api/v1'; //This only works for Mobile
// export const API_BASE_URL = 'https://e-church-backend.onrender.com/api/v1'; //To prod ;)
export const API_BASE_URL = 'https://accused-orca-startup-4-our-ef8e7c14.koyeb.app/api/v1'; //To prod ;)

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 200000,
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
    if (error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      window.location.href = '/login';
      toast({
          title: "Sessão expirada",
          description: "Por favor, faça login novamente.",
          variant: "destructive",
        });
      return;
    }

    toast({
        title: error.response.data.error.code,
        description: error.response.data.error.message,
        variant: "destructive",
      });
    return Promise.reject(error.response.data.error);
  }
);