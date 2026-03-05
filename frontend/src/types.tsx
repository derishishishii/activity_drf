// src/types.ts
export interface Customer {
  id: number;
  name: string;
  age: number;
  address: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerFormData {
  name: string;
  age: number | "";
  address: string;
}

export interface ApiError {
  message: string;
  status?: number;
}