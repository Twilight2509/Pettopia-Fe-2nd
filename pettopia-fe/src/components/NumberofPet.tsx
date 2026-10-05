import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getPetsByOwner } from '@/services/petcare/petService';
import { LoadingState } from '@/components/ui';

interface Pet {
    id: string | number;
    name: string;
    species?: string;
    type?: string;
    breed?: string;
    birthDate?: string;
    dateOfBirth?: string;
    weight?: string | number;
    gender?: string;
    image?: string;
    imageUrl?: string;
    photo?: string;
    avatar_url?: string;
    status?: string;
    color?: string;
}

interface PetCardsProps {
    userId: string;
    onPetsLoaded?: (petsCount: number) => void;
}

export default function PetCards({ userId, onPetsLoaded }: PetCardsProps) {
    const router = useRouter();
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | number | null>(null);

    const fetchPets = useCallback(async (signal?: AbortSignal) => {
        try {
            setLoading(true);
            setError(null);
            const petsData = await getPetsByOwner(userId);
            setPets(petsData);
            onPetsLoaded?.(petsData.length);
        } catch (err: any) {
            if (err.name === 'AbortError') return;
            setPets([]);
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
            console.error('Error fetching pets:', err);
        } finally {
            setLoading(false);
        }
    }, [userId, onPetsLoaded]);

    useEffect(() => {
        const controller = new AbortController();
        if (userId) fetchPets(controller.signal);
        return () => controller.abort();
    }, [userId, fetchPets]);

    const getAgeText = (birthDate?: string) => {
        if (!birthDate) return 'Chưa rõ';
        const today = new Date();
        const birth = new Date(birthDate);
        const years = today.getFullYear() - birth.getFullYear();
        const months = today.getMonth() - birth.getMonth();

        if (years === 0) {
            return `${months} tháng tuổi`;
        }
        return `${years} tuổi`;
    };

    const getPetIcon = (species?: string) => {
        const icons: { [key: string]: string } = {
            'dog': '🐕',
            'cat': '🐈',
            'chó': '🐕',
            'mèo': '🐈',
            'rabbit': '🐇',
            'thỏ': '🐇',
            'bird': '🐦',
            'chim': '🐦',
        };
        return icons[species?.toLowerCase() || ''] || '🐾';
    };

    const handlePetClick = (petId: string | number) => {
        router.push(`/user/pet/${petId}`);
    };

    if (loading) {
        return (
            <LoadingState size="xl" message="Đang tải danh sách thú cưng..." className="w-full py-20!" />
        );
    }

    if (error) {
        return (
            <div className="w-full">

                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Có lỗi xảy ra</h3>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                        onClick={() => fetchPets()}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (pets.length === 0) {
        return (
            <div className="w-full">

            </div>
        );
    }

    return (
        <div className="w-full pb-12">
            <div className="flex items-center gap-2 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 text-teal-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>


                <h2 className="text-2xl font-bold text-gray-900">Thú Cưng Của Bạn</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                    <div
                        key={pet.id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                        onMouseEnter={() => setHoveredCard(pet.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{ transform: hoveredCard === pet.id ? 'translateY(-8px)' : 'translateY(0)' }}
                        onClick={() => handlePetClick(pet.id)}
                    >
                        <div className="relative h-48 bg-gradient-to-br from-teal-400 to-cyan-500 overflow-hidden">
                            {pet.image || pet.imageUrl || pet.photo || pet.avatar_url ? (
                                <img
                                    src={pet.image || pet.imageUrl || pet.photo || pet.avatar_url}
                                    alt={pet.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-7xl">
                                    {getPetIcon(pet.species || pet.type)}
                                </div>
                            )}

                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                <span className="text-xs font-semibold text-teal-700">
                                    {pet.status === 'healthy' || pet.status === 'active' ? '✓ Khỏe mạnh' : 'Theo dõi'}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">{getPetIcon(pet.species || pet.type)}</span>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                                    <p className="text-sm text-gray-500 capitalize">
                                        {pet.species || pet.type} • {pet.breed || 'Chưa rõ giống'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <svg
                                        className="w-4 h-4 text-teal-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span className="text-gray-600">
                                        Ngày sinh:{" "}
                                        <span className="font-semibold text-gray-900">
                                            {pet.dateOfBirth
                                                ? new Date(pet.dateOfBirth).toLocaleDateString("vi-VN")
                                                : "Chưa rõ"}
                                        </span>
                                    </span>
                                </div>


                                <div className="flex items-center gap-2 text-sm">
                                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                    </svg>
                                    <span className="text-gray-600">
                                        Cân nặng: <span className="font-semibold text-gray-900">{pet.weight || 'Chưa rõ'} kg</span>
                                    </span>
                                </div>

                                {pet.gender && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="text-gray-600">
                                            Giới tính: <span className="font-semibold text-gray-900 capitalize">
                                                {pet.gender?.toLowerCase() === 'male' ? 'Đực'
                                                    : pet.gender?.toLowerCase() === 'female' ? 'Cái'
                                                        : pet.gender || 'Chưa rõ'}
                                            </span>
                                        </span>
                                    </div>
                                )}

                                {pet.color && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                        </svg>
                                        <span className="text-gray-600">
                                            Màu sắc: <span className="font-semibold text-gray-900 capitalize">{pet.color}</span>
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Thay thế <a> tag bằng button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePetClick(pet.id);
                                }}
                                className="w-full mt-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}