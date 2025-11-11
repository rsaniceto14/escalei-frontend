import { apiClient } from '../config';
import { ApiResponse, UserRole } from '../types';

export const userRoleService = {
  async getUserRoles(userId: string): Promise<UserRole[]> {
    try {
      const response = await apiClient.get<ApiResponse<UserRole[]>>(`/users/${userId}/roles`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async attachRole(userId: string, roleId: number, priority?: number): Promise<void> {
    try {
      await apiClient.post(`/users/${userId}/roles`, {
        role_id: roleId,
        priority: priority,
      });
    } catch (error) {
      throw error;
    }
  },

  async detachRole(userId: string, roleId: number): Promise<void> {
    try {
      await apiClient.delete(`/users/${userId}/roles/${roleId}`);
    } catch (error) {
      throw error;
    }
  },

  async updatePriority(userId: string, roleId: number, priority: number): Promise<void> {
    try {
      await apiClient.put(`/users/${userId}/roles/${roleId}/priority`, {
        priority: priority,
      });
    } catch (error) {
      throw error;
    }
  },
};


