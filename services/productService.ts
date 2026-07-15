import { apiClient } from "@/services/apiClient";
import type { Product } from "@/types";

export const productService = {
  fetchAll: async (): Promise<Product[]> => {
    const response = await apiClient.get("/products");
    return response.data.products || [];
  },
  fetchById: async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.product as Product;
  },
  create: async (payload: Partial<Product>) => {
    const response = await apiClient.post("/products", payload);
    return response.data.product as Product;
  },
  update: async (id: number, payload: Partial<Product>) => {
    const response = await apiClient.put(`/products/${id}`, payload);
    return response.data.product as Product;
  },
};
