import { apiClient } from '../config';
import { Area, ApiResponse, Role } from '../types';

export interface AreaWithRoles {
  id: number;
  name: string;
  description: string;
  roles: Array<{
    id: number;
    name: string;
    description: string;
  }>;
}

export const areaService = {
  async getAll(): Promise<Area[]> {
    try {
      const response = await apiClient.get<ApiResponse<Area[]>>('/areas');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async getAreasWithRoles(): Promise<AreaWithRoles[]> {
    try {
      const response = await apiClient.get<ApiResponse<AreaWithRoles[]>>('/areas-with-roles');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async getMyAreasWithRoles(): Promise<AreaWithRoles[]> {
    try {
      const response = await apiClient.get<ApiResponse<AreaWithRoles[]>>('/my-areas-with-roles');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async getById(id: number): Promise<Area> {
    try {
      const response = await apiClient.get<ApiResponse<Area>>(`/areas/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async create(data: { name: string; description?: string; roles?: Array<{ name: string; description?: string }> }): Promise<Area> {
    try {
      const response = await apiClient.post<ApiResponse<Area>>('/areas', data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async update(id: number, data: { name?: string; description?: string }): Promise<Area> {
    try {
      const response = await apiClient.put<ApiResponse<Area>>(`/areas/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/areas/${id}`);
    } catch (error) {
      throw error;
    }
  },

  async getUsers(areaId: number): Promise<any[]> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>(`/areas/${areaId}/users`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async switchUserArea(areaId: number, userId: number, newAreaId: number): Promise<void> {
    try {
      await apiClient.put(`/areas/${areaId}/users/${userId}/switch`, {
        new_area_id: newAreaId
      });
    } catch (error) {
      throw error;
    }
  },

  async getRoles(areaId: number): Promise<Role[]> {
    try {
      const response = await apiClient.get<ApiResponse<Role[]>>(`/areas/${areaId}/roles`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async updateRoles(areaId: number, roles: Array<{ id?: number; name: string; description?: string }>): Promise<void> {
    try {
      await apiClient.put(`/areas/${areaId}/roles`, { roles });
    } catch (error) {
      throw error;
    }
  },
};
