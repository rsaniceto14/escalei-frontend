import { apiClient } from "../config";
import { Role, ApiResponse } from "../types";

export const roleService = {
  async getAll(): Promise<Role[]> {
    try {
      const response = await apiClient.get<ApiResponse<Role[]>>("/roles");
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async getById(id: number): Promise<Role> {
    try {
      const response = await apiClient.get<ApiResponse<Role>>(`/roles/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async create(data: { name: string; description?: string; area_id?: number }): Promise<Role> {
    try {
      const response = await apiClient.post<ApiResponse<Role>>("/roles", data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async update(id: number, data: { name?: string; description?: string; area_id?: number }): Promise<Role> {
    try {
      const response = await apiClient.put<ApiResponse<Role>>(`/roles/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/roles/${id}`);
    } catch (error) {
      throw error;
    }
  },
};
