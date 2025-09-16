import { apiClient } from '../config';
import { LoginRequest, LoginResponse, User, ApiResponse } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<any> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>('/v1/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/v1/auth/forgot-password', { email });
  },

  async resetPassword(token: string, email: string, password: string, confpass: string): Promise<any> {
    const response = await apiClient.post<ApiResponse<void>>('/v1/auth/reset-password', { token, email, password, password_confirmation: confpass });
    return response.data;
  },

  async refreshToken(): Promise<any> {
    const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data.data.token;
  },

  async register(formData: { name: string; email: string; password: string; password_confirmation: string; church_id: string; birthday: string; }): Promise<any> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/v1/auth/register', formData);
    return response.data;
  },

  async registerChurch(formData: any): Promise<any> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/v1/auth/register-church', formData);
    return response.data;
  },
};