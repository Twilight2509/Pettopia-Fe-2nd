'use client'

import { Spinner } from '@/components/ui';
import { useBooking } from './_hooks/useBooking';
import StepProgress from './_components/StepProgress';
import ClinicStep from './_components/ClinicStep';
import DateShiftStep from './_components/DateShiftStep';
import PetStep from './_components/PetStep';
import ServiceStep from './_components/ServiceStep';
import ConfirmStep from './_components/ConfirmStep';
import BookingSuccessModal from './_components/BookingSuccessModal';
import ClinicDetailModal from './_components/ClinicDetailModal';

export default function AppointmentBooking() {
  const b = useBooking();
  const { currentStep, setCurrentStep, isSubmitting, canProceed } = b;

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 lg:p-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">Đặt lịch khám thú cưng</h1>
          <p className="text-lg text-gray-600">Chăm sóc sức khỏe cho bé yêu của bạn</p>
        </div>

        <StepProgress currentStep={currentStep} />

        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 min-h-96">
          {currentStep === 1 && (
            <ClinicStep
              loading={b.loading}
              error={b.error}
              selectedCity={b.selectedCity}
              setSelectedCity={b.setSelectedCity}
              availableCities={b.availableCities}
              filteredClinics={b.filteredClinics}
              selectedClinic={b.selectedClinic}
              setSelectedClinic={b.setSelectedClinic}
              onViewDetail={b.handleViewClinicDetail}
            />
          )}

          {currentStep === 2 && (
            <DateShiftStep
              selectedDate={b.selectedDate}
              setSelectedDate={b.setSelectedDate}
              shiftsLoading={b.shiftsLoading}
              shifts={b.shifts}
              selectedShift={b.selectedShift}
              setSelectedShift={b.setSelectedShift}
            />
          )}

          {currentStep === 3 && (
            <PetStep
              petsLoading={b.petsLoading}
              pets={b.pets}
              selectedPet={b.selectedPet}
              onTogglePet={b.togglePet}
            />
          )}

          {currentStep === 4 && (
            <ServiceStep
              servicesLoading={b.servicesLoading}
              services={b.services}
              selectedPet={b.selectedPet}
              pets={b.pets}
              skipPetSelection={b.skipPetSelection}
              selectedServices={b.selectedServices}
              onToggleService={b.toggleService}
            />
          )}

          {currentStep === 5 && b.selectedClinicInfo && (
            <ConfirmStep
              clinic={b.selectedClinicInfo}
              selectedDate={b.selectedDate}
              shifts={b.shifts}
              selectedShift={b.selectedShift}
              selectedPet={b.selectedPet}
              pets={b.pets}
              selectedServices={b.selectedServices}
              services={b.services}
              total={b.calculateTotal()}
            />
          )}
        </div>

        <div className="flex justify-between mt-12">
          <button
            onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
            disabled={currentStep === 1 || isSubmitting}
            className={`px-8 py-4 rounded-xl font-medium transition ${currentStep === 1 || isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          >
            Quay lại
          </button>

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(s => s + 1)}
              disabled={!canProceed() || isSubmitting}
              className={`px-8 py-4 rounded-xl font-medium transition ${canProceed() && !isSubmitting ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Tiếp theo
            </button>
          ) : (
            <button
              onClick={b.handleSubmit}
              disabled={isSubmitting}
              className={`px-12 py-5 rounded-xl font-bold text-xl transition shadow-xl transform ${isSubmitting ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700 hover:scale-105'}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <Spinner size="sm" color="white" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                'Xác nhận đặt lịch ngay'
              )}
            </button>
          )}
        </div>
      </div>

      {b.showSuccess && <BookingSuccessModal />}

      {b.showClinicDetail && b.selectedClinicForDetail && (
        <ClinicDetailModal
          clinic={b.selectedClinicForDetail}
          ratingsLoading={b.ratingsLoading}
          clinicRatingStats={b.clinicRatingStats}
          onClose={b.closeClinicDetail}
          onSelect={b.setSelectedClinic}
        />
      )}
    </>
  );
}
