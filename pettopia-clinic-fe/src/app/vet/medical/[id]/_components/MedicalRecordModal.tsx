'use client';

import type { ReactNode } from 'react';
import { Heart, ClipboardList, FileText, Save, X } from 'lucide-react';
import { Spinner } from '@/components/ui';
import type { UseMedicalRecordReturn } from '../_hooks/useMedicalRecord';
import MedicationEditor from './MedicationEditor';

interface MedicalRecordModalProps {
  m: UseMedicalRecordReturn;
}

const TEXTAREA = 'w-full bg-gray-50 rounded-lg p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm';

function SectionHeader({ icon, iconBg, title }: { icon: ReactNode; iconBg: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <h2 className="text-base font-semibold">{title}</h2>
    </div>
  );
}

export default function MedicalRecordModal({ m }: MedicalRecordModalProps) {
  if (!m.showMedicalModal) return null;

  const close = () => m.setShowMedicalModal(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-teal-600 mb-1">
              {m.hasRecord ? 'Cập nhật hồ sơ bệnh án' : 'Tạo hồ sơ bệnh án'}
            </h1>
            <p className="text-gray-600 text-sm">Medical Record</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {m.hasRecord && m.existingRecord && (
          <div className="px-4 py-3 bg-green-50 border-b border-green-200 text-sm text-green-700">
            ✓ Hồ sơ bệnh án đã được tạo trước đó. Bạn có thể chỉnh sửa thông tin bên dưới.
          </div>
        )}

        <form onSubmit={m.handleSubmit} className="p-4 space-y-5">
          <div>
            <SectionHeader icon={<Heart className="text-red-600" size={18} />} iconBg="bg-red-100" title="Triệu Chứng" />
            <textarea
              value={m.symptoms}
              onChange={(e) => m.setSymptoms(e.target.value)}
              className={TEXTAREA}
              rows={4}
              placeholder="Nhập triệu chứng của bệnh nhân..."
            />
          </div>

          <div>
            <SectionHeader icon={<ClipboardList className="text-green-600" size={18} />} iconBg="bg-green-100" title="Chẩn Đoán" />
            <textarea
              value={m.diagnosis}
              onChange={(e) => m.setDiagnosis(e.target.value)}
              className={TEXTAREA}
              rows={4}
              placeholder="Nhập chẩn đoán..."
            />
          </div>

          <MedicationEditor
            medications={m.medications}
            medName={m.medName}
            setMedName={m.setMedName}
            medDosage={m.medDosage}
            setMedDosage={m.setMedDosage}
            medInstructions={m.medInstructions}
            setMedInstructions={m.setMedInstructions}
            onAdd={m.handleAddMedication}
            onRemove={m.handleRemoveMedication}
          />

          <div>
            <SectionHeader icon={<FileText className="text-yellow-600" size={18} />} iconBg="bg-yellow-100" title="Ghi Chú" />
            <textarea
              value={m.notes}
              onChange={(e) => m.setNotes(e.target.value)}
              className={TEXTAREA}
              rows={3}
              placeholder="Ghi chú thêm (tùy chọn)..."
            />
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={m.saving}
              className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {m.saving ? (
                <>
                  <Spinner size="xs" color="white" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {m.hasRecord ? 'Cập nhật hồ sơ bệnh án' : 'Tạo hồ sơ bệnh án'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
