import { apiClient } from '../config';
import { Scale, ApiResponse, PaginatedResponse } from '../types';

export const scaleService = {
  async getMyScales(status?: string): Promise<Scale[]> {
    const params = status ? { status } : {};
    const response = await apiClient.get<ApiResponse<Scale[]>>('/scales/my-scales', { params });
    return response.data.data;
  },

  async getConfirmedScales(): Promise<Scale[]> {
    return this.getMyScales('Confirmada');
  },

  async getPendingScales(): Promise<Scale[]> {
    return this.getMyScales('Pendente');
  },

  async getAllScales(page = 1, limit = 10): Promise<PaginatedResponse<Scale>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Scale>>>('/scales', {
      params: { page, limit }
    });
    return response.data.data;
  },

  async getScaleById(id: string): Promise<Scale> {
    const response = await apiClient.get<ApiResponse<Scale>>(`/scales/${id}`);
    return response.data.data;
  },

  async createScale(scale: Omit<Scale, 'id' | 'createdAt' | 'updatedAt'>): Promise<Scale> {
    const response = await apiClient.post<ApiResponse<Scale>>('/scales', scale);
    return response.data.data;
  },

  async updateScale(id: string, scale: Partial<Scale>): Promise<Scale> {
    const response = await apiClient.put<ApiResponse<Scale>>(`/scales/${id}`, scale);
    return response.data.data;
  },

  async deleteScale(id: string): Promise<void> {
    await apiClient.delete(`/scales/${id}`);
  },

  async confirmParticipation(scaleId: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`/scales/${scaleId}/confirm`);
  },

  async rejectParticipation(scaleId: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`/scales/${scaleId}/reject`);
  },

  async assignUserToScale(scaleId: string, userId: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`/scales/${scaleId}/assign`, { userId });
  }
};