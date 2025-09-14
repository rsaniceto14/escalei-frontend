export interface User {
  id: string;
  name: string;
  email: string;
  photo_path: string;
  birthday?: string;
  status: string;
  church_id: string;
}

export interface Scale {
  id?: string;
  nome: string;
  data: string;
  horario: string;
  local: string;
  tipo: string;
  status: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface LoginResponse {
  access_token: string;
  user: User;
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