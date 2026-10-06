'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  updateMedicalRecord,
  getVetPetDetail,
  getVetAppointmentDetail,
  completeAppointment,
  getPetMedicalRecords,
  createMedicalRecord,
  type MedicalRecordPayload,
  type Medication,
  type VetPetDetail,
  type VetPetMedicalRecord,
  type VetAppointmentDetail,
} from '@/services/partner/veterianrianService';
import { useToast } from '@/contexts/ToastContext';
import { findRecordForAppointment, validateMedicalRecord } from '../_utils';

export function useMedicalRecord() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.id as string;
  const { showSuccess, showError } = useToast();

  const [appointmentDetail, setAppointmentDetail] = useState<VetAppointmentDetail | null>(null);
  const [petDetail, setPetDetail] = useState<VetPetDetail | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<VetPetMedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingRecord, setExistingRecord] = useState<any>(null);
  const [hasRecord, setHasRecord] = useState(false);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [completing, setCompleting] = useState(false);

  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);

  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medInstructions, setMedInstructions] = useState('');

  useEffect(() => {
    if (appointmentId) {
      fetchData();
    }
  }, [appointmentId]);

  const resetRecordForm = () => {
    setExistingRecord(null);
    setHasRecord(false);
    setSymptoms('');
    setDiagnosis('');
    setNotes('');
    setMedications([]);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getVetAppointmentDetail(appointmentId);
      if (response.status === 'success' && response.data) {
        const detail = response.data;
        setAppointmentDetail(detail);

        const petId = detail?.pet_infos?.[0]?.id;
        if (petId) {
          const medicalRecordId = detail?.pet_infos?.[0]?.medical_records?.[0];
          console.log('Medical Record ID from appointment:', medicalRecordId);

          await fetchPetDetail(petId);
        } else {
          setPetDetail(null);
          setMedicalRecords([]);
          resetRecordForm();
        }
      }
    } catch (error: any) {
      console.error('Lỗi khi lấy chi tiết appointment:', error);
      showError(error?.response?.data?.message || 'Không thể tải chi tiết lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const fetchPetDetail = async (petId: string) => {
    try {
      const data = await getVetPetDetail(petId);
      setPetDetail(data);

      const medicalRecordsResponse = await getPetMedicalRecords(petId);
      const records = medicalRecordsResponse.data || [];
      setMedicalRecords(records);

      const medicalRecordId = appointmentDetail?.pet_infos?.[0]?.medical_records?.[0];
      const found = findRecordForAppointment(records, medicalRecordId, appointmentId);

      if (found?.medicalRecord) {
        const record = found.medicalRecord;
        setExistingRecord(record);
        setHasRecord(true);
        setSymptoms(record.symptoms || '');
        setDiagnosis(record.diagnosis || '');
        setNotes(record.notes || '');
        setMedications(found.medications || []);
      } else {
        resetRecordForm();
      }
    } catch (error: any) {
      console.error('Lỗi khi lấy chi tiết thú cưng:', error);
      showError(error?.response?.data?.message || 'Không thể tải thông tin thú cưng');
    }
  };

  const handleAddMedication = () => {
    if (!medName.trim() || !medDosage.trim()) {
      showError('Vui lòng điền đầy đủ tên thuốc và liều lượng');
      return;
    }

    setMedications([
      ...medications,
      {
        medication_name: medName,
        dosage: medDosage,
        instructions: medInstructions || undefined
      }
    ]);

    setMedName('');
    setMedDosage('');
    setMedInstructions('');
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateMedicalRecord(symptoms, diagnosis, notes, medications);
    if (validationError) {
      showError(validationError);
      return;
    }

    try {
      setSaving(true);
      const payload: MedicalRecordPayload = {
        pet_id: appointmentDetail?.pet_infos?.[0]?.id || '',
        symptoms: symptoms.trim(),
        diagnosis: diagnosis.trim(),
        notes: notes.trim() || undefined,
        medications: medications.length > 0 ? medications : undefined
      };

      if (hasRecord) {
        await updateMedicalRecord(appointmentId, payload);
      } else {
        await createMedicalRecord(appointmentId, payload);
      }
      showSuccess(hasRecord ? 'Cập nhật hồ sơ bệnh án thành công!' : 'Tạo hồ sơ bệnh án thành công!');

      if (petDetail?.id) {
        const updatedHistoryResponse = await getPetMedicalRecords(petDetail.id);
        setMedicalRecords(updatedHistoryResponse.data);
      }
    } catch (error: any) {
      console.error('Lỗi khi tạo/cập nhật hồ sơ bệnh án:', error);
      showError(error?.response?.data?.message || 'Không thể tạo/cập nhật hồ sơ bệnh án');
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteAppointment = async () => {
    try {
      setCompleting(true);
      await completeAppointment(appointmentId);
      showSuccess('Hoàn thành lịch hẹn thành công!');
      router.push('/vet/patients');
    } catch (error: any) {
      console.error('Lỗi khi hoàn thành lịch hẹn:', error);
      showError(error?.response?.data?.message || 'Không thể hoàn thành lịch hẹn');
    } finally {
      setCompleting(false);
    }
  };

  return {
    router,
    appointmentDetail,
    petDetail,
    medicalRecords,
    loading,
    saving,
    existingRecord,
    hasRecord,
    showMedicalModal,
    setShowMedicalModal,
    completing,
    symptoms,
    setSymptoms,
    diagnosis,
    setDiagnosis,
    notes,
    setNotes,
    medications,
    medName,
    setMedName,
    medDosage,
    setMedDosage,
    medInstructions,
    setMedInstructions,
    handleAddMedication,
    handleRemoveMedication,
    handleSubmit,
    handleCompleteAppointment,
  };
}

export type UseMedicalRecordReturn = ReturnType<typeof useMedicalRecord>;
