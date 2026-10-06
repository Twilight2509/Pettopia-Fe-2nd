'use client'

import type { Service } from '@/services/petcare/petService';
import type { Pet } from '../_types';
import { CHECK_ICON_PATH, formatDuration } from '../_utils';

interface Props {
  servicesLoading: boolean;
  services: Service[];
  selectedPet: string;
  pets: Pet[];
  skipPetSelection: boolean;
  selectedServices: string[];
  onToggleService: (serviceId: string) => void;
}

export default function ServiceStep({
  servicesLoading,
  services,
  selectedPet,
  pets,
  skipPetSelection,
  selectedServices,
  onToggleService,
}: Props) {
  const pet = selectedPet ? pets.find(p => p.id === selectedPet) : undefined;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Chọn dịch vụ</h2>
      {servicesLoading ? (
        <p className="text-center py-12">Đang tải dịch vụ...</p>
      ) : services.length === 0 ? (
        <p className="text-center py-12 text-gray-500">Phòng khám chưa có dịch vụ</p>
      ) : (
        <>
          {selectedPet && (
            <div className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-200">
              <p className="text-sm text-gray-600">Thú cưng đã chọn:</p>
              {pet ? (
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={pet.avatar_url || '/sampleimg/default-pet.jpg'}
                    alt={pet.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-bold text-teal-700">{pet.name} ({pet.breed})</span>
                </div>
              ) : null}
            </div>
          )}

          {skipPetSelection && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-700">
                <span className="font-bold">Lưu ý:</span> Bạn chưa chọn thú cưng. Dịch vụ sẽ được áp dụng chung cho lịch hẹn.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {services.map(service => (
              <div
                key={service.id}
                onClick={() => onToggleService(service.id)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${selectedServices.includes(service.id) ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-teal-400'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{service.name}</h3>
                    {service.description && <p className="text-gray-600 text-sm mt-2 line-clamp-2">{service.description}</p>}
                    <p className="text-gray-600 mt-3">Thời gian: {formatDuration(service.duration)}</p>
                    <p className="text-2xl font-bold text-teal-600 mt-4">{service.price.toLocaleString('vi-VN')} ₫</p>
                  </div>
                  {selectedServices.includes(service.id) && (
                    <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d={CHECK_ICON_PATH} clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
