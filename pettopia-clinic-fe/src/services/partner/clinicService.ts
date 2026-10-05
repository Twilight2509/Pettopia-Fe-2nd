import { apiClient, requireAuthToken } from "@/services/apiClient";

const API_URL = "/partner/clinic";
const PARTNER_API_URL = "/partner";
const HEALTHCARE_API_URL = "/healthcare";
const JSON_HEADERS = { "Content-Type": "application/json" };

export interface ClinicFormData {
  user_id: string;
  clinic_name: string;
  email: {
    email_address: string;
    verified: boolean;
  };
  phone: {
    phone_number: string;
    verified: boolean;
  };
  license_number: string;
  address: {
    city: string;
    district: string;
    ward: string;
    detail: string;
  };
  status: string;
  representative: {
    name: string;
    identify_number: string;
    responsible_licenses: string[];
    license_issued_date: string;
  };
  id: string;
  createdAt: string;
  updatedAt: string;
  note?: string;
  review_by?: string;
}

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClinicFormsResponse {
  success: boolean;
  message: string;
  pagination: PaginationResponse;
  data: ClinicFormData[];
}

export interface ClinicItem {
  _id: string;
  id: string;
  clinic_name: string;
  email: { email_address: string; verified?: boolean };
  phone: { phone_number: string; verified?: boolean };
  license_number?: string;
  address: {
    city: string;
    district: string;
    ward: string;
    detail: string;
  };
  representative?: {
    name?: string;
    email?: { email_address?: string };
    phone?: { phone_number?: string };
    identify_number?: string;
    responsible_licenses?: string[];
    license_issued_date?: string;
  };
  is_active?: boolean;
  member_ids?: string[];
  createdAt?: string;
  updatedAt?: string;
  user_account_id?: string;
}

export interface ClinicsResponse {
  status: string;
  message: string;
  data: ClinicItem[];
  pagination?: PaginationResponse;
}

export interface ClinicDetailResponse {
  status: string;
  message: string;
  data: ClinicItem;
}

interface ClinicData {
  user_id: string;
  clinic_name: string;
  email: { email_address: string };
  phone: { phone_number: string };
  license_number: string;
  address: {
    city: string;
    district: string;
    ward: string;
    detail: string;
  };
  representative: {
    name: string;
    identify_number: string;
    responsible_licenses: string[];
    license_issued_date: string;
  };
}

export interface AppointmentData {
  _id: string;
  user_id: string;
  customer?: string;
  partner?: string;
  pet_ids: string[];
  clinic_id: string;
  service_ids: string[];
  date: string;
  shift: string;
  status: string;
  created_by?: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  cancelled_by?: string;
}

export interface AppointmentsResponse {
  status: string;
  message: string;
  data: AppointmentData[];
  pagination: PaginationResponse;
}

export interface AppointmentDetailResponse {
  status: string;
  message: string;
  data: AppointmentData;
}

export interface Medication {
  medication_name: string;
  dosage: string;
  instructions?: string;
}

export interface MedicalRecordPayload {
  pet_id: string;
  symptoms: string;
  diagnosis: string;
  notes?: string;
  medications?: Medication[];
}

export const registerClinic = async (clinicData: ClinicData) => {
  requireAuthToken();

  try {
    const response = await apiClient.post(`${API_URL}/register`, clinicData, { headers: JSON_HEADERS });
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi đăng ký phòng khám:", error.response?.data || error.message);
    throw error;
  }
};

export const getClinicForms = async (page: number = 1, limit: number = 10) => {
  requireAuthToken();

  try {
    const response = await apiClient.get(`${API_URL}/form?page=${page}&limit=${limit}`, { headers: JSON_HEADERS });
    return response.data as ClinicFormsResponse;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách form đăng ký phòng khám:", error);
    throw error;
  }
};

export const updateClinicFormStatus = async (formId: string, status: string, note?: string) => {
  requireAuthToken();

  try {
    const response = await apiClient.post(`${API_URL}/status/${formId}`, {
      status,
      note: note || (status === 'approved' ? 'Phòng khám đủ điều kiện hoạt động' : 'Phòng khám không đủ điều kiện hoạt động')
    }, { headers: JSON_HEADERS });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái phòng khám:", error);
    throw error;
  }
};

export const getClinicServices = async (page: number = 1, limit: number = 10, search?: string) => {
  requireAuthToken();

  try {
    const params: Record<string, any> = { page, limit };
    if (search?.trim()) params.search = search.trim();

    const response = await apiClient.get(`${PARTNER_API_URL}/service/all`, { params });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách service:", error);
    throw error;
  }
};

export const createClinicService = async (serviceData: any) => {
  requireAuthToken();

  try {
    const response = await apiClient.post(`${PARTNER_API_URL}/service`, serviceData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo service:", error);
    throw error;
  }
};

export const updateClinicService = async (serviceId: string, serviceData: any) => {
  requireAuthToken();

  try {
    const response = await apiClient.patch(`${PARTNER_API_URL}/service/${serviceId}`, serviceData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật service:", error);
    throw error;
  }
};

export const deleteClinicService = async (serviceId: string) => {
  requireAuthToken();

  try {
    const response = await apiClient.delete(`${PARTNER_API_URL}/service/${serviceId}`);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi xóa service:", error);
    throw new Error(error.response?.data?.message || 'Không thể xóa dịch vụ');
  }
};

export const getAppointments = async (page: number = 1, limit: number = 10) => {
  requireAuthToken();

  try {
    const response = await apiClient.get(`${HEALTHCARE_API_URL}/appointments`, { params: { page, limit } });
    return response.data as AppointmentsResponse;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lịch hẹn:", error);
    throw error;
  }
};

export const getAppointmentDetail = async (appointmentId: string) => {
  requireAuthToken();

  try {
    const response = await apiClient.get(`${HEALTHCARE_API_URL}/appointments/${appointmentId}`);
    return response.data as AppointmentDetailResponse;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết lịch hẹn:", error);
    throw error;
  }
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: string,
  cancel_reason?: string
) => {
  requireAuthToken();

  try {
    const body: any = { status };
    if (cancel_reason) body.cancel_reason = cancel_reason;

    const response = await apiClient.patch(`${HEALTHCARE_API_URL}/appointments/${appointmentId}/status`, body);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi cập nhật trạng thái lịch hẹn:", error);
    console.error("Error details:", {
      message: error?.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      url: error?.config?.url,
      method: error?.config?.method,
      data: error?.response?.data
    });
    throw error;
  }
};

/**
 * Gán bác sĩ (vet) cho lịch hẹn
 * POST `${HEALTHCARE_API_URL}/appointments/{appointmentId}/assign-vet`
 * body: { vetId: string }
 */
export const assignVetToAppointment = async (appointmentId: string, vetId: string) => {
  requireAuthToken();

  try {
    const url = `${HEALTHCARE_API_URL}/appointments/${appointmentId}/assign-vet`;
    const response = await apiClient.post(url, { vetId });
    return response.data;
  } catch (error: any) {
    console.error(`Lỗi khi gán vet cho lịch hẹn (${appointmentId}):`, error?.response?.data || error?.message || error);
    throw error;
  }
};

/**
 * Tạo hồ sơ y tế (medical record) cho lịch hẹn
 * POST `${HEALTHCARE_API_URL}/appointments/{appointmentId}/medical-records`
 */
export const createMedicalRecord = async (appointmentId: string, payload: MedicalRecordPayload) => {
  requireAuthToken();

  try {
    const url = `${HEALTHCARE_API_URL}/appointments/${appointmentId}/medical-records`;
    const response = await apiClient.post(url, payload, { headers: JSON_HEADERS });
    return response.data;
  } catch (error: any) {
    console.error(`Lỗi khi tạo medical record cho lịch hẹn (${appointmentId}):`, error?.response?.data || error?.message || error);
    throw error;
  }
};

export interface MedicalRecordData {
  symptoms: string;
  diagnosis: string;
  notes?: string;
  medications?: Medication[];
}

export interface MedicalRecordResponse {
  status: string;
  message: string;
  data: MedicalRecordData;
}

/**
 * Lấy chi tiết hồ sơ bệnh án của một lịch hẹn
 * GET `${HEALTHCARE_API_URL}/appointments/{appointmentId}/medical-record`
 */
export const getMedicalRecord = async (appointmentId: string) => {
  requireAuthToken();

  try {
    const url = `${HEALTHCARE_API_URL}/appointments/${appointmentId}/medical-record`;
    const response = await apiClient.get(url);
    return response.data as MedicalRecordResponse;
  } catch (error: any) {
    console.error(`Lỗi khi lấy hồ sơ bệnh án (${appointmentId}):`, error?.response?.data || error?.message || error);
    throw error;
  }
};

export interface UpdateMedicalRecordPayload {
  symptoms?: string;
  diagnosis?: string;
  notes?: string;
  medications?: Medication[];
}

/**
 * Cập nhật (sửa) hồ sơ bệnh án cho một lịch hẹn
 * PATCH `${HEALTHCARE_API_URL}/appointments/{appointmentId}/medical-record`
 * Lưu ý: truyền `appointmentId` (id của lịch hẹn) làm param
 */
export const updateMedicalRecord = async (appointmentId: string, payload: UpdateMedicalRecordPayload) => {
  requireAuthToken();

  try {
    const url = `${HEALTHCARE_API_URL}/appointments/${appointmentId}/medical-record`;
    const response = await apiClient.patch(url, payload, { headers: JSON_HEADERS });
    return response.data;
  } catch (error: any) {
    console.error(`Lỗi khi cập nhật hồ sơ bệnh án (${appointmentId}):`, error?.response?.data || error?.message || error);
    throw error;
  }
};

export const sendInvitation = async (email: string, role: string) => {
  requireAuthToken();

  try {
    const response = await apiClient.post(`${PARTNER_API_URL}/clinic/invitations`, { email, role });
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi gửi lời mời:", error.response?.data || error.message);
    throw error;
  }
};

export const acceptInvitation = async (inviteId: string) => {
  requireAuthToken();

  try {
    const response = await apiClient.post(`${PARTNER_API_URL}/clinic/invitations/${inviteId}/accept`, {});
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi chấp nhận lời mời:", error.response?.data || error.message);
    throw error;
  }
};

export const declineInvitation = async (inviteId: string) => {
  requireAuthToken();

  try {
    const response = await apiClient.post(`${PARTNER_API_URL}/clinic/invitations/${inviteId}/decline`, {});
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi từ chối lời mời:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Cập nhật thông tin phòng khám
 * PUT `${API_URL}/${clinicId}`
 */
export const updateClinic = async (clinicId: string, clinicData: Partial<ClinicItem>) => {
  requireAuthToken();

  try {
    const response = await apiClient.put(`${API_URL}/${clinicId}`, clinicData, { headers: JSON_HEADERS });
    return response.data;
  } catch (error: any) {
    console.error(`Lỗi khi cập nhật phòng khám (${clinicId}):`, error?.response?.data || error?.message || error);
    throw error;
  }
};

/**
 * Xóa phòng khám
 * DELETE `${API_URL}/${clinicId}`
 */
export const removeClinic = async (clinicId: string) => {
  requireAuthToken();

  try {
    const response = await apiClient.delete(`${API_URL}/${clinicId}`, { headers: JSON_HEADERS });
    return response.data;
  } catch (error: any) {
    console.error(`Lỗi khi xóa phòng khám (${clinicId}):`, error?.response?.data || error?.message || error);
    throw error;
  }
};

/**
 * Lấy danh sách tất cả phòng khám (có phân trang)
 * GET `${API_URL}?page=1&limit=5`
 */
export const findAllClinics = async (page: number = 1, limit: number = 10, search?: string) => {
  requireAuthToken();

  try {
    const params: Record<string, any> = { page, limit };
    if (search?.trim()) params.search = search.trim();

    const response = await apiClient.get(`${API_URL}/`, { params, headers: JSON_HEADERS });

    return response.data as ClinicsResponse;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phòng khám:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết phòng khám theo `id` (uuid)
 * GET `${API_URL}/${clinicId}`
 */
export const getClinicDetail = async (clinicId: string) => {
  requireAuthToken();

  try {
    const response = await apiClient.get(`${API_URL}/${clinicId}`, { headers: JSON_HEADERS });

    return response.data as ClinicDetailResponse;
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết phòng khám (${clinicId}):`, error);
    throw error;
  }
};

/**
 * Bật / tắt trạng thái active của phòng khám
 * PATCH `${API_URL}/active/${clinicId}`
 * body: { is_active: boolean }
 */
export const setClinicActive = async (clinicId: string, isActive: boolean) => {
  requireAuthToken();

  try {
    const response = await apiClient.patch(`${API_URL}/active/${clinicId}`, { is_active: isActive }, { headers: JSON_HEADERS });
    return response.data;
  } catch (error: any) {
    console.error(`Lỗi khi cập nhật trạng thái active phòng khám (${clinicId}):`, error?.response?.data || error?.message || error);
    throw error;
  }
};

export const activateClinic = async (clinicId: string) => setClinicActive(clinicId, true);
export const deactivateClinic = async (clinicId: string) => setClinicActive(clinicId, false);
