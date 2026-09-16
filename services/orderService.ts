import { apiClient } from "@/services/apiClient";
import type { CartState, Order, OrderStatus, User } from "@/types";

export const orderService = {
  orderConfirm: async (user: User | null, cart: CartState): Promise<Order> => {
    const response = await apiClient.post("/api/orders", { user, cart });
    return response.data.order as Order;
  },
  fetchAllOrders: async (phone?: string): Promise<Order[]> => {
    const query = phone ? `?phone=${encodeURIComponent(phone)}` : "";
    const response = await apiClient.get(`/api/orders${query}`);
    return response.data.orders || [];
  },
  fetchOrderById: async (id: number): Promise<Order> => {
    const response = await apiClient.get(`/api/orders/${id}`);
    return response.data.order as Order;
  },
  updateStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    const response = await apiClient.patch(`/api/orders/${id}`, { status });
    return response.data.order as Order;
  },
};
