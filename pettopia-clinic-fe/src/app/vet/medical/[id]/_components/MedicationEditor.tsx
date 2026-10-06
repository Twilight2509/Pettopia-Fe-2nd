'use client';

import { Pill, Plus, X } from 'lucide-react';
import type { Medication } from '@/services/partner/veterianrianService';

interface MedicationEditorProps {
  medications: Medication[];
  medName: string;
  setMedName: (value: string) => void;
  medDosage: string;
  setMedDosage: (value: string) => void;
  medInstructions: string;
  setMedInstructions: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const INPUT = 'px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm';

export default function MedicationEditor({
  medications,
  medName,
  setMedName,
  medDosage,
  setMedDosage,
  medInstructions,
  setMedInstructions,
  onAdd,
  onRemove,
}: MedicationEditorProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
          <Pill className="text-purple-600" size={18} />
        </div>
        <h2 className="text-base font-semibold">Đơn Thuốc <span className="text-red-500">*</span></h2>
        <p className="text-xs text-gray-500 mt-1">Bắt buộc phải có ít nhất một loại thuốc</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
        <p className="text-xs text-blue-700">
          <strong>Lưu ý:</strong> Tên thuốc, liều lượng và hướng dẫn sử dụng đều không được vượt quá 20 từ để đảm bảo thông tin súc tích và chính xác.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-3">
        <div className="grid md:grid-cols-3 gap-3">
          <input
            type="text"
            value={medName}
            onChange={(e) => setMedName(e.target.value)}
            placeholder="Tên thuốc"
            className={INPUT}
          />
          <input
            type="text"
            value={medDosage}
            onChange={(e) => setMedDosage(e.target.value)}
            placeholder="Liều lượng"
            className={INPUT}
          />
          <input
            type="text"
            value={medInstructions}
            onChange={(e) => setMedInstructions(e.target.value)}
            placeholder="Hướng dẫn sử dụng"
            className={INPUT}
          />
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm"
        >
          <Plus size={16} />
          Thêm thuốc
        </button>
      </div>

      {medications.length > 0 && (
        <div className="space-y-3">
          {medications.map((med, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {med.medication_name}
                  </h3>
                  <p className="text-gray-600">
                    <span className="font-medium">Liều lượng:</span> {med.dosage}
                  </p>
                  {med.instructions && (
                    <p className="text-gray-600 mt-1">
                      <span className="font-medium">Hướng dẫn:</span>{' '}
                      {med.instructions}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
