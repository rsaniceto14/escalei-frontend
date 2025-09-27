import { apiClient } from '../config';
import { ApiResponse, AvailableUserSchedule, Schedule, UserScheduleUpdate, UserScheduleDetail } from '../types';

export const userScheduleService = {
  async getAllScales(): Promise<Schedule[]> {
    const response = await apiClient.get<ApiResponse<Schedule[]>>(`/user-schedules/show-all-schedules`);
    return response.data.data;
  },

  async getScheduleByScheduleId(id: string): Promise<Schedule> {
    const response = await apiClient.get<ApiResponse<Schedule>>(`/user-schedules/show-schedule-by-schedule-id/${id}`);
    return response.data.data;
  },

  async getAvailableUsers(): Promise<AvailableUserSchedule[]> {
    const response = await apiClient.get<ApiResponse<AvailableUserSchedule[]>>(`/user-schedules/show-available-users`);
    return response.data.data;
  },

  async updateStatus(schedule: UserScheduleUpdate): Promise<Schedule[]> {
    const response = await apiClient.patch<ApiResponse<Schedule[]>>(`/user-schedules/update-status/`, schedule);
    return response.data.data;
  },

  async getUsersByScheduleId(scheduleId: string): Promise<UserScheduleDetail[]> {
    const response = await apiClient.get<ApiResponse<UserScheduleDetail[]>>(
      `/user-schedules/show-users-by-schedule-id/${scheduleId}`,
    );
    return response.data.data;
  },

  async addUserToSchedule(scheduleId: string, userId: string, areaId: string): Promise<void> {
    await apiClient.post(`/user-schedules/add-user-in-schedule`, {
      schedule_id: scheduleId,
      user_id: userId,
      area_id: areaId,
    });
  },

  async removeUserFromSchedule(scheduleId: string, userId: string): Promise<void> {
    await apiClient.delete(`/user-schedules/remove-user-from-schedule`, {
      data: {
        schedule_id: scheduleId,
        user_id: userId,
      },
    });
  },
};
