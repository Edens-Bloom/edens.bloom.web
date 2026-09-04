import { apiClient } from "@/services/apiClient";

export interface DesignRequest {
  full_name: string;
  phone: string;
  email?: string;
  description: string;
  image?: File;
}

export const designRequestService = {
  submit: async (data: DesignRequest) => {
    const formData = new FormData();
    formData.append("full_name", data.full_name);
    formData.append("phone", data.phone);
    if (data.email) formData.append("email", data.email);
    formData.append("description", data.description);
    if (data.image) formData.append("image", data.image);

    const response = await apiClient.post("/api/design-requests", formData);
    return response;
  },
};
