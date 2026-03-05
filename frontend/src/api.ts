// src/api.ts
import type { Customer, Product, Order, OrderItem } from './components/types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Payload type for creating/updating orders
export type OrderPayload = {
  customer: number;
  status: Order["status"];
  notes?: string;
};

// Helper function to handle responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
};

// ── Customers ───────────────────────────────────
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/`);
    return handleResponse<Customer[]>(response);
  } catch (error) {
    console.error('Error in getCustomers:', error);
    throw error;
  }
};

export const getCustomer = async (id: number): Promise<Customer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}/`);
    return handleResponse<Customer>(response);
  } catch (error) {
    console.error(`Error in getCustomer ${id}:`, error);
    throw error;
  }
};

export const createCustomer = async (customer: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    return handleResponse<Customer>(response);
  } catch (error) {
    console.error('Error in createCustomer:', error);
    throw error;
  }
};

export const updateCustomer = async (id: number, customer: Omit<Partial<Customer>, 'created_at'>): Promise<Customer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    return handleResponse<Customer>(response);
  } catch (error) {
    console.error(`Error in updateCustomer ${id}:`, error);
    throw error;
  }
};

export const patchCustomer = async (id: number, customer: Partial<Customer>): Promise<Customer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    return handleResponse<Customer>(response);
  } catch (error) {
    console.error(`Error in patchCustomer ${id}:`, error);
    throw error;
  }
};

export const deleteCustomer = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error in deleteCustomer ${id}:`, error);
    throw error;
  }
};

// ── Products ────────────────────────────────────
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/`);
    return handleResponse<Product[]>(response);
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
};

export const createProduct = async (data: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(response);
  } catch (error) {
    console.error('Error in createProduct:', error);
    throw error;
  }
};

export const updateProduct = async (id: number, data: Partial<Product>): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(response);
  } catch (error) {
    console.error(`Error in updateProduct ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error in deleteProduct ${id}:`, error);
    throw error;
  }
};

// ── Orders ──────────────────────────────────────
export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/`);
    return handleResponse<Order[]>(response);
  } catch (error) {
    console.error('Error in getOrders:', error);
    throw error;
  }
};

export const createOrder = async (data: OrderPayload): Promise<Order> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Order>(response);
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

export const updateOrder = async (id: number, data: Partial<OrderPayload>): Promise<Order> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Order>(response);
  } catch (error) {
    console.error(`Error in updateOrder ${id}:`, error);
    throw error;
  }
};

export const deleteOrder = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error in deleteOrder ${id}:`, error);
    throw error;
  }
};

// ── Order Items ─────────────────────────────────
export const getOrderItems = async (): Promise<OrderItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/order-items/`);
    return handleResponse<OrderItem[]>(response);
  } catch (error) {
    console.error('Error in getOrderItems:', error);
    throw error;
  }
};

export const createOrderItem = async (data: Omit<OrderItem, 'id'>): Promise<OrderItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/order-items/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<OrderItem>(response);
  } catch (error) {
    console.error('Error in createOrderItem:', error);
    throw error;
  }
};

export const updateOrderItem = async (id: number, data: Partial<OrderItem>): Promise<OrderItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/order-items/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<OrderItem>(response);
  } catch (error) {
    console.error(`Error in updateOrderItem ${id}:`, error);
    throw error;
  }
};

export const deleteOrderItem = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/order-items/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error in deleteOrderItem ${id}:`, error);
    throw error;
  }
};