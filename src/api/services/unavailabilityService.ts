import { apiClient } from '../config';
import { ApiResponse, Unavailability } from '../types';

export const unavailabilityService = {
  /**
   * Busca todas as indisponibilidades do usuário autenticado
   */
  async getMyUnavailabilities(): Promise<Unavailability[]> {
    const response = await apiClient.get<ApiResponse<Unavailability[]>>('/unavailability/my');
    return response.data.data;
  },

  /**
   * Sincroniza as indisponibilidades do usuário autenticado
   * Remove todas as existentes e cria as novas
   */
  async syncUnavailabilities(unavailabilities: Omit<Unavailability, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]): Promise<Unavailability[]> {
    const response = await apiClient.post<ApiResponse<Unavailability[]>>('/unavailability/sync', {
      unavailabilities
    });
    return response.data.data;
  },

  /**
   * Cria uma nova indisponibilidade
   */
  async create(unavailability: Omit<Unavailability, 'id' | 'created_at' | 'updated_at'>): Promise<Unavailability> {
    const response = await apiClient.post<ApiResponse<Unavailability>>('/unavailability', unavailability);
    return response.data.data;
  },

  /**
   * Atualiza uma indisponibilidade existente
   */
  async update(id: number, unavailability: Partial<Omit<Unavailability, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Unavailability> {
    const response = await apiClient.put<ApiResponse<Unavailability>>(`/unavailability/${id}`, unavailability);
    return response.data.data;
  },

  /**
   * Deleta uma indisponibilidade
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/unavailability/${id}`);
  },

  /**
   * Busca todas as indisponibilidades (admin)
   */
  async getAll(): Promise<Unavailability[]> {
    const response = await apiClient.get<ApiResponse<Unavailability[]>>('/unavailability');
    return response.data.data;
  },

  /**
   * Busca uma indisponibilidade por ID
   */
  async getById(id: number): Promise<Unavailability> {
    const response = await apiClient.get<ApiResponse<Unavailability>>(`/unavailability/${id}`);
    return response.data.data;
  }
};

