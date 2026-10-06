'use client';

import React from "react";
import type { ProfileFormData } from "./types";

interface BasicInfoFieldsProps {
  formData: ProfileFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LABEL = "block text-sm font-semibold text-gray-900 mb-2";
const INPUT = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent";

export default function BasicInfoFields({ formData, onChange }: BasicInfoFieldsProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <div>
        <label htmlFor="fullname" className={LABEL}>
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          value={formData.fullname}
          onChange={onChange}
          placeholder="Nhập họ và tên"
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="email" className={LABEL}>
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Nhập email"
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="phone" className={LABEL}>
          Số điện thoại
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="Nhập số điện thoại"
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="dob" className={LABEL}>
          Ngày sinh
        </label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={formData.dob}
          onChange={onChange}
          max={today}
          className={INPUT}
        />
      </div>
    </>
  );
}
