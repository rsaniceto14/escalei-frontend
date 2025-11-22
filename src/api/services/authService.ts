import { apiClient } from '../config';
import { LoginRequest, LoginResponse, User, ApiResponse } from '../types';
import { pushNotificationService } from '@/services/pushNotificationService';

export const authService = {
  async login(credentials: LoginRequest & { fcm_token?: string }): Promise<any> {
    try {
      // Obter FCM token se disponível
      const fcmToken = pushNotificationService.getToken() || localStorage.getItem('pending_fcm_token');
      
      // Incluir FCM token se disponível
      const loginData = {
        ...credentials,
        ...(fcmToken && { fcm_token: fcmToken }),
      };

      const response = await apiClient.post<ApiResponse<LoginResponse>>('/v1/auth/login', loginData);
      
      // Após login bem-sucedido, tentar enviar token pendente se existir
      const pendingToken = localStorage.getItem('pending_fcm_token');
      if (pendingToken) {
        try {
          await pushNotificationService.sendTokenToBackend(pendingToken);
        } catch (error) {
          console.error('Error sending pending FCM token:', error);
        }
      }
      
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
    await apiClient.post<ApiResponse<void>>('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, email: string, password: string, confpass: string): Promise<any> {
    const response = await apiClient.post<ApiResponse<void>>('/auth/reset-password', { token, email, password, password_confirmation: confpass });
    return response.data;
  },

  async refreshToken(): Promise<any> {
    const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data.data.token;
  },

  async register(formData: { name: string; email: string; password: string; password_confirmation: string; church_id: string; birthday: string; token?: string }): Promise<any> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/register', formData);
    return response.data;
  },

  async registerChurch(formData: any): Promise<any> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/v1/auth/register-church', formData);
    return response.data;
  },

  /**
   * Atualiza o FCM token do usuário
   */
  async updateFcmToken(fcmToken: string): Promise<void> {
    try {
      await apiClient.post<ApiResponse<void>>('/v1/users/fcm-token', {
        fcm_token: fcmToken,
      });
    } catch (error) {
      throw error;
    }
  },
};