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
};
