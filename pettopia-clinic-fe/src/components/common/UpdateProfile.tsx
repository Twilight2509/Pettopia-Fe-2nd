'use client';

import React from "react";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';
import { Spinner } from '@/components/ui';
import { useUpdateProfile } from "./update-profile/useUpdateProfile";
import BasicInfoFields from "./update-profile/BasicInfoFields";
import AddressSection from "./update-profile/AddressSection";

export default function EditProfilePage() {
  const {
    router,
    user,
    formData,
    loading,
    submitting,
    error,
    success,
    address,
    handleInputChange,
    handleSubmit,
  } = useUpdateProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="dark" className="mb-4" />
          <div className="text-sm text-gray-600">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-5">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center max-w-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {error || "Không thể tải thông tin"}
          </h2>
          <Link href="/auth/login">
            <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Đăng nhập
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 ">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <BasicInfoFields formData={formData} onChange={handleInputChange} />

          <AddressSection formData={formData} address={address} />

          <div className="border-t border-gray-200 pt-6 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <Spinner size="xs" color="white" />}
              {submitting ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
