import { apiClient, requireAuthToken } from "@/services/apiClient";

const API_URL = "/customer";

const getAuthHeaders = () => {
  requireAuthToken();
  return { headers: { "Content-Type": "application/json" } };
};

export async function getCustomerData(
  page: number,
  limit: number,
  filters?: {
    fullname?: string;
    username?: string;
    phone_number?: string;
    email_address?: string;
    role?: string;
    reward_point?: number;
    is_active?: boolean;
  }
) {
  try {
    let url = `${API_URL}/?page=${page}&limit=${limit}`;

    // Thêm các tham số filter vào URL nếu có
    if (filters) {
      if (filters.fullname) {
        url += `&fullname=${encodeURIComponent(filters.fullname)}`;
      }
      if (filters.username) {
        url += `&username=${encodeURIComponent(filters.username)}`;
      }
      if (filters.phone_number) {
        url += `&phone_number=${encodeURIComponent(filters.phone_number)}`;
      }
      if (filters.email_address) {
        url += `&email_address=${encodeURIComponent(filters.email_address)}`;
      }
      if (filters.role) {
        url += `&role=${encodeURIComponent(filters.role)}`;
      }
      if (filters.reward_point !== undefined) {
        url += `&reward_point=${filters.reward_point}`;
      }
      if (filters.is_active !== undefined) {
        url += `&is_active=${filters.is_active}`;
      }
    }

    const response = await apiClient.get(url, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi lấy danh sách khách hàng:", error.response?.data || error.message);
    throw error;
  }
}

export async function getCustomerById(id: string | number) {
  try {
    const response = await apiClient.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch {
    return null;
  }
}

export async function getCustomerTotalDetail() {
  try {
    const response = await apiClient.get(`${API_URL}/total/detail`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi lấy tổng chi tiết khách hàng:", error.response?.data || error.message);
    throw error;
  }
}

export async function updateCustomerStatus(id: string | number, status: 'active' | 'deactive') {
  try {
    const response = await apiClient.patch(`${API_URL}/${id}/status`, { status }, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi cập nhật trạng thái khách hàng:", error.response?.data || error.message);
    throw error;
  }
}

export async function addCustomerRole(id: string | number, role: string) {
  try {
    const response = await apiClient.patch(`${API_URL}/${id}/add-role`, { role }, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi thêm role cho khách hàng:", error.response?.data || error.message);
    throw error;
  }
}
