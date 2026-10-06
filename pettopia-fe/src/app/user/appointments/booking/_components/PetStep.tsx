'use client'

import type { Pet } from '../_types';
import { CHECK_ICON_PATH } from '../_utils';

interface Props {
  petsLoading: boolean;
  pets: Pet[];
  selectedPet: string;
  onTogglePet: (petId: string) => void;
}

export default function PetStep({ petsLoading, pets, selectedPet, onTogglePet }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Chọn thú cưng</h2>
      <p className="text-gray-600 mb-8">Bạn có thể chọn thú cưng hoặc bỏ qua bước này</p>

      {petsLoading ? (
        <p className="text-center py-12">Đang tải thú cưng...</p>
      ) : pets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Bạn chưa có thú cưng nào trong hệ thống</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {pets.map(pet => (
              <div
                key={pet.id}
                onClick={() => onTogglePet(pet.id)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${selectedPet === pet.id ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-teal-400'}`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={pet.avatar_url || '/sampleimg/default-pet.jpg'}
                    alt={pet.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold truncate">{pet.name}</h3>
                    <p className="text-gray-600 text-sm mt-1 truncate">{pet.species} • {pet.breed}</p>
                  </div>
                  {selectedPet === pet.id && (
                    <svg className="w-8 h-8 text-teal-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d={CHECK_ICON_PATH} clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
          </div>
        </>
      )}
    </div>
  );
}
