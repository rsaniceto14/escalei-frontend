import { apiClient } from '../config';
import { ApiResponse } from '../types';

export interface Unavailability {
  id?: number;
  user_id: number;
  weekday: number; // 0-6 (0=domingo, 6=sábado)
  shift: 'manha' | 'tarde' | 'noite';
  created_at?: string;
  updated_at?: string;
}

export const unavailabilityService = {
  // Busca indisponibilidades do usuário autenticado
  async getMyUnavailabilities(): Promise<Unavailability[]> {
    const response = await apiClient.get<ApiResponse<Unavailability[]>>('/unavailability/my');
    return response.data.data;
  },

  // Sincroniza todas as indisponibilidades do usuário
  async syncUnavailabilities(unavailabilities: Omit<Unavailability, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]): Promise<Unavailability[]> {
    const response = await apiClient.post<ApiResponse<Unavailability[]>>('/unavailability/sync', {
      unavailabilities
    });
    return response.data.data;
  }
};

