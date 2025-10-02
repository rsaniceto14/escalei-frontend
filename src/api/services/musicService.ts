import { apiClient } from '../config';
import { ApiResponse, CreateSongData, PaginatedResponse, Song, UpdateMusicRequest } from '../types';

export const musicService = {
  async getSongs(search?: string, page = 1, limit = 10): Promise<{data: Song[], last_page: number, current_page: number}> {
    const response = await apiClient.get<ApiResponse<{data: Song[], last_page: number, current_page: number}>>('/songs', {
      params: { search, page, limit }
    });
    return response.data.data;
  },

  async getSongById(id: number): Promise<Song> {
    const response = await apiClient.get<ApiResponse<Song>>(`/songs/${id}`);
    return response.data.data;
  },

  async createSong(songData: CreateSongData): Promise<Song> {
    const response = await apiClient.post<ApiResponse<Song>>('/songs', songData);
    return response.data.data;
  },

  async updateSong(id: number, songData: UpdateMusicRequest): Promise<Song> {
    const response = await apiClient.put<ApiResponse<Song>>(`/songs/${id}`, songData);
    return response.data.data;
  },

  async deleteSong(id: number): Promise<void> {
    await apiClient.delete(`/songs/${id}`);
  },

  async searchSongs(query: string, page = 1, limit = 10): Promise<{data: Song[], last_page: number, current_page: number}> {
    const response = await apiClient.get<ApiResponse<{data: Song[], last_page: number, current_page: number}>>('/songs', {
      params: { 
        search: query,
        page, 
        limit 
      }
    });
    return response.data.data;
  },

  async getSongsByArtist(artist: string, page = 1, limit = 10): Promise<{data: Song[], last_page: number, current_page: number}> {
    const response = await apiClient.get<ApiResponse<{data: Song[], last_page: number, current_page: number}>>('/songs', {
      params: { 
        artist,
        page, 
        limit 
      }
    });
    return response.data.data;
  }
};
