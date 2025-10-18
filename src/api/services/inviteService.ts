import { ApiSuccessResponse } from "@/types/api";
import { API_BASE_URL, apiClient } from "../config";
import { ApiResponse } from "../types";

export interface Invite {
  id: number;
  email: string;
  church_id: number;
  token: string;
  used: boolean;
  expires_at: string;
  areas?: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
  roles?: Array<{
    id: number;
    name: string;
    description?: string;
    area_id?: number;
  }>;
  church?: {
    id: number;
    name: string;
  };
}

export const inviteService = {
  async sendInvite(data: {
    email: string;
    area_ids: number[];
    role_ids: number[];
  }): Promise<ApiSuccessResponse<void>> {
    const response = await apiClient.post<ApiSuccessResponse<void>>('/invites', data);
    return response.data;
  },
   
  async getInviteByToken(token: string): Promise<ApiResponse<Invite>> {
    const response = await apiClient.get<ApiResponse<Invite>>(`/invites/${token}`);
    return response.data;
  },

  async getAll(): Promise<ApiResponse<Invite[]>> {
    const response = await apiClient.get<ApiResponse<Invite[]>>('/invites');
    return response.data;
  },

  async deleteInvite(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/invites/${id}`);
    return response.data;
  },

  async resendInvite(id: number): Promise<ApiResponse<Invite>> {
    const response = await apiClient.post<ApiResponse<Invite>>(`/invites/${id}/resend`);
    return response.data;
  },
};
