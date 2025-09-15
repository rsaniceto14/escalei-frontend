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

export interface Area {
  id: string;
  name: string;
  description: string;
}

export interface Permission {
  user_id : number;
  create_scale : boolean;
  read_scale : boolean;
  update_scale : boolean;
  delete_scale : boolean;
  create_music : boolean;
  read_music : boolean;
  update_music : boolean;
  delete_music : boolean;
  create_role : boolean;
  read_role : boolean;
  update_role : boolean;
  delete_role : boolean;
  create_area : boolean;
  read_area : boolean;
  update_area : boolean;
  delete_area : boolean;
  create_chat : boolean;
  read_chat : boolean;
  update_chat : boolean;
  delete_chat : boolean;
  manage_users : boolean;
  manage_church_settings : boolean;
  manage_app_settings : boolean;
}
export interface LoginResponse {
  access_token: string;
  user: User;
  area: Array<Area>;
  permissions: Permission
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