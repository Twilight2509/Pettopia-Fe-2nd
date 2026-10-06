import type { Clinic, Service, Shift } from '@/services/petcare/petService';
import type { Pet } from '../_types';
import { formatAddress, formatDate, formatShiftName } from '../_utils';

interface Props {
  clinic: Clinic;
  selectedDate: string;
  shifts: Shift[];
  selectedShift: string;
  selectedPet: string;
  pets: Pet[];
  selectedServices: string[];
  services: Service[];
  total: number;
}

export default function ConfirmStep({
  clinic,
  selectedDate,
  shifts,
  selectedShift,
  selectedPet,
  pets,
  selectedServices,
  services,
  total,
}: Props) {
  const shift = shifts.find(s => s.id === selectedShift);
  const pet = selectedPet ? pets.find(p => p.id === selectedPet) : undefined;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8 text-center">Xác nhận đặt lịch</h2>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-bold text-base mb-3">Phòng khám</h3>
          <p className="text-lg font-bold">{clinic.clinic_name}</p>
          <p className="text-gray-600 text-sm mt-1">{formatAddress(clinic.address)}</p>
          <p className="text-gray-600 text-sm">Điện thoại: {clinic.phone.phone_number}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-bold text-base mb-3">Thời gian khám</h3>
          <p className="text-base">
            Ngày: <span className="font-bold text-teal-600">{formatDate(selectedDate)}</span>
          </p>
          <p className="text-base mt-2">
            Ca: <span className="font-bold text-teal-600">
              {formatShiftName(shift?.shift || '')}
            </span>
            {' '}({shift?.start_time} - {shift?.end_time})
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-bold text-base mb-3">Thú cưng</h3>
          {selectedPet ? (
            pet ? (
              <div className="flex items-center gap-3">
                <img
                  src={pet.avatar_url || '/sampleimg/default-pet.jpg'}
                  alt={pet.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">{pet.name}</p>
                  <p className="text-sm text-gray-600">{pet.species} • {pet.breed}</p>
                </div>
              </div>
            ) : null
          ) : (
            <p className="text-gray-500 italic">Không chọn thú cưng cụ thể</p>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-bold text-base mb-4">Chi tiết dịch vụ</h3>
          {selectedServices.length > 0 ? (
            <div className="space-y-2">
              {selectedServices.map(sId => {
                const service = services.find(s => s.id === sId);
                if (!service) return null;
                return (
                  <div key={sId} className="flex justify-between py-1 text-sm">
                    <span>• {service.name}</span>
                    <span className="font-semibold text-teal-600">
                      {service.price.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">Chưa có dịch vụ nào</p>
          )}
        </div>

        <div className="flex justify-between items-end pt-6 border-t-2 border-dashed border-black mt-8">
          <div>
            <p className="font-bold text-xl">Chi phí dự tính</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tracking-wider">
              {total.toLocaleString('vi-VN')} ₫
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
