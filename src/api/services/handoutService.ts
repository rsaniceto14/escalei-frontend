import { Church } from 'lucide-react';
import { apiClient } from '../config';
import { ApiResponse, Handout } from '../handout';

export const handoutService = {
  async getAll(): Promise<Handout[]> {
    const response = await apiClient.get<ApiResponse<Handout[]>>('/handouts');
    return response.data.data;
  },

  async getActive(): Promise<Handout[]> {
    const response = await apiClient.get<ApiResponse<Handout[]>>('/handouts/active');
    return response.data.data;
  },

  async create(data: any): Promise<Handout> {
    const response = await apiClient.post<ApiResponse<Handout>>('/handouts', data, {
        headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data.data;
  },

  async update(id: number, data: Partial<Handout>): Promise<Handout> {
    const response = await apiClient.put<ApiResponse<Handout>>(`/handouts/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/handouts/${id}`);
  },
};
