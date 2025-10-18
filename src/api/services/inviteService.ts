import { ApiSuccessResponse } from "@/types/api";
import { API_BASE_URL, apiClient } from "../config";
import { ApiResponse } from "../types";

export interface Invite {
  id: number;
  email: string;
  name: string;
  church_id: number;
  area_id: number;
  area_name?: string;
  role_ids?: number[];
  role_names?: string[];
  token: string;
  expires_at?: string;
}

export const inviteService = {
  async sendInvite(data: {
    email: string;
    name: string;
    area_id: number;
    role_id?: number;
    role_ids?: number[];
    message?: string;
  }): Promise<ApiSuccessResponse<void>> {
    const response = await apiClient.post<ApiSuccessResponse<void>>('/invites', data);

    return response.data;
  },

  async getInviteByToken(token: string): Promise<Invite> {
    const response = await fetch(`${API_BASE_URL}/invites/${token}`);
    const json = await response.json();
    return json;
  },
};
