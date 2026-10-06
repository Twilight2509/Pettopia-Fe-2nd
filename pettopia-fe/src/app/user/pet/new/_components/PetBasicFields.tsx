'use client'
import type { FieldErrors, PetForm } from '../_types';
import { COMMON_COLORS } from '../_utils';

interface Props {
    petForm: PetForm;
    errors: FieldErrors;
    onChange: (field: string, value: string) => void;
}

export default function PetBasicFields({ petForm, errors, onChange }: Props) {
    return (
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
                        onChange={(e) => onChange('name', e.target.value)}
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
                    onChange={(e) => onChange('species', e.target.value)}
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
                    onChange={(e) => onChange('breed', e.target.value)}
                />
                {errors.breed && (
                    <p className="mt-1 text-sm text-red-600">{errors.breed}</p>
                )}
            </div>

            <div>
                <label htmlFor="pet-color" className="block text-sm font-medium text-gray-700 mb-1">
                    Màu sắc
                </label>

                <div className="grid grid-cols-4 gap-2 mb-2">
                    {COMMON_COLORS.map((color) => (
                        <button
                            key={color.value}
                            type="button"
                            onClick={() => onChange('color', color.value)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                                petForm.color === color.value
                                    ? 'border-teal-600 bg-teal-50'
                                    : 'border-gray-200 hover:border-teal-300'
                            }`}
                        >
                            <div
                                className="w-5 h-5 rounded-full border border-gray-300"
                                style={{
                                    background: color.hex,
                                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                                }}
                            />
                            <span className="text-xs font-medium">{color.name}</span>
                        </button>
                    ))}
                </div>

                <input
                    id="pet-color"
                    type="text"
                    placeholder="Hoặc nhập màu khác..."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none ${
                        errors.color ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={petForm.color}
                    onChange={(e) => onChange('color', e.target.value)}
                />
                {errors.color && (
                    <p className="mt-1 text-sm text-red-600">{errors.color}</p>
                )}
            </div>
        </div>
    );
}
