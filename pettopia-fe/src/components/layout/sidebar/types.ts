import type { PetDetailResponse } from '@/services/petcare/petService';

export interface UserData {
  userId: string;
  fullname: string;
  gender?: string;
  email: {
    email_address: string;
    verified: boolean;
  };
  phone_number?: string;
  username: string;
  dob: string;
  address: {
    city: string;
    district: string;
    ward: string;
    description: string;
  };
}

export type Pet = PetDetailResponse & {
  image?: string;
  imageUrl?: string;
  photo?: string;
  avatar?: string;
  type?: string;
};
