export type HandoutStatus = 'A' | 'P' | 'I';
export type HandoutPriority = 'high' | 'normal';

export interface Handout {
  id: number;
  church_id: number;
  title: string;
  description: string;
  start_date?: string;
  end_date?: string;
  priority: HandoutPriority;
  status: HandoutStatus;
  link_name?: string;
  link_url?: string;
  image_url?: string;
  image?: any;
  created_at?: string;
  updated_at?: string;
  activate?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
