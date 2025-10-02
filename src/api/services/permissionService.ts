import { apiClient } from '../config';
import { ApiResponse } from '../types';

export interface PermissionUpdate {
  user_id: number;
  create_scale?: boolean;
  read_scale?: boolean;
  update_scale?: boolean;
  delete_scale?: boolean;
  create_music?: boolean;
  read_music?: boolean;
  update_music?: boolean;
  delete_music?: boolean;
  create_role?: boolean;
  read_role?: boolean;
  update_role?: boolean;
  delete_role?: boolean;
  create_area?: boolean;
  read_area?: boolean;
  update_area?: boolean;
  delete_area?: boolean;
  create_chat?: boolean;
  read_chat?: boolean;
  update_chat?: boolean;
  delete_chat?: boolean;
  manage_users?: boolean;
  manage_church_settings?: boolean;
  manage_app_settings?: boolean;
}

export const permissionService = {
  async updateUserPermissions(userId: number, permissions: Partial<PermissionUpdate>): Promise<any> {
    const response = await apiClient.put<ApiResponse<any>>(`/permission/user/${userId}`, permissions);
    return response.data.data;
  },

  async getUserPermissions(userId: number): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(`/permission/${userId}`);
    return response.data.data;
  }
};
