import { apiClient, requireAuthToken } from '@/services/apiClient';

const SHIFT_API_URL = '/partner/clinic/shift';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

export interface ClinicShift {
  _id?: string;
  shift: string;
  max_slot: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface ClinicShiftPayload {
  shift: string;
  max_slot: number;
  start_time: string;
  end_time: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages?: number;
  };
}

export async function getClinicShifts(page: number = 1, limit: number = 10): Promise<PaginatedResponse<ClinicShift>> {
  requireAuthToken();

  const response = await apiClient.get(SHIFT_API_URL, {
    params: { page, limit },
    headers: JSON_HEADERS,
  });

  return response.data as PaginatedResponse<ClinicShift>;
}

export async function upsertClinicShift(payload: ClinicShift): Promise<ClinicShift> {
  requireAuthToken();

  const response = payload._id
    ? await apiClient.put(`${SHIFT_API_URL}/${payload._id}`, payload, { headers: JSON_HEADERS })
    : await apiClient.post(SHIFT_API_URL, payload, { headers: JSON_HEADERS });
  return response.data as ClinicShift;
}

export async function fetchClinicShiftPage(page: number, limit: number) {
  try {
    const response = await apiClient.get(`${SHIFT_API_URL}?page=${page}&limit=${limit}`, { headers: JSON_HEADERS });
    return response.data;
  } catch {
    throw new Error('Không thể tải danh sách ca làm việc');
  }
}

export async function createClinicShift(shift: ClinicShiftPayload) {
  try {
    const response = await apiClient.post(SHIFT_API_URL, shift, { headers: JSON_HEADERS });
    return response.data;
  } catch {
    throw new Error('Không thể tạo ca làm việc');
  }
}

export async function updateClinicShift(id: string, shift: ClinicShiftPayload) {
  try {
    const response = await apiClient.put(`${SHIFT_API_URL}/${id}`, shift, { headers: JSON_HEADERS });
    return response.data;
  } catch {
    throw new Error('Không thể cập nhật ca làm việc');
  }
}

export async function deleteClinicShift(id: string) {
  try {
    const response = await apiClient.delete(`${SHIFT_API_URL}/${id}`, { headers: JSON_HEADERS });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Không thể xóa ca làm việc');
  }
}
