import { apiClient } from '../config';
import { User, ApiResponse, PaginatedResponse } from '../types';

export const userService = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/users/profile');
    return response.data.data;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>('/users/profile', userData);
    return response.data.data;
  },

  async getAllUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>('/users', {
      params: { page, limit }
    });
    return response.data.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>('/users', userData);
    return response.data.data;
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/users/change-password', {
      currentPassword,
      newPassword
    });
  }
};