export type FieldType = 'text' | 'email' | 'password' | 'tel' | 'number';

export interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  required?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface DonorUser {
  id: string;
  name: string;
  email: string;
  bloodType?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  bloodType?: string;
}
