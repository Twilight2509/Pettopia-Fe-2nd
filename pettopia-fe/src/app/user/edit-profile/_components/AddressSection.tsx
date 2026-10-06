'use client';

import React from "react";
import { Home, Edit3 } from 'lucide-react';
import type { District, ProfileFormData, Province, Ward } from "../_types";

interface Props {
  formData: ProfileFormData;
  isEditingAddress: boolean;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  isLoadingProvinces: boolean;
  isLoadingDistricts: boolean;
  isLoadingWards: boolean;
  selectedCityCode: string;
  selectedDistrictCode: string;
  onEditAddress: () => void;
  onCancelEditAddress: () => void;
  onCityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDistrictChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onWardChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDescriptionChange: (value: string) => void;
}

export default function AddressSection({
  formData,
  isEditingAddress,
  provinces,
  districts,
  wards,
  isLoadingProvinces,
  isLoadingDistricts,
  isLoadingWards,
  selectedCityCode,
  selectedDistrictCode,
  onEditAddress,
  onCancelEditAddress,
  onCityChange,
  onDistrictChange,
  onWardChange,
  onDescriptionChange,
}: Props) {
  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Địa chỉ</h3>
        {!isEditingAddress && (
          <button
            type="button"
            onClick={onEditAddress}
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
            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-2">
                Tỉnh/Thành phố
              </label>
              <select
                id="city"
                value={selectedCityCode}
                onChange={onCityChange}
                disabled={isLoadingProvinces}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              >
                <option value="">
                  {isLoadingProvinces ? "Đang tải..." : provinces.length === 0 ? "Không có dữ liệu" : "Chọn Tỉnh/Thành phố"}
                </option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCityCode && (
              <div>
                <label htmlFor="district" className="block text-sm font-semibold text-gray-900 mb-2">
                  Quận/Huyện
                </label>
                <select
                  id="district"
                  value={selectedDistrictCode}
                  onChange={onDistrictChange}
                  disabled={isLoadingDistricts}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                >
                  <option value="">
                    {isLoadingDistricts ? "Đang tải..." : districts.length === 0 ? "Không có dữ liệu" : "Chọn Quận/Huyện"}
                  </option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.code}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {selectedDistrictCode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ward" className="block text-sm font-semibold text-gray-900 mb-2">
                  Phường/Xã
                </label>
                <select
                  id="ward"
                  value={wards.find(w => w.name === formData.address.ward)?.code || ''}
                  onChange={onWardChange}
                  disabled={isLoadingWards}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                >
                  <option value="">
                    {isLoadingWards ? "Đang tải..." : wards.length === 0 ? "Không có dữ liệu" : "Chọn Phường/Xã"}
                  </option>
                  {wards.map((ward) => (
                    <option key={ward.code} value={ward.code}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                  Chi tiết
                </label>
                <input
                  type="text"
                  id="description"
                  value={formData.address.description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  placeholder="Nhập số nhà, đường phố..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancelEditAddress}
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
