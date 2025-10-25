export interface User {
  id: string;
  name: string;
  email: string;
  photo_path?: string;
  photo_url?: string; // Signed URL for immediate use
  birthday?: string;
  status: string;
  church_id: string;
  church?: {
    id: string;
    name: string;
  };
  areas?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

export enum UserScheduleStatus {
  Confirmed = 'Confirmado',
  Swap_requested = 'Troca Solicitada',
}

export enum UserScheduleType {
  Louvor = 'Louvor',
  Geral = 'Geral',
}

export interface Schedule {
  id?: number;
  name: string;
  description: string;
  local: string;
  start_date: string;
  end_date: string;
  observation?: string;
  type: ScheduleType;
  approved?: boolean;
  user_creator: number;
  created_at?: string;
  updated_at?: string;
  // Campos dinâmicos adicionados pelo backend quando busca com relacionamento de UserSchedule
  status?: UserScheduleStatus | null;
  minhaEscala?: boolean;
}

export interface CreateScheduleRequest {
  name: string;
  description: string;
  local: string;
  start_date: string;
  end_date: string;
  observation?: string;
  type: ScheduleType;
  approved?: boolean;
  user_creator: number;
}

export interface UpdateScheduleRequest {
  name?: string;
  description?: string;
  local?: string;
  start_date?: string;
  end_date?: string;
  observation?: string;
  type?: ScheduleType;
  approved?: boolean;
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

export interface Role {
  id: number;
  name: string;
  description?: string;
  area_id?: number;
  created_at?: string;
  updated_at?: string;
}


export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photo_path?: string;
  photo_url?: string; // Signed URL for immediate use
  birthday?: string;
  status: string;
  church?: {
    id: string;
    name: string;
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    quarter?: string;
    city?: string;
    state?: string;
  };
  areas: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  permissions: {
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
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  preview_url?: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface Song {
  id: number;
  name: string;
  artist: string;
  album?: string;
  spotify_url?: string;
  preview_url?: string;
  duration: number;
  cover_path?: string;
  spotify_id?: string;
  key?: string;
  tempo?: number;
  lyrics?: string;
  chords?: string;
  youtube_url?: string;
  church_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSongData {
  name: string;
  artist: string;
  album?: string;
  spotify_url?: string;
  preview_url?: string;
  duration: number;
  cover_path?: string;
  spotify_id?: string;
  key?: string;
  tempo?: number;
  lyrics?: string;
  chords?: string;
  youtube_url?: string;
}

export interface UpdateMusicRequest {
  name?: string;
  artist?: string;
  album?: string;
  spotify_url?: string;
  preview_url?: string;
  duration?: number;
  cover_path?: string;
  spotify_id?: string;
  key?: string;
  tempo?: number;
  lyrics?: string;
  chords?: string;
  youtube_url?: string;
}