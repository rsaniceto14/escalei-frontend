import { apiClient } from '../config';
import { LoginRequest, LoginResponse, User, ApiResponse } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<any> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/v1/auth/login', credentials);
    return response.data;
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
    await apiClient.post<ApiResponse<void>>('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/auth/reset-password', { token, newPassword });
  },

  async verifyCode(code: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/auth/verify-code', { code });
  },

  async refreshToken(): Promise<string> {
    const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data.data.token;
  }
};