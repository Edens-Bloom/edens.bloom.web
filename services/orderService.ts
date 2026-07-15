import { apiClient } from "@/services/apiClient";
import type { CartState, User, Order } from "@/types";

export const orderService = {
  orderConfirm: async (user: User | null, cart: CartState): Promise<Order> => {
    const response = await apiClient.post("/orders", { user, cart });
    return response.data.order as Order;
  },
  fetchAllOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get("/orders");
    return response.data.orders || [];
  },
  fetchOrderById: async (id: number): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data.order as Order;
  },
};
