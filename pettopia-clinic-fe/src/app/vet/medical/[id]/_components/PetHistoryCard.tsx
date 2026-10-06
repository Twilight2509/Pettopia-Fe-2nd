'use client';

import { Calendar, FileText, User, Phone } from 'lucide-react';
import type { VetPetDetail, VetPetMedicalRecord } from '@/services/partner/veterianrianService';
import { formatDate } from '../_utils';

interface PetHistoryCardProps {
  petDetail: VetPetDetail;
  medicalRecords: VetPetMedicalRecord[];
  hasRecord: boolean;
  onOpenRecord: () => void;
}

export default function PetHistoryCard({ petDetail, medicalRecords, hasRecord, onOpenRecord }: PetHistoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Thông tin thú cưng</h2>
          <p className="text-gray-600 text-sm">
            {petDetail.name} • {petDetail.species}
            {petDetail.breed ? ` • ${petDetail.breed}` : ''}
          </p>
        </div>
        {petDetail.owner && (
          <div className="text-right text-sm text-gray-600">
            <p className="font-medium flex items-center justify-end gap-1">
              <User size={14} />
              {petDetail.owner.fullname}
            </p>
            {petDetail.owner.phone && (
              <p className="flex items-center justify-end gap-1 mt-1">
                <Phone size={14} />
                {petDetail.owner.phone}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Lịch sử hồ sơ bệnh án
        </h3>

        {medicalRecords && medicalRecords.length > 0 ? (
          <div className="space-y-3">
            {medicalRecords.map((mr) => (
              <div
                key={mr.medicalRecord.id || mr.medicalRecord._id}
                className="border border-gray-100 rounded-lg p-3 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900">
                    {mr.medicalRecord.diagnosis || 'Chẩn đoán không xác định'}
                  </p>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    {formatDate(mr.medicalRecord.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Triệu chứng:</span>{' '}
                  {mr.medicalRecord.symptoms}
                </p>
                {mr.medicalRecord.notes && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Ghi chú:</span> {mr.medicalRecord.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Chưa có hồ sơ bệnh án nào cho thú cưng này.
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onOpenRecord}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            <FileText size={16} />
            {hasRecord ? 'Cập nhật hồ sơ bệnh án' : 'Tạo hồ sơ bệnh án'}
          </button>
        </div>
      </div>
    </div>
  );
}
