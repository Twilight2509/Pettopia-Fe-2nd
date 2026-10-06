import type { AvatarUploadMethod, FieldErrors, PetForm } from './_types';

export const COMMON_COLORS = [
    { name: 'Trắng', value: 'Trắng', hex: '#FFFFFF' },
    { name: 'Đen', value: 'Đen', hex: '#000000' },
    { name: 'Nâu', value: 'Nâu', hex: '#8B4513' },
    { name: 'Vàng', value: 'Vàng', hex: '#FFD700' },
    { name: 'Xám', value: 'Xám', hex: '#808080' },
    { name: 'Cam', value: 'Cam', hex: '#FFA500' },
    { name: 'Kem', value: 'Kem', hex: '#FFFDD0' },
    { name: 'Vện', value: 'Vện', hex: 'linear-gradient(90deg, #000 50%, #FFF 50%)' }
];

export const INITIAL_PET_FORM: PetForm = {
    name: '',
    species: '',
    breed: '',
    gender: '',
    color: '',
    weight: '',
    dateOfBirth: '',
    avatar_url: '',
    city: '',
    district: '',
    ward: ''
};

export const SPECIES_MAP: Record<string, string> = {
    'Chó': 'Dog', 'Mèo': 'Cat', 'Thỏ': 'Rabbit', 'Chim': 'Bird', 'Khác': 'Other'
};

export function validateRequiredFields(petForm: PetForm): FieldErrors {
    const newErrors: FieldErrors = {};
    if (!petForm.name.trim()) {
        newErrors.name = 'Vui lòng nhập tên thú cưng';
    } else if (petForm.name.trim().length < 2) {
        newErrors.name = 'Tên thú cưng phải có ít nhất 2 ký tự';
    } else if (petForm.name.trim().length > 15) {
        newErrors.name = 'Tên thú cưng không được quá 15 ký tự';
    }

    if (!petForm.species) {
        newErrors.species = 'Vui lòng chọn loại thú cưng';
    }
    return newErrors;
}

export function validateOptionalFields(petForm: PetForm, avatarUploadMethod: AvatarUploadMethod): FieldErrors {
    const newErrors: FieldErrors = {};
    if (petForm.weight) {
        const weightNum = Number(petForm.weight);
        if (isNaN(weightNum) || weightNum <= 0) {
            newErrors.weight = 'Cân nặng phải là số dương';
        } else if (weightNum > 200) {
            newErrors.weight = 'Cân nặng không hợp lệ (tối đa 200kg)';
        }
    }

    if (petForm.dateOfBirth) {
        const birthDate = new Date(petForm.dateOfBirth);
        const today = new Date();
        if (birthDate > today) {
            newErrors.dateOfBirth = 'Ngày sinh không được trong tương lai';
        }
        const maxAge = new Date();
        maxAge.setFullYear(maxAge.getFullYear() - 50);
        if (birthDate < maxAge) {
            newErrors.dateOfBirth = 'Ngày sinh không hợp lệ';
        }
    }

    if (petForm.breed && petForm.breed.length > 50) {
        newErrors.breed = 'Tên giống không được quá 50 ký tự';
    }

    if (petForm.color && petForm.color.length > 25) {
        newErrors.color = 'Màu sắc không quá 25 kí tự';
    }

    if (avatarUploadMethod === 'url' && petForm.avatar_url) {
        try {
            new URL(petForm.avatar_url);
        } catch {
            newErrors.avatar_url = 'URL ảnh không hợp lệ';
        }
    }
    return newErrors;
}

export function parseCreatePetError(err: any): { errorMessage: string; errorDetails: string[] } {
    let errorMessage = 'Có lỗi xảy ra khi tạo thú cưng. Vui lòng thử lại.';
    let errorDetails: string[] = [];

    if (err?.response?.data) {
        const errorData = err.response.data;

        if (errorData.message) {
            errorMessage = errorData.message;
        }

        if (errorData.errors) {
            if (Array.isArray(errorData.errors)) {
                errorDetails = errorData.errors.map((e: any) =>
                    typeof e === 'string' ? e : e.message || JSON.stringify(e)
                );
            } else if (typeof errorData.errors === 'object') {
                errorDetails = Object.entries(errorData.errors).map(
                    ([field, msg]) => `${field}: ${msg}`
                );
            }
        }

        if (errorData.error && typeof errorData.error === 'string') {
            errorMessage = errorData.error;
        }
    } else if (err?.message) {
        errorMessage = err.message;
    }

    return { errorMessage, errorDetails };
}

export function detailsToFieldErrors(errorDetails: string[]): FieldErrors {
    const fieldErrors: FieldErrors = {};
    errorDetails.forEach(detail => {
        const match = detail.match(/^(\w+):\s*(.+)$/);
        if (match) {
            fieldErrors[match[1]] = match[2];
        }
    });
    return fieldErrors;
}
