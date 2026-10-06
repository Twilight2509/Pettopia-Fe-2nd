'use client';

import React from "react";
import type { ProfileFormData } from "../_types";

interface Props {
  formData: ProfileFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileBasicFields({ formData, onChange }: Props) {
  return (
    <>
      <div>
        <label htmlFor="fullname" className="block text-sm font-semibold text-gray-900 mb-2">
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="fullname"
            name="fullname"
            value={formData.fullname}
            onChange={onChange}
            placeholder="Nhập họ và tên"
            maxLength={50}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-2.5 text-xs text-gray-500">
            {formData.fullname.length}/50
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">7-50 ký tự, chỉ chữ cái và khoảng trắng</p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Nhập email"
          readOnly={true}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">Email không thể chỉnh sửa</p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
          Số điện thoại
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="Nhập số điện thoại"
          readOnly={true}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">Số điện thoại không thể chỉnh sửa</p>
      </div>

      <div>
        <label htmlFor="dob" className="block text-sm font-semibold text-gray-900 mb-2">
          Ngày sinh
        </label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={formData.dob}
          onChange={onChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>
    </>
  );
}
