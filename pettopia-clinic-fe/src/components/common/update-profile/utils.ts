import axios from "axios";
import type { District, Province, User, Ward } from "./types";

const AREAS_API = "https://api.mysupership.vn/v1/partner/areas";

export const PROVINCES_URL = `${AREAS_API}/province`;
export const districtsUrl = (provinceCode: string) => `${AREAS_API}/district?province=${provinceCode}`;
export const wardsUrl = (districtCode: string) => `${AREAS_API}/commune?district=${districtCode}`;

export const fallbackProvinces: Province[] = [
  { code: "01", name: "Thành phố Hà Nội" },
  { code: "79", name: "Thành phố Hồ Chí Minh" },
];

export const fallbackDistricts: District[] = [
  { code: "001", name: "Quận Ba Đình", province_code: "01" },
  { code: "760", name: "Quận 1", province_code: "79" },
];

export const fallbackWards: Ward[] = [
  { code: "00001", name: "Phường Phúc Xá", district_code: "001" },
  { code: "26734", name: "Phường Bến Nghé", district_code: "760" },
];

export const mapProvinces = (data: any): Province[] =>
  data.results.map((p: any) => ({
    code: String(p.code),
    name: p.name,
  }));

export const mapDistricts = (data: any): District[] =>
  data.results.map((d: any) => ({
    code: String(d.code),
    name: d.name,
    province_code: String(d.province_code),
  }));

export const mapWards = (data: any): Ward[] =>
  data.results.map((w: any) => ({
    code: String(w.code),
    name: w.name,
    district_code: String(w.district_code),
  }));

export const fetchWithRetry = async (url: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

export const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      return dateString.split('T')[0];
    }
    return '';
  }
};

export const mapProfileToUser = (data: any): User => ({
  id: data.id || data._id || data.customer_id || '',
  fullname: data.fullname || data.username || 'Người dùng',
  username: data.username,
  email: typeof data.email === 'string' ? data.email : data.email?.email_address || '',
  phone: typeof data.phone === 'string' ? data.phone : data.phone?.phone_number || '',
  avatar_url: data.avatar_url || data.avatar || undefined,
  address: {
    city: data.address?.city || '',
    district: data.address?.district || '',
    ward: data.address?.ward || '',
    description: data.address?.description || ''
  },
  dob: data.dob || '',
  createdAt: data.createdAt || data.created_at || ''
});

export const getProfilePath = (pathname: string) => {
  if (pathname.includes('/admin/')) return '/admin/profile';
  if (pathname.includes('/staff/')) return '/staff/profile';
  if (pathname.includes('/clinic/')) return '/clinic/profile';
  if (pathname.includes('/vet/')) return '/vet/profile';
  return '/user/profile';
};
