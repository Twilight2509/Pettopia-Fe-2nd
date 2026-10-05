import { apiClient } from "@/services/apiClient";

const API_URL = "/customer";

const getAuthHeaders = () => ({ headers: { "Content-Type": "application/json" } });

export async function getCustomerById(id?: string | number | null) {
  try {
    const url = !id || id === "profile" ? `${API_URL}/profile` : `${API_URL}/${id}`;

    // Nếu muốn fail fast khi không có token, bật check này:
    // if (!getAuthToken()) throw new Error('No authentication token found');

    const response = await apiClient.get(url, getAuthHeaders());

    const respBody = response.data;
    return respBody?.data ?? respBody;
  } catch (error: any) {
    const status = error.response?.status;
    const respData = error.response?.data;
    const errorMsg = respData?.message || respData || error.message || "Unknown error";

    console.error(`getCustomerById failed (id=${id}) status=${status}`, respData || error.message);

    if (status === 404) {
      console.warn("Khách hàng không tìm thấy:", errorMsg);
      return null;
    }

    if (status === 401 || status === 403) {
      console.warn("Không có quyền truy cập chi tiết khách hàng:", errorMsg);
      return null;
    }

    throw new Error(errorMsg);
  }
}

/**
 * Lấy thông tin profile customer hiện tại (dùng token, không cần truyền id).
 * FE nên ưu tiên dùng hàm này cho trang hồ sơ cá nhân.
 */
export async function getCustomerProfile() {
  // backend mong muốn endpoint /customer/profile
  return getCustomerById("profile");
}

/**
 * Cập nhật profile customer hiện tại.
 * PATCH: /customer/profile
 */
export async function updateCustomerProfile(data: Record<string, any>) {
  try {
    const url = `${API_URL}/profile`;

    const response = await apiClient.patch(url, data, getAuthHeaders());

    const respBody = response.data;
    return respBody?.data ?? respBody;
  } catch (error: any) {
    const status = error.response?.status;
    const respData = error.response?.data;
    const errorMsg = respData?.message || respData || error.message || "Unknown error";

    console.error(`updateCustomerProfile failed status=${status}`, respData || error.message);

    if (status === 401 || status === 403) {
      console.warn("Không có quyền cập nhật profile:", errorMsg);
      return null;
    }

    throw new Error(errorMsg);
  }
}