import { apiClient } from '../config';
import { ApiResponse, RegisterChurch } from '../types';

export const churchService = {
  async getChurchesForRegister(): Promise<any> {
    const response = await apiClient.get<ApiResponse<RegisterChurch[]>>('v1/church/to-register');
    return response.data;
  }
};