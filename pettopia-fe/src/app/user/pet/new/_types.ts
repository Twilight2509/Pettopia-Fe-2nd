export interface PetForm {
    name: string;
    species: string;
    breed: string;
    gender: string;
    color: string;
    weight: string;
    dateOfBirth: string;
    avatar_url: string;
    city: string;
    district: string;
    ward: string;
}

export interface OwnerData {
    user_id: string;
    fullname: string;
    phone: string;
    email: string;
    address: {
        city: string;
        district: string;
        ward: string;
    };
}

export type AvatarUploadMethod = 'file' | 'url';

export type FieldErrors = Record<string, string>;
