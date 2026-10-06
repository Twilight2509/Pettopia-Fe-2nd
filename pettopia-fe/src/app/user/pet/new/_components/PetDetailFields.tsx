'use client'
import React from 'react';
import type { AvatarUploadMethod, FieldErrors, PetForm } from '../_types';

interface Props {
    petForm: PetForm;
    errors: FieldErrors;
    onChange: (field: string, value: string) => void;
    avatarUploadMethod: AvatarUploadMethod;
    setAvatarUploadMethod: (method: AvatarUploadMethod) => void;
    avatarPreview: string;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUrlChange: (url: string) => void;
}

export default function PetDetailFields({
    petForm,
    errors,
    onChange,
    avatarUploadMethod,
    setAvatarUploadMethod,
    avatarPreview,
    fileInputRef,
    onFileUpload,
    onUrlChange,
}: Props) {
    return (
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
                    onChange={(e) => onChange('weight', e.target.value)}
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
                    onChange={(e) => onChange('gender', e.target.value)}
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
                    onChange={(e) => onChange('dateOfBirth', e.target.value)}
                />
                {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh đại diện
                </label>

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

                {avatarUploadMethod === 'file' && (
                    <div className="space-y-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={onFileUpload}
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
                            onChange={(e) => onUrlChange(e.target.value)}
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
    );
}
