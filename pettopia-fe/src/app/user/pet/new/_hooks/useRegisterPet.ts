'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPet, getPetsByOwner } from '@/services/petcare/petService';
import { getCustomerProfile, getVipStatus } from '@/services/user/userService';
import { toast } from 'react-hot-toast';
import type { AvatarUploadMethod, FieldErrors, OwnerData, PetForm } from '../_types';
import {
    INITIAL_PET_FORM,
    SPECIES_MAP,
    detailsToFieldErrors,
    parseCreatePetError,
    validateOptionalFields,
    validateRequiredFields,
} from '../_utils';

export function useRegisterPet() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);
    const [avatarUploadMethod, setAvatarUploadMethod] = useState<AvatarUploadMethod>('file');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [petCount, setPetCount] = useState(0);
    const [isVip, setIsVip] = useState(false);
    const [petForm, setPetForm] = useState<PetForm>(INITIAL_PET_FORM);
    const [userData, setUserData] = useState<OwnerData>({
        user_id: '',
        fullname: '',
        phone: '',
        email: '',
        address: {
            city: '',
            district: '',
            ward: ''
        }
    });

    const handleInputChange = (field: string, value: string) => {
        setPetForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Vui lòng chọn file ảnh hợp lệ', { duration: 2000 });
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setAvatarFile(null);
                setAvatarPreview('');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error('Kích thước file không được vượt quá 5MB', { duration: 2000 });
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setAvatarFile(null);
                setAvatarPreview('');
                return;
            }

            setAvatarFile(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlChange = (url: string) => {
        setPetForm(prev => ({ ...prev, avatar_url: url }));
        setAvatarPreview(url);
    };

    const getCurrentAvatarSrc = () => {
        if (avatarUploadMethod === 'file' && avatarPreview) {
            return avatarPreview;
        }
        if (avatarUploadMethod === 'url' && petForm.avatar_url) {
            return petForm.avatar_url;
        }
        return '';
    };

    const handleSubmitPet = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        setErrors({});

        if (!isVip && petCount >= 3) {
            toast.error('Bạn đã đạt giới hạn 3 thú cưng. Nâng cấp VIP để thêm nhiều hơn!', { duration: 3000 });
            return;
        }

        const requiredErrors = validateRequiredFields(petForm);
        if (Object.keys(requiredErrors).length > 0) {
            toast.error('Vui lòng điền đầy đủ các trường bắt buộc', { duration: 2000 });
            setErrors(requiredErrors);
            return;
        }

        const newErrors = validateOptionalFields(petForm, avatarUploadMethod);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Vui lòng kiểm tra lại thông tin đã nhập', { duration: 2000 });
            const firstErrorField = Object.keys(newErrors)[0];
            const element = document.getElementById(`pet-${firstErrorField}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }
            return;
        }

        setIsSubmitting(true);
        try {
            const normalizedSpecies = SPECIES_MAP[petForm.species] || petForm.species;

            let avatarUrl: string | undefined = undefined;
            let avatarFileToSend: File | undefined = undefined;
            if (avatarUploadMethod === 'file' && avatarFile) {
                avatarFileToSend = avatarFile;
            } else if (avatarUploadMethod === 'url' && petForm.avatar_url) {
                avatarUrl = petForm.avatar_url;
            }

            const payload = {
                name: petForm.name.trim(),
                species: normalizedSpecies,
                breed: petForm.breed.trim() || undefined,
                gender: petForm.gender ? (petForm.gender === 'male' ? 'Male' : 'Female') : undefined,
                color: petForm.color.trim() || undefined,
                weight: petForm.weight ? Number(petForm.weight) : undefined,
                dateOfBirth: petForm.dateOfBirth ? new Date(petForm.dateOfBirth).toISOString() : undefined,
                avatar_url: avatarUrl || undefined,
                avatarFile: avatarFileToSend,
                user_id: userData.user_id,
                owner: {
                    id: userData.user_id,
                    fullname: userData.fullname,
                    phone: userData.phone,
                    email: userData.email,
                    address: {
                        city: userData.address.city,
                        district: userData.address.district,
                        ward: userData.address.ward
                    }
                }
            };

            const res = await createPet(payload);

            if (res?.status === 'error' || res?.error) {
                const errorMessage = res?.message || res?.error || 'Có lỗi xảy ra khi tạo thú cưng. Vui lòng thử lại.';
                throw new Error(errorMessage);
            }

            if (res?.message && !res?.error && res?.status !== 'error') {
                toast.success(res.message, { duration: 2000 });
                setTimeout(() => {
                    router.push('/user/home');
                }, 2000);
                return;
            } else {
                throw new Error('Tạo pet thành công nhưng không có thông báo');
            }
        } catch (err: any) {
            console.error('Create pet error:', err?.response || err);

            const { errorMessage, errorDetails } = parseCreatePetError(err);

            toast.error(errorMessage, { duration: 3000 });
            setServerError(errorMessage);

            if (errorDetails.length > 0) {
                const fieldErrors = detailsToFieldErrors(errorDetails);
                if (Object.keys(fieldErrors).length > 0) {
                    setErrors(fieldErrors);
                }
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
                if (!token) {
                    console.warn('Missing auth token, redirecting to login');
                    return;
                }

                const data = await getCustomerProfile();
                if (!data) {
                    console.warn('Không thể tải thông tin khách hàng');
                    return;
                }

                const resolvedUserId = data.id || data._id || data.customer_id || '';

                setUserData({
                    user_id: resolvedUserId,
                    fullname: data.fullname || '',
                    phone: typeof data.phone === 'string' ? data.phone : data.phone?.phone_number || '',
                    email: typeof data.email === 'string' ? data.email : data.email?.email_address || '',
                    address: {
                        city: data.address?.city || '',
                        district: data.address?.district || '',
                        ward: data.address?.ward || ''
                    }
                });

                setPetForm(prev => ({
                    ...prev,
                    city: data.address?.city || '',
                    district: data.address?.district || '',
                    ward: data.address?.ward || ''
                }));

                try {
                    const pets = await getPetsByOwner(resolvedUserId);
                    setPetCount(pets.length);
                } catch (petError) {
                    console.error('Error fetching pet count:', petError);
                    setPetCount(0);
                }

                try {
                    const vipData = await getVipStatus();
                    if (vipData && vipData.is_vip) {
                        setIsVip(true);
                    } else {
                        setIsVip(false);
                    }
                } catch (vipError) {
                    console.error('Error fetching VIP status:', vipError);
                    setIsVip(false);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return {
        router,
        fileInputRef,
        isSubmitting,
        serverError,
        isFlipped,
        setIsFlipped,
        avatarUploadMethod,
        setAvatarUploadMethod,
        avatarPreview,
        errors,
        petCount,
        isVip,
        petForm,
        handleInputChange,
        handleFileUpload,
        handleUrlChange,
        getCurrentAvatarSrc,
        handleSubmitPet,
    };
}
