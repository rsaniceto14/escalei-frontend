export interface User {
  id: string;
  name: string;
  email: string;
  photo_path: string;
  birthday?: string;
  status: string;
  church_id: string;
}

export enum UserScheduleStatus {
  Confirmed = 'Confirmado',
  Swap_requested = 'Troca Solicitada',
}

export enum UserScheduleType {
  Louvor = 'Louvor',
  Geral = 'Geral',
}

export interface UserScheduleUpdate {
  schedule_id: number;
  status: UserScheduleStatus;
}

export interface Schedule {
  id: number;
  name: string;
  description: string;
  local: string;
  start_date: string;
  end_date: string;
  observation: string | null;
  type: UserScheduleType;
  status: UserScheduleStatus;
  minhaEscala: boolean;
  created_at: string;
}

export interface AvailableUserSchedule {
  id: number;
  name: string;
  email: string;
  photo_path: string | null;
  birthday: string | null;
  areas: [{ id: string; name: string }];
}

export interface UserScheduleDetail {
  id: number;
  name: string;
  email: string;
  photo_path: string | null;
  birthday: string | null;
  statusSchedule: UserScheduleStatus | null;
  area: string;
}

export interface Availability {
  id?: string;
  userId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface ExceptionDate {
  id?: string;
  userId: string;
  date: string;
  reason?: string;
  isAvailable: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Area {
  id: string;
  name: string;
  description: string;
}

export interface Permission {
  user_id: number;
  create_scale: boolean;
  read_scale: boolean;
  update_scale: boolean;
  delete_scale: boolean;
  create_music: boolean;
  read_music: boolean;
  update_music: boolean;
  delete_music: boolean;
  create_role: boolean;
  read_role: boolean;
  update_role: boolean;
  delete_role: boolean;
  create_area: boolean;
  read_area: boolean;
  update_area: boolean;
  delete_area: boolean;
  create_chat: boolean;
  read_chat: boolean;
  update_chat: boolean;
  delete_chat: boolean;
  manage_users: boolean;
  manage_church_settings: boolean;
  manage_app_settings: boolean;
}
export interface LoginResponse {
  access_token: string;
  user: User;
  area: Array<Area>;
  permissions: Permission;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RegisterChurch {
  name: string;
  id: number;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  churchId: string;
  birthday: string;
}

export interface Chat {
  id: string;
  name: string;
  chatable_type: string;
  description: string;
}

export interface Message {
  content: string;
  image_path: string;
  sent_at: string;
  user_name: string;
}

export interface ChatWithMessages {
  chat: Chat;
  messages: Array<Message>;
}
