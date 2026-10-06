'use client';

import { Calendar, ClipboardList, User, Phone } from 'lucide-react';
import type { VetAppointmentDetail } from '@/services/partner/veterianrianService';
import { Spinner } from '@/components/ui';
import { formatDate } from '../_utils';

interface AppointmentInfoCardProps {
  appointmentDetail: VetAppointmentDetail;
  completing: boolean;
  onComplete: () => void;
}

export default function AppointmentInfoCard({ appointmentDetail, completing, onComplete }: AppointmentInfoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin lịch hẹn</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={18} />
            <span>{formatDate(appointmentDetail.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium">Ca:</span>
            <span>{appointmentDetail.shift}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Khách hàng</h3>
          {appointmentDetail.user_info && (
            <>
              <div className="flex items-center gap-2 text-gray-600">
                <User size={16} />
                <span>{appointmentDetail.user_info.fullname}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Phone size={16} />
                <span>{appointmentDetail.user_info.phone_number}</span>
              </div>
            </>
          )}
        </div>

        {appointmentDetail.pet_infos && appointmentDetail.pet_infos.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Thú cưng</h3>
            {appointmentDetail.pet_infos.map((pet) => (
              <div key={pet.id} className="bg-gray-50 rounded-lg p-3 mb-2">
                <p className="font-medium text-gray-900">{pet.name}</p>
                <p className="text-sm text-gray-600">
                  {pet.species} {pet.breed ? `- ${pet.breed}` : ''}
                </p>
              </div>
            ))}
          </div>
        )}

        {appointmentDetail.service_infos && appointmentDetail.service_infos.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Dịch vụ</h3>
            {appointmentDetail.service_infos.map((service, index) => (
              <div key={service.id || index} className="bg-gray-50 rounded-lg p-3 mb-2">
                <p className="font-medium text-gray-900">{service.name}</p>
                {service.description && (
                  <p className="text-sm text-gray-600">{service.description}</p>
                )}
                {service.price && (
                  <p className="text-sm text-gray-600 mt-1">
                    Giá: {service.price.toLocaleString('vi-VN')} VNĐ
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onComplete}
              disabled={completing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {completing ? (
                <>
                  <Spinner size="xs" color="white" />
                  Đang hoàn thành...
                </>
              ) : (
                <>
                  <ClipboardList size={16} />
                  Hoàn thành lịch hẹn
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
