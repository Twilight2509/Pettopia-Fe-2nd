'use client'

import type { Clinic } from '@/services/petcare/petService';
import { LoadingState } from '@/components/ui';
import { CHECK_ICON_PATH, formatAddress } from '../_utils';

interface Props {
  loading: boolean;
  error: string | null;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  availableCities: string[];
  filteredClinics: Clinic[];
  selectedClinic: string;
  setSelectedClinic: (id: string) => void;
  onViewDetail: (clinic: Clinic) => void;
}

export default function ClinicStep({
  loading,
  error,
  selectedCity,
  setSelectedCity,
  availableCities,
  filteredClinics,
  selectedClinic,
  setSelectedClinic,
  onViewDetail,
}: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Chọn phòng khám</h2>
      {loading ? (
        <LoadingState message="Đang tải phòng khám..." />
      ) : error ? (
        <div className="text-center py-16 text-red-600">{error}</div>
      ) : (
        <>
          <div className="mb-8 flex flex-wrap gap-3">
            <button onClick={() => setSelectedCity('all')} className={`px-6 py-3 rounded-lg font-medium transition ${selectedCity === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              Tất cả
            </button>
            {availableCities.map(city => (
              <button key={city} onClick={() => setSelectedCity(city)} className={`px-6 py-3 rounded-lg font-medium transition ${selectedCity === city ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                {city}
              </button>
            ))}
          </div>

          <div className="grid gap-6">
            {filteredClinics.map(clinic => (
              <div
                key={clinic.id}
                onClick={() => setSelectedClinic(clinic.id)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${selectedClinic === clinic.id ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-teal-400'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-9 h-9 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{clinic.clinic_name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{formatAddress(clinic.address)}</p>
                      <p className="text-gray-600 text-sm mt-2">Điện thoại: {clinic.phone.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetail(clinic);
                      }}
                      className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                    >
                      Xem chi tiết
                    </button>
                    {selectedClinic === clinic.id && (
                      <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={CHECK_ICON_PATH} clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredClinics.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              <p>Không có phòng khám nào khả dụng.</p>
              <p>Liên hệ với số điện thoại 1900-XXXX để được hỗ trợ.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
