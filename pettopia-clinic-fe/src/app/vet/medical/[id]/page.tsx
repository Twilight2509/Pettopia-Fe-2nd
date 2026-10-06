'use client';

import { ArrowLeft } from 'lucide-react';
import { Spinner } from '@/components/ui';
import { useMedicalRecord } from './_hooks/useMedicalRecord';
import AppointmentInfoCard from './_components/AppointmentInfoCard';
import PetHistoryCard from './_components/PetHistoryCard';
import MedicalRecordModal from './_components/MedicalRecordModal';

export default function VetMedicalRecordDetailPage() {
  const m = useMedicalRecord();
  const { router, appointmentDetail, petDetail } = m;

  if (m.loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="md" color="teal" />
          <p className="text-gray-600">Đang tải chi tiết...</p>
        </div>
      </div>
    );
  }

  if (!appointmentDetail) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-4 font-medium"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">Không tìm thấy thông tin lịch hẹn</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" p-4 md:p-8">
      <div className="">
        <button
          onClick={() => router.back()}
          className="flex gap-2 text-teal-600 hover:text-teal-700 mb-2 font-medium"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <AppointmentInfoCard
          appointmentDetail={appointmentDetail}
          completing={m.completing}
          onComplete={m.handleCompleteAppointment}
        />

        {petDetail && (
          <PetHistoryCard
            petDetail={petDetail}
            medicalRecords={m.medicalRecords}
            hasRecord={m.hasRecord}
            onOpenRecord={() => m.setShowMedicalModal(true)}
          />
        )}

        <MedicalRecordModal m={m} />
      </div>
    </div>
  );
}
