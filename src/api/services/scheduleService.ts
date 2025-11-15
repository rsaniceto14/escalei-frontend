import { apiClient } from '../config';
import { ApiResponse, Schedule, CreateScheduleRequest, UpdateScheduleRequest } from '../types';

export const scheduleService = {
  /**
   * Buscar todas as escalas
   */
  async getAll(): Promise<Schedule[]> {
    try {
      const response = await apiClient.get<ApiResponse<Schedule[]>>('/schedules');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Buscar escala por ID
   */
  async getById(id: number): Promise<Schedule> {
    try {
      const response = await apiClient.get<ApiResponse<Schedule>>(`/schedules/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Criar nova escala
   */
  async create(data: CreateScheduleRequest): Promise<Schedule> {
    try {
      const response = await apiClient.post<ApiResponse<Schedule>>('/schedules', data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualizar escala existente
   */
  async update(id: number, data: UpdateScheduleRequest): Promise<Schedule> {
    try {
      const response = await apiClient.put<ApiResponse<Schedule>>(`/schedules/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deletar escala
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/schedules/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Gerar escala automática
   */
  async generate(
    scheduleId: number,
    data: {
      user_id: number;
      areas: number[];
      roles: Array<{ role_id: number; area_id: number; count: number }>;
    }
  ): Promise<{
    schedule: Schedule;
    statistics: Array<{
      role_id: number;
      area_id: number;
      requested: number;
      selected: number;
      fulfilled: boolean;
    }>;
  }> {
    try {
      const response = await apiClient.post<ApiResponse<{
        schedule_id: number;
        selected_users: Array<{ id: number; name: string; email: string }>;
        statistics: Array<{
          role_id: number;
          area_id: number;
          requested: number;
          selected: number;
          fulfilled: boolean;
        }>;
      }>>(
        `/schedules/${scheduleId}/generate`,
        data
      );
      
      // Buscar a escala atualizada
      const schedule = await this.getById(scheduleId);
      
      return {
        schedule,
        statistics: response.data.data.statistics || []
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Publicar escala
   */
  async publish(scheduleId: number, userId: number): Promise<Schedule> {
    try {
      const response = await apiClient.post<ApiResponse<Schedule>>(
        `/schedules/${scheduleId}/publish`,
        { user_id: userId }
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
