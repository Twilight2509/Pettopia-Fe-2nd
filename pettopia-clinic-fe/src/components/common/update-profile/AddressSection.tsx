'use client';

import React from "react";
import { Home, Edit3 } from 'lucide-react';
import type { ProfileFormData } from "./types";
import type { AddressFields } from "./useAddressFields";

interface AddressSectionProps {
  formData: ProfileFormData;
  address: AddressFields;
}

const LABEL = "block text-sm font-semibold text-gray-900 mb-2";
const SELECT = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white";

interface AreaSelectProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  loading: boolean;
  options: { code: string; name: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function AreaSelect({ id, label, placeholder, value, loading, options, onChange }: AreaSelectProps) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <select id={id} value={value} onChange={onChange} disabled={loading} className={SELECT}>
        <option value="">
          {loading ? "Đang tải..." : options.length === 0 ? "Không có dữ liệu" : placeholder}
        </option>
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function AddressSection({ formData, address }: AddressSectionProps) {
  const {
    provinces,
    districts,
    wards,
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingWards,
    isEditingAddress,
    selectedCityCode,
    selectedDistrictCode,
  } = address;

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Địa chỉ</h3>
        {!isEditingAddress && (
          <button
            type="button"
            onClick={address.handleEditAddress}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
          >
            <Edit3 className="w-4 h-4" />
            Chỉnh sửa địa chỉ
          </button>
        )}
      </div>

      {!isEditingAddress ? (
        <div className="space-y-2">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Home className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-900 leading-relaxed">
                {formData.address.city || formData.address.district || formData.address.ward || formData.address.description ? (
                  <div>
                    {[formData.address.description, formData.address.ward, formData.address.district, formData.address.city]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                ) : (
                  <span className="text-gray-400">Chưa cập nhật địa chỉ</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AreaSelect
              id="city"
              label="Tỉnh/Thành phố"
              placeholder="Chọn Tỉnh/Thành phố"
              value={selectedCityCode}
              loading={isLoadingProvinces}
              options={provinces}
              onChange={address.handleCityChange}
            />

            {selectedCityCode && (
              <AreaSelect
                id="district"
                label="Quận/Huyện"
                placeholder="Chọn Quận/Huyện"
                value={selectedDistrictCode}
                loading={isLoadingDistricts}
                options={districts}
                onChange={address.handleDistrictChange}
              />
            )}
          </div>

          {selectedDistrictCode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AreaSelect
                id="ward"
                label="Phường/Xã"
                placeholder="Chọn Phường/Xã"
                value={wards.find(w => w.name === formData.address.ward)?.code || ''}
                loading={isLoadingWards}
                options={wards}
                onChange={address.handleWardChange}
              />

              <div>
                <label htmlFor="address-description" className={LABEL}>
                  Chi tiết
                </label>
                <input
                  type="text"
                  id="address-description"
                  value={formData.address.description}
                  onChange={address.handleAddressDescriptionChange}
                  placeholder="Số nhà, tên đường..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={address.handleCancelEditAddress}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
