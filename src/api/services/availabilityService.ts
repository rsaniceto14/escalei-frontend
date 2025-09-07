import { apiClient } from '../config';
import { Availability, ExceptionDate, ApiResponse } from '../types';

export const availabilityService = {
  async getWeeklyAvailability(): Promise<Availability[]> {
    const response = await apiClient.get<ApiResponse<Availability[]>>('/availability/weekly');
    return response.data.data;
  },

  async updateWeeklyAvailability(availability: Availability[]): Promise<Availability[]> {
    const response = await apiClient.put<ApiResponse<Availability[]>>('/availability/weekly', {
      availability
    });
    return response.data.data;
  },

  async getExceptionDates(): Promise<ExceptionDate[]> {
    const response = await apiClient.get<ApiResponse<ExceptionDate[]>>('/availability/exceptions');
    return response.data.data;
  },

  async addExceptionDate(exception: Omit<ExceptionDate, 'id' | 'userId'>): Promise<ExceptionDate> {
    const response = await apiClient.post<ApiResponse<ExceptionDate>>('/availability/exceptions', exception);
    return response.data.data;
  },

  async updateExceptionDate(id: string, exception: Partial<ExceptionDate>): Promise<ExceptionDate> {
    const response = await apiClient.put<ApiResponse<ExceptionDate>>(`/availability/exceptions/${id}`, exception);
    return response.data.data;
  },

  async deleteExceptionDate(id: string): Promise<void> {
    await apiClient.delete(`/availability/exceptions/${id}`);
  },

  async getUserAvailability(userId: string, date?: string): Promise<{
    weeklyAvailability: Availability[];
    exceptions: ExceptionDate[];
  }> {
    const params = date ? { date } : {};
    const response = await apiClient.get<ApiResponse<{
      weeklyAvailability: Availability[];
      exceptions: ExceptionDate[];
    }>>(`/availability/user/${userId}`, { params });
    return response.data.data;
  }
};