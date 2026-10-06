import type { District, ProfileFormData, Province, Ward } from './_types';

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

export const PROVINCES_URL = "https://api.mysupership.vn/v1/partner/areas/province";
export const districtsUrl = (provinceCode: string) =>
  `https://api.mysupership.vn/v1/partner/areas/district?province=${provinceCode}`;
export const wardsUrl = (districtCode: string) =>
  `https://api.mysupership.vn/v1/partner/areas/commune?district=${districtCode}`;

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

export const validateProfileForm = (formData: ProfileFormData): string | null => {
  if (!formData.fullname.trim()) {
    return 'Họ và tên không được để trống';
  }

  if (formData.fullname.trim().length < 7) {
    return 'Họ và tên phải có ít nhất 7 ký tự';
  }

  if (formData.fullname.trim().length > 50) {
    return 'Họ và tên không được quá 50 ký tự';
  }

  if (!/^[a-zA-ZÀ-ỿ\s]+$/.test(formData.fullname)) {
    return 'Họ và tên chỉ chứa chữ cái và khoảng trắng';
  }

  if (!formData.email.trim()) {
    return 'Email không được để trống';
  }

  if (formData.dob) {
    const selectedDate = new Date(formData.dob);
    const today = new Date();
    if (selectedDate > today) {
      return 'Ngày sinh không được ở tương lai';
    }
  }

  return null;
};

export const getProfilePath = (pathname: string) => {
  if (pathname.includes('/admin/')) return '/admin/profile';
  if (pathname.includes('/staff/')) return '/staff/profile';
  if (pathname.includes('/clinic/')) return '/clinic/profile';
  if (pathname.includes('/vet/')) return '/vet/profile';
  return '/user/profile';
};
