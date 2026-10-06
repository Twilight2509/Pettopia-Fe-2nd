'use client'

import type { Shift } from '@/services/petcare/petService';
import { formatDate, formatShiftName, getMinDate, isShiftPast } from '../_utils';

interface Props {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  shiftsLoading: boolean;
  shifts: Shift[];
  selectedShift: string;
  setSelectedShift: (id: string) => void;
}

export default function DateShiftStep({
  selectedDate,
  setSelectedDate,
  shiftsLoading,
  shifts,
  selectedShift,
  setSelectedShift,
}: Props) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold mb-6">Chọn ngày khám</h2>
        <input
          type="date"
          min={getMinDate()}
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="max-w-xs w-full px-4 py-3 text-base border-2 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
        />
        {selectedDate && <p className="mt-3 text-teal-600 font-medium">Ngày chọn: {formatDate(selectedDate)}</p>}
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Chọn ca khám</h3>
        {shiftsLoading ? (
          <p className="text-center py-8 text-gray-500">Đang tải ca làm việc...</p>
        ) : shifts.length === 0 ? (
          <p className="text-center py-8 text-orange-600">Phòng khám chưa có ca làm việc - Tính năng hỗ trợ ca đang phát triển liên hệ sau</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {shifts.map(shift => {
              const disabled = isShiftPast(shift, selectedDate);
              return (
                <div
                  key={shift.id}
                  onClick={() => {
                    if (disabled) return;
                    setSelectedShift(shift.id);
                  }}
                  aria-disabled={disabled}
                  className={`p-5 rounded-xl border-2 text-center transition-all ${disabled ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' : selectedShift === shift.id ? 'border-teal-600 bg-teal-50 shadow-md' : 'border-gray-300 hover:border-gray-400 cursor-pointer'}`}
                >
                  <h4 className="text-lg font-bold text-gray-700">{formatShiftName(shift.shift)}</h4>
                  <p className={`text-xl font-bold mt-2 ${disabled ? 'opacity-60' : ''}`}>{shift.start_time} - {shift.end_time}</p>
                  {disabled && <p className="text-xs text-red-500 mt-2">Ca đã kết thúc</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
