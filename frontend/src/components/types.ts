export interface Customer {
  id: number;
  first_name: string;   // ← was "name"
  last_name: string;    // ← added
  email: string;        // ← added
  phone?: string;       // ← added
  address?: string;
  created_at?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  created_at?: string;
}

export interface Order {
  id: number;
  customer: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: number;
  order: number;
  product: number;
  quantity: number;
  unit_price: number;
}

export type OrderPayload = {
  customer: number;
  status: Order["status"];
  notes?: string;
};