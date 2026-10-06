'use client'

import type { Clinic, ClinicRatingStats } from '@/services/petcare/petService';
import { LoadingState } from '@/components/ui';
import { formatAddress } from '../_utils';

interface Props {
  clinic: Clinic;
  ratingsLoading: boolean;
  clinicRatingStats: ClinicRatingStats | null;
  onClose: () => void;
  onSelect: (clinicId: string) => void;
}

export default function ClinicDetailModal({ clinic, ratingsLoading, clinicRatingStats, onClose, onSelect }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-3xl font-bold text-gray-800">{clinic.clinic_name}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">Thông tin phòng khám</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Địa chỉ</p>
                <p className="font-medium">{formatAddress(clinic.address)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Điện thoại</p>
                <p className="font-medium">{clinic.phone.phone_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{clinic.email.email_address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Giấy phép</p>
                <p className="font-medium">{clinic.license_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Trạng thái</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${clinic.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {clinic.is_active ? 'Hoạt động' : 'Tạm ngừng'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Thống kê đánh giá</h4>
            {ratingsLoading ? (
              <LoadingState size="md" message="Đang tải thống kê..." className="py-8! gap-2!" />
            ) : !clinicRatingStats ? (
              <p className="text-gray-500 italic">Chưa có đánh giá nào</p>
            ) : (
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-8 h-8 ${star <= Math.round(clinicRatingStats.average_stars) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-3xl font-bold text-teal-700">
                      {clinicRatingStats.average_stars.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">
                    {clinicRatingStats.total_ratings} {clinicRatingStats.total_ratings === 1 ? 'đánh giá' : 'đánh giá'}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-teal-200">
                  <p className="text-sm text-gray-600 text-center">
                    Dựa trên {clinicRatingStats.total_ratings} {clinicRatingStats.total_ratings === 1 ? 'đánh giá' : 'đánh giá'} từ khách hàng
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={() => onSelect(clinic.id)}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition"
          >
            Chọn phòng khám này
          </button>
        </div>
      </div>
    </div>
  );
}
