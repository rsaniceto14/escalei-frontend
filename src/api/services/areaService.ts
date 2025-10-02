import { apiClient } from '../config';
import { Area, ApiResponse } from '../types';

export const areaService = {
  async getAll(): Promise<Area[]> {
    try {
      const response = await apiClient.get<ApiResponse<Area[]>>('/areas');
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

  async create(data: { name: string; description?: string }): Promise<Area> {
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
};
