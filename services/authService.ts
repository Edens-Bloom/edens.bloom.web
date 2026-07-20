import { apiClient } from "@/services/apiClient";
import type { User } from "@/types";

export interface LoginResult {
  token: string;
  user: User;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResult> => {
    const response = await apiClient.post("/api/auth/login", {
      username,
      password,
    });
    return {
      token: response.token,
      user: response.data.user as User,
    };
  },

  register: async (payload: {
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await apiClient.post("/api/auth/register", payload);
    return response.data.user as User;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get("/api/auth/me");
    return response.data.user as User;
  },
};
