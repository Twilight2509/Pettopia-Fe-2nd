'use client'
import { motion } from 'framer-motion';
import type { PetForm } from '../_types';

interface Props {
    petForm: PetForm;
    isFlipped: boolean;
    onToggle: () => void;
    avatarSrc: string;
}

export default function PetIdCardPreview({ petForm, isFlipped, onToggle, avatarSrc }: Props) {
    return (
        <div className="mt-10 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Xem trước thẻ căn cước</h3>
            <div className="perspective-1000">
                <div
                    className="relative cursor-pointer"
                    style={{ width: '500px', height: '320px' }}
                    onClick={onToggle}
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
                                            {avatarSrc ? (
                                                <img
                                                    src={avatarSrc}
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
                                                style={{ display: avatarSrc ? 'none' : 'block' }}
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
    );
}
