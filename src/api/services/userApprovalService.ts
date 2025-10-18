import { apiClient } from '../config';
import { ApiResponse } from '../types';

export interface PendingUser {
  id: number;
  name: string;
  email: string;
  birthday: string;
  status: 'WA' | 'I' | 'A' | 'B'; // WA = Waiting Approval, I = Inactive, A = Active, B = Rejected
  created_at: string;
  areas?: Array<{
    id: number;
    area_id: number;
    area: {
      id: number;
      name: string;
      description: string;
    };
  }>;
  roles?: Array<{
    id: number;
    name: string;
    description: string;
  }>;
}

export const userApprovalService = {
  async getPendingUsers(): Promise<ApiResponse<PendingUser[]>> {
    const response = await apiClient.get<ApiResponse<PendingUser[]>>('/users/pending');
    return response.data;
  },

  async approveUser(userId: number): Promise<ApiResponse<PendingUser>> {
    const response = await apiClient.post<ApiResponse<PendingUser>>(`/users/${userId}/approve`);
    return response.data;
  },

  async rejectUser(userId: number): Promise<ApiResponse<PendingUser>> {
    const response = await apiClient.post<ApiResponse<PendingUser>>(`/users/${userId}/reject`);
    return response.data;
  },
};
