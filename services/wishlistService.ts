import { apiClient } from "@/services/apiClient";

export const wishlistService = {
  fetchProductIds: async (): Promise<number[]> => {
    const response = await apiClient.get("/api/wishlist");
    return response.data.productIds as number[];
  },

  add: async (productId: number) => {
    await apiClient.post("/api/wishlist", { productId });
  },

  remove: async (productId: number) => {
    await apiClient.delete(`/api/wishlist?productId=${productId}`);
  },
};
