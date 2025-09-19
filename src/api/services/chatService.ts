import { apiClient } from '../config';
import { ApiResponse, ChatWithMessages, RegisterChurch } from '../types';

export const chatService = {
  async getChatsForUser(user_id: number, areas): Promise<any> {
    const response = await apiClient.post<ApiResponse<ChatWithMessages>>("/chats/user/", {user_id, areas});
    return response.data.data;
  }
};