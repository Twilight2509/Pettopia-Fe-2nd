import type { AppointmentData } from '@/services/partner/clinicService';

export interface ExtendedAppointment extends AppointmentData {
    customer_name?: string;
    pet_names?: string[];
    time?: string;
}

export interface AppointmentDetail {
    id: string;
    date: string;
    shift: string;
    status: string;
    user_info: {
        fullname: string;
        phone_number: string;
    };
    clinic_info: {
        clinic_name: string;
        email: {
            email_address: string;
        };
        phone: {
            phone_number: string;
        };
        address: {
            city: string;
            district: string;
            ward: string;
            detail: string;
        };
        representative: {
            name: string;
        };
    };
    service_infos: Array<{
        name: string;
        description: string;
        price: number;
        duration: number;
    }>;
    pet_infos: Array<{
        id: string;
        name: string;
        species: string;
        gender: string;
        breed: string;
        color: string;
        weight: number;
        dateOfBirth: string;
        owner: {
            fullname: string;
            phone: string;
            email: string;
        };
        avatar_url?: string;
    }>;
}

export type ViewMode = 'month' | 'week' | 'day' | 'table';

export interface AppointmentFilters {
    status: 'all' | 'Confirmed' | 'Pending_Confirmation' | 'Cancelled';
    dateFrom: string;
    dateTo: string;
    createdBy: 'all' | 'customer' | 'partner';
}
