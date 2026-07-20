import { apiClient } from "@/services/apiClient";
import type { Product } from "@/types";

export const productService = {
  fetchAll: async (): Promise<Product[]> => {
    const response = await apiClient.get("/api/products");
    return response.data.products || [];
  },
  fetchById: async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data.product as Product;
  },
  create: async (payload: Partial<Product> | FormData) => {
    const response = await apiClient.post("/api/products", payload);
    return response.data.product as Product;
  },
  update: async (id: number, payload: Partial<Product> | FormData) => {
    const response = await apiClient.put(`/api/products/${id}`, payload);
    return response.data.product as Product;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`/api/products/${id}`);
    return response;
  },
};
