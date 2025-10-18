import { apiClient } from '../config';
import { ApiResponse, ChatWithMessages } from '../types';

export interface SendMessageRequest {
  content: string;
  chat_id: number;
  user_id: number;
  sent_at: string;
  file?: File;
}

export const chatService = {
  async getChatsForUser(user_id: number, areas): Promise<any> {
    const response = await apiClient.post<ApiResponse<ChatWithMessages>>("/chats/user/", {user_id, areas});
    return response.data.data;
  },

  async getChatById(chat_id :number): Promise<any> {
    const response = await apiClient.get<ApiResponse<ChatWithMessages>>(`/chats/${chat_id}`);
    return response.data.data;
  },

  async sendMessage(data: SendMessageRequest): Promise<any> {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('chat_id', String(data.chat_id));
    formData.append('user_id', String(data.user_id));
    formData.append('sent_at', data.sent_at);
    
    if (data.file) {
      formData.append('file', data.file);
    }

    const response = await apiClient.post<ApiResponse<any>>("/message", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }
};
