import { apiClient } from '../config';
import { ApiResponse } from '../types';

export interface ChangeUserPhotoResponse {
  success: boolean;
  message: string;
  data: {
    file_path: string;
    photo_url: string; // Signed URL
    user_updated: boolean;
  } | null;
}

export const storageService = {
  async changeUserPhoto(file: File, userId: string): Promise<ChangeUserPhotoResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    const response = await apiClient.post<ApiResponse<ChangeUserPhotoResponse>>('/storage/change-user-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },
};
