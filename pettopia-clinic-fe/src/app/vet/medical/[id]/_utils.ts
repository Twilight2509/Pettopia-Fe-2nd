import type { Medication, VetPetMedicalRecord } from '@/services/partner/veterianrianService';

export const countWords = (text: string) => text.trim().split(/\s+/).filter(word => word.length > 0).length;

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const findRecordForAppointment = (
  records: VetPetMedicalRecord[],
  medicalRecordId: string | undefined,
  appointmentId: string,
) => {
  const byId = medicalRecordId
    ? records.find(
      (mr) => mr.medicalRecord?.id === medicalRecordId || mr.medicalRecord?._id === medicalRecordId
    )
    : undefined;
  if (byId?.medicalRecord) return byId;
  return records.find((mr) => mr.medicalRecord?.appointment_id === appointmentId);
};

export const validateMedicalRecord = (
  symptoms: string,
  diagnosis: string,
  notes: string,
  medications: Medication[],
): string | null => {
  if (!symptoms.trim()) return 'Triệu chứng không được để trống';
  if (!diagnosis.trim()) return 'Chẩn đoán không được để trống';
  if (countWords(symptoms) > 50) return 'Triệu chứng không được vượt quá 50 từ';
  if (countWords(diagnosis) > 50) return 'Chẩn đoán không được vượt quá 50 từ';
  if (countWords(notes) > 50) return 'Ghi chú không được vượt quá 50 từ';
  if (medications.length === 0) return 'Đơn thuốc không được để trống';

  for (const med of medications) {
    if (countWords(med.medication_name) > 20) return 'Tên thuốc không được vượt quá 20 từ';
    if (countWords(med.dosage) > 20) return 'Liều lượng không được vượt quá 20 từ';
    if (countWords(med.instructions || '') > 20) return 'Hướng dẫn sử dụng không được vượt quá 20 từ';
  }

  return null;
};
