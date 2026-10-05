'use client'
import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createPet, getPetsByOwner } from '@/services/petcare/petService';
import { getCustomerProfile, getVipStatus } from '@/services/user/userService';
import { toast } from 'react-hot-toast';
import { Spinner } from '@/components/ui';

export default function RegisterPetPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);
    const [avatarUploadMethod, setAvatarUploadMethod] = useState<'file' | 'url'>('file');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [petCount, setPetCount] = useState(0);
    const [isVip, setIsVip] = useState(false);
    const [petForm, setPetForm] = useState({
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
    });

    // Common pet colors
    const commonColors = [
        { name: 'Trắng', value: 'Trắng', hex: '#FFFFFF' },
        { name: 'Đen', value: 'Đen', hex: '#000000' },
        { name: 'Nâu', value: 'Nâu', hex: '#8B4513' },
        { name: 'Vàng', value: 'Vàng', hex: '#FFD700' },
        { name: 'Xám', value: 'Xám', hex: '#808080' },
        { name: 'Cam', value: 'Cam', hex: '#FFA500' },
        { name: 'Kem', value: 'Kem', hex: '#FFFDD0' },
        { name: 'Vện', value: 'Vện', hex: 'linear-gradient(90deg, #000 50%, #FFF 50%)' }
    ];

    // Add useState for user data
    const [userData, setUserData] = useState({
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
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Handle file upload (chỉ dùng để preview + giữ File, không gửi base64 lên backend)
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Vui lòng chọn file ảnh hợp lệ', { duration: 2000 });
                // Reset file input to prevent file from being uploaded
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setAvatarFile(null);
                setAvatarPreview('');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Kích thước file không được vượt quá 5MB', { duration: 2000 });
                // Reset file input to prevent file from being uploaded
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setAvatarFile(null);
                setAvatarPreview('');
                return;
            }

            // File is valid, proceed with setting it
            setAvatarFile(file);
            
            // Tạo preview (base64) chỉ để hiển thị UI
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle URL input
    const handleUrlChange = (url: string) => {
        setPetForm(prev => ({ ...prev, avatar_url: url }));
        setAvatarPreview(url);
    };

    // Get current avatar source for preview
    const getCurrentAvatarSrc = () => {
        if (avatarUploadMethod === 'file' && avatarPreview) {
            return avatarPreview;
        }
        if (avatarUploadMethod === 'url' && petForm.avatar_url) {
            return petForm.avatar_url;
        }
        return '';
    };

    // Calculate age from date of birth
    const calculateAge = () => {
        if (!petForm.dateOfBirth) return 0;
        const today = new Date();
        const birthDate = new Date(petForm.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSubmitPet = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        setErrors({});

        // Check pet limit
        if (!isVip && petCount >= 3) {
            toast.error('Bạn đã đạt giới hạn 3 thú cưng. Nâng cấp VIP để thêm nhiều hơn!', { duration: 3000 });
            return;
        }

        // Validate form
        const newErrors: Record<string, string> = {};

        // Required fields
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

        // If there are validation errors, show toast
        if (Object.keys(newErrors).length > 0) {
            toast.error('Vui lòng điền đầy đủ các trường bắt buộc', { duration: 2000 });
            setErrors(newErrors);
            return;
        }

        // Optional field validations
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

        // Avatar validation
        if (avatarUploadMethod === 'url' && petForm.avatar_url) {
            try {
                new URL(petForm.avatar_url);
            } catch {
                newErrors.avatar_url = 'URL ảnh không hợp lệ';
            }
        }

        // If there are validation errors, show them and stop
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Vui lòng kiểm tra lại thông tin đã nhập', { duration: 2000 });
            // Scroll to first error
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
            const normalizedSpecies = (() => {
                const map: Record<string, string> = {
                    'Chó': 'Dog', 'Mèo': 'Cat', 'Thỏ': 'Rabbit', 'Chim': 'Bird', 'Khác': 'Other'
                };
                return map[petForm.species] || petForm.species;
            })();

            // Handle avatar:
            // - Nếu upload file: gửi File trực tiếp (multipart/form-data) giống trang community/create
            // - Nếu nhập URL: gửi URL như cũ
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

            // Kiểm tra nếu response có lỗi (status error hoặc có field error)
            if (res?.status === 'error' || res?.error) {
                const errorMessage = res?.message || res?.error || 'Có lỗi xảy ra khi tạo thú cưng. Vui lòng thử lại.';
                throw new Error(errorMessage);
            }

            // ✅ CHỈ THÀNH CÔNG MỚI TOAST + REDIRECT
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

            let errorMessage = 'Có lỗi xảy ra khi tạo thú cưng. Vui lòng thử lại.';
            let errorDetails: string[] = [];

            // Nếu là lỗi từ axios (có response.data)
            if (err?.response?.data) {
                const errorData = err.response.data;
                
                // Check for message field
                if (errorData.message) {
                    errorMessage = errorData.message;
                }
                
                // Check for errors array or object with details
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
                
                // Check for error field
                if (errorData.error && typeof errorData.error === 'string') {
                    errorMessage = errorData.error;
                }
            } else if (err?.message) {
                // Nếu là lỗi từ throw new Error
                errorMessage = err.message;
            }

            toast.error(errorMessage, { duration: 3000 });
            setServerError(errorMessage);
            
            // Set field-specific errors if available
            if (errorDetails.length > 0) {
                const fieldErrors: Record<string, string> = {};
                errorDetails.forEach(detail => {
                    const match = detail.match(/^(\w+):\s*(.+)$/);
                    if (match) {
                        fieldErrors[match[1]] = match[2];
                    }
                });
                if (Object.keys(fieldErrors).length > 0) {
                    setErrors(fieldErrors);
                }
            }
            
            // Scroll to error message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Lấy thông tin khách hàng, số lượng pet, và VIP status khi component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
                if (!token) {
                    console.warn('Missing auth token, redirecting to login');
                    return;
                }

                // Lấy thông tin khách hàng
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

                // Lấy số lượng pet hiện tại
                try {
                    const pets = await getPetsByOwner(resolvedUserId);
                    setPetCount(pets.length);
                } catch (petError) {
                    console.error('Error fetching pet count:', petError);
                    setPetCount(0);
                }

                // Lấy VIP status
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

    return (
        <>
            {/* Loading Overlay - Fixed to cover entire viewport */}
            {isSubmitting && (
              <div className="fixed inset-0 bg-opacity-5 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center gap-4 min-w-[300px] max-w-[400px]">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
                            <Spinner size="xl" className="absolute inset-0" />
                        </div>
                        <p className="text-lg font-semibold text-gray-700">Đang tạo thú cưng...</p>
                        <p className="text-sm text-gray-500 text-center">Vui lòng đợi trong giây lát</p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-11 py-8">
                    {/* Form */}
                    <form onSubmit={handleSubmitPet} className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative ${isSubmitting ? 'pointer-events-none opacity-70' : ''}`}>
                        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Thông tin đăng kí thú cưng</h2>
                                <div className="text-sm">
                                    Số pet hiện tại: <span className="font-bold">{petCount}</span>/{isVip ? '∞' : '3'}
                                </div>
                            </div>
                        </div>

                        {/* Notification when pet limit reached */}
                        {!isVip && petCount >= 3 && (
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 m-6 rounded-r-lg flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-amber-800 font-medium">Giới hạn đạt tối đa</p>
                                        <p className="text-amber-700 text-sm mt-1">Số lượng thú cưng đăng ký đạt giới hạn, vui lòng nâng cấp tài khoản để có thể đăng ký thêm!</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => router.push('/user/upgrade')}
                                    className="ml-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium whitespace-nowrap flex-shrink-0"
                                >
                                    Nâng cấp
                                </button>
                            </div>
                        )}

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-8">
                                {/* Cột trái - Form nhập liệu */}
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="pet-name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên thú cưng <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="pet-name"
                                                type="text"
                                                placeholder="VD: Milu, Cún..."
                                                maxLength={15}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none ${
                                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                value={petForm.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                required
                                            />
                                            <span className="absolute right-3 top-2.5 text-xs text-gray-500">
                                                {petForm.name.length}/15
                                            </span>
                                        </div>
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="pet-type" className="block text-sm font-medium text-gray-700 mb-1">
                                            Loại thú cưng <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="pet-species"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none ${
                                                errors.species ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            value={petForm.species}
                                            onChange={(e) => handleInputChange('species', e.target.value)}
                                            required
                                        >
                                            <option value="">Chọn loại</option>
                                            <option value="Dog">Chó</option>
                                            <option value="Cat">Mèo</option>
                                            <option value="Rabbit">Thỏ</option>
                                            <option value="Bird">Chim</option>
                                            <option value="Other">Khác</option>
                                        </select>
                                        {errors.species && (
                                            <p className="mt-1 text-sm text-red-600">{errors.species}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="pet-breed" className="block text-sm font-medium text-gray-700 mb-1">
                                            Giống
                                        </label>
                                        <input
                                            id="pet-breed"
                                            type="text"
                                            placeholder="VD: Golden Retriever..."
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none ${
                                                errors.breed ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            value={petForm.breed}
                                            onChange={(e) => handleInputChange('breed', e.target.value)}
                                        />
                                        {errors.breed && (
                                            <p className="mt-1 text-sm text-red-600">{errors.breed}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="pet-color" className="block text-sm font-medium text-gray-700 mb-1">
                                            Màu sắc
                                        </label>
                                        
                                        {/* Color selection buttons */}
                                        <div className="grid grid-cols-4 gap-2 mb-2">
                                            {commonColors.map((color) => (
                                                <button
                                                    key={color.value}
                                                    type="button"
                                                    onClick={() => handleInputChange('color', color.value)}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                                                        petForm.color === color.value
                                                            ? 'border-teal-600 bg-teal-50'
                                                            : 'border-gray-200 hover:border-teal-300'
                                                    }`}
                                                >
                                                    <div
                                                        className="w-5 h-5 rounded-full border border-gray-300"
                                                        style={{
                                                            background: color.hex.includes('gradient') ? color.hex : color.hex,
                                                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                    <span className="text-xs font-medium">{color.name}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Custom color input */}
                                        <input
                                            id="pet-color"
                                            type="text"
                                            placeholder="Hoặc nhập màu khác..."
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none ${
                                                errors.color ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            value={petForm.color}
                                            onChange={(e) => handleInputChange('color', e.target.value)}
                                        />
                                        {errors.color && (
                                            <p className="mt-1 text-sm text-red-600">{errors.color}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Cột phải - Form nhập liệu */}
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="pet-weight" className="block text-sm font-medium text-gray-700 mb-1">
                                            Cân nặng (kg)
                                        </label>
                                        <input
                                            id="pet-weight"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="200"
                                            placeholder="VD: 12.5"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none ${
                                                errors.weight ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            value={petForm.weight}
                                            onChange={(e) => handleInputChange('weight', e.target.value)}
                                        />
                                        {errors.weight && (
                                            <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="pet-gender" className="block text-sm font-medium text-gray-700 mb-1">
                                            Giới tính
                                        </label>
                                        <select
                                            id="pet-gender"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                            value={petForm.gender}
                                            onChange={(e) => handleInputChange('gender', e.target.value)}
                                        >
                                            <option value="">Chọn giới tính</option>
                                            <option value="male">Đực</option>
                                            <option value="female">Cái</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="pet-dob" className="block text-sm font-medium text-gray-700 mb-1">
                                            Ngày sinh
                                        </label>
                                        <input
                                            id="pet-dateOfBirth"
                                            type="date"
                                            max={new Date().toISOString().split('T')[0]}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none ${
                                                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            value={petForm.dateOfBirth}
                                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                        />
                                        {errors.dateOfBirth && (
                                            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ảnh đại diện
                                        </label>
                                        
                                        {/* Upload Method Selection */}
                                        <div className="flex gap-2 mb-3">
                                            <button
                                                type="button"
                                                onClick={() => setAvatarUploadMethod('file')}
                                                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                                                    avatarUploadMethod === 'file'
                                                        ? 'bg-teal-600 text-white border-teal-600'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                📁 Upload File
                                            </button>
                                     
                                        </div>

                                        {/* File Upload */}
                                        {avatarUploadMethod === 'file' && (
                                            <div className="space-y-3">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileUpload}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                                                />
                                                {avatarPreview && (
                                                    <div className="mt-2">
                                                        <p className="text-xs text-gray-600 mb-1">Preview:</p>
                                                        <img
                                                            src={avatarPreview}
                                                            alt="Avatar preview"
                                                            className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* URL Input */}
                                        {avatarUploadMethod === 'url' && (
                                            <div className="space-y-3">
                                                <input
                                                    id="pet-avatar_url"
                                                    type="url"
                                                    placeholder="https://example.com/image.jpg"
                                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none ${
                                                        errors.avatar_url ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    value={petForm.avatar_url}
                                                    onChange={(e) => handleUrlChange(e.target.value)}
                                                />
                                                {errors.avatar_url && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.avatar_url}</p>
                                                )}
                                                {petForm.avatar_url && !errors.avatar_url && (
                                                    <div className="mt-2">
                                                        <p className="text-xs text-gray-600 mb-1">Preview:</p>
                                                        <img
                                                            src={petForm.avatar_url}
                                                            alt="Avatar preview"
                                                            className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                const errorDiv = e.currentTarget.nextElementSibling as HTMLElement;
                                                                if (errorDiv) errorDiv.style.display = 'block';
                                                            }}
                                                        />
                                                        <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center text-xs text-gray-500" style={{display: 'none'}}>
                                                            Invalid URL
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>


                                </div>
                                {/* Kết thúc grid hai cột */}
                            </div>

                            {/* Preview thẻ căn cước - Đặt cuối cùng */}
                            <div className="mt-10 flex flex-col items-center">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Xem trước thẻ căn cước</h3>
                                <div className="perspective-1000">
                                    <div
                                        className="relative cursor-pointer"
                                        style={{ width: '500px', height: '320px' }}
                                        onClick={() => setIsFlipped(!isFlipped)}
                                    >
                                        <motion.div
                                            className="w-full h-full"
                                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                                            transition={{ duration: 0.6 }}
                                            style={{ transformStyle: 'preserve-3d' }}
                                        >
                                            <div
                                                className="absolute backface-hidden"
                                                style={{
                                                    backfaceVisibility: 'hidden',
                                                    width: '500px',
                                                    height: '320px'
                                                }}
                                            >
                                                <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-2xl p-6 h-full text-gray-800 overflow-hidden border-2 border-gray-400">
                                                    <div className="absolute inset-0 opacity-5">
                                                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                            <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                                                <circle cx="10" cy="10" r="2" fill="currentColor" />
                                                            </pattern>
                                                            <rect width="100" height="100" fill="url(#pattern)" />
                                                        </svg>
                                                    </div>

                                                    <div className="relative z-10">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="flex items-center">
                                                                <div className="w-8 h-8 bg-gray-300 rounded mr-2"></div>
                                                                <div>
                                                                    <h3 className="text-xl font-bold text-gray-900">PETTOPIA</h3>
                                                                    <p className="text-xs text-gray-700">Pet Identity Card</p>
                                                                </div>
                                                            </div>
                                                            <div className="bg-white rounded-lg px-2 py-1 border border-gray-400">
                                                                <p className="text-xs text-gray-700">
                                                                    ID: {'SAMPLE-' + 'ABCD'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-gray-400 overflow-hidden">
                                                                {getCurrentAvatarSrc() ? (
                                                                    <img
                                                                        src={getCurrentAvatarSrc()}
                                                                        alt="Pet"
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.currentTarget.style.display = 'none';
                                                                            const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
                                                                            if (sibling) sibling.style.display = 'block';
                                                                        }}
                                                                    />
                                                                ) : null}
                                                                <svg
                                                                    className="w-12 h-12 text-gray-600"
                                                                    style={{ display: getCurrentAvatarSrc() ? 'none' : 'block' }}
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                                </svg>
                                                            </div>

                                                            <div className="flex-1">
                                                                <h4 className="text-2xl font-bold mb-3 text-gray-900">
                                                                    {petForm.name || 'Tên thú cưng'}
                                                                </h4>
                                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                                    <div>
                                                                        <p className="text-gray-700">Loài:</p>
                                                                        <p className="font-semibold text-gray-900">{petForm.species || '---'}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-700">Màu lông:</p>
                                                                        <p className="font-semibold text-gray-900">{petForm.color || '---'}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-700">Giới tính:</p>
                                                                        <p className="font-semibold text-gray-900">
                                                                            {petForm.gender === 'male' ? 'Đực' : petForm.gender === 'female' ? 'Cái' : '---'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 pt-4 border-t-2 border-gray-400">
                                                            <p className="text-xs text-gray-700 text-center">Click để xem mặt sau</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Back of card */}
                                            <div
                                                className="absolute backface-hidden"
                                                style={{
                                                    backfaceVisibility: 'hidden',
                                                    transform: 'rotateY(180deg)',
                                                    width: '500px',
                                                    height: '320px'
                                                }}
                                            >
                                                <div className="relative bg-gradient-to-br from-gray-300 to-gray-200 rounded-2xl shadow-2xl p-6 h-full text-gray-800 overflow-hidden border-2 border-gray-400">
                                                    <div className="absolute inset-0 opacity-5">
                                                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                            <pattern id="pattern2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                                                <circle cx="10" cy="10" r="2" fill="currentColor" />
                                                            </pattern>
                                                            <rect width="100" height="100" fill="url(#pattern2)" />
                                                        </svg>
                                                    </div>

                                                    <div className="relative z-10">
                                                        <div className="flex items-center mb-4">
                                                            <div className="w-8 h-8 bg-gray-300 rounded mr-2"></div>
                                                            <h3 className="text-lg font-bold text-gray-900">Thông tin chi tiết</h3>
                                                        </div>

                                                        <div className="space-y-2 text-xs">
                                                            <div className="flex justify-between border-b-2 border-gray-400 pb-2">
                                                                <span className="text-gray-700">Giống:</span>
                                                                <span className="font-semibold text-gray-900">{petForm.breed || '---'}</span>
                                                            </div>
                                                            <div className="flex justify-between border-b-2 border-gray-400 pb-2">
                                                                <span className="text-gray-700">Cân nặng:</span>
                                                                <span className="font-semibold text-gray-900">{petForm.weight ? `${petForm.weight} kg` : '---'}</span>
                                                            </div>
                                                            <div className="flex justify-between border-b-2 border-gray-400 pb-2">
                                                                <span className="text-gray-700">Ngày sinh:</span>
                                                                <span className="font-semibold text-gray-900">
                                                                    {petForm.dateOfBirth ? new Date(petForm.dateOfBirth).toLocaleDateString('vi-VN') : '---'}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between border-b-2 border-gray-400 pb-2">
                                                                <span className="text-gray-700">Thành phố:</span>
                                                                <span className="font-semibold text-gray-900">{petForm.city || '---'}</span>
                                                            </div>
                                                            <div className="flex justify-between border-b-2 border-gray-400 pb-2">
                                                                <span className="text-gray-700">Quận/Huyện:</span>
                                                                <span className="font-semibold text-gray-900">{petForm.district || '---'}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-700">Phường/Xã:</span>
                                                                <span className="font-semibold text-gray-900">{petForm.ward || '---'}</span>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 pt-4 border-t-2 border-gray-400">
                                                            <p className="text-xs text-gray-700 text-center">Click để xem mặt trước</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {serverError && (
                                <div className="mt-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md">
                                    <div className="flex items-start">
                                        <svg className="w-6 h-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                        </svg>
                                        <div className="flex-1">
                                            <h3 className="text-base font-semibold text-red-800 mb-1">❌ Không thể tạo thú cưng</h3>
                                            <p className="text-sm text-red-700 mb-2">{serverError}</p>
                                            {Object.keys(errors).length > 0 && (
                                                <div className="mt-3 bg-red-100 rounded-md p-3">
                                                    <p className="text-xs font-semibold text-red-800 mb-2">Chi tiết lỗi:</p>
                                                    <ul className="space-y-1">
                                                        {Object.entries(errors).map(([field, error], idx) => (
                                                            <li key={idx} className="text-sm text-red-700 flex items-start">
                                                                <span className="mr-2">•</span>
                                                                <span>
                                                                    <strong className="font-medium">{field}:</strong> {error}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            <div className="mt-3 flex items-center gap-2 text-xs text-red-600">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                                                </svg>
                                                <span>Ảnh của bạn có thể quá dung lượng. Hoặc thiếu trường bắt buộc.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                                <Link href="/" className="flex-1">
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                                    >
                                        Hủy bỏ
                                    </button>
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2 ${isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700'
                                        }`}
                                >
                                    {isSubmitting && (
                                        <Spinner size="sm" color="white" />
                                    )}
                                    {isSubmitting ? 'Đang xử lý...' : 'Đăng ký thú cưng'}
                                </button>
                            </div>
                        </div>
                    </form>
            </div>
        </>
    );
}