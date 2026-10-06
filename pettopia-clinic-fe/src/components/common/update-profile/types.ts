export interface User {
  id: string;
  fullname: string;
  username?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  address?: {
    city?: string;
    district?: string;
    ward?: string;
    description?: string;
  };
  dob?: string;
  createdAt?: string;
}

export interface ProfileFormData {
  fullname: string;
  email: string;
  phone: string;
  dob: string;
  address: {
    city: string;
    district: string;
    ward: string;
    description: string;
  };
}

export type Province = { code: string; name: string };
export type District = { code: string; name: string; province_code: string };
export type Ward = { code: string; name: string; district_code: string };
