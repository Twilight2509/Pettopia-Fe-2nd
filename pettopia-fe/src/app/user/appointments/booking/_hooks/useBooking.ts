'use client'

import { useState, useEffect } from 'react';
import {
  getClinics,
  getServicesByClinic,
  getShiftsByClinic,
  getPetsByOwner,
  bookAppointment,
  getClinicRating,
  type Clinic,
  type Service,
  type Shift,
  type ClinicRatingStats,
} from '@/services/petcare/petService';
import type { Pet, PetServiceMap } from '../_types';
import { isShiftPast, parseJwt } from '../_utils';

export function useBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClinic, setSelectedClinic] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [, setPetServiceMap] = useState<PetServiceMap>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skipPetSelection, setSkipPetSelection] = useState(false);

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [shiftsLoading, setShiftsLoading] = useState(false);
  const [petsLoading, setPetsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showClinicDetail, setShowClinicDetail] = useState(false);
  const [selectedClinicForDetail, setSelectedClinicForDetail] = useState<Clinic | null>(null);
  const [clinicRatingStats, setClinicRatingStats] = useState<ClinicRatingStats | null>(null);
  const [ratingsLoading, setRatingsLoading] = useState(false);

  useEffect(() => {
    const loadClinics = async () => {
      try {
        setLoading(true);
        const data = await getClinics();
        setClinics(data);
      } catch (err) {
        setError('Không tải được danh sách phòng khám');
        console.error('Error loading clinics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadClinics();
  }, []);

  useEffect(() => {
    if (!selectedClinic) {
      setServices([]);
      return;
    }

    const loadServices = async () => {
      try {
        setServicesLoading(true);
        const data = await getServicesByClinic(selectedClinic);
        setServices(data);
      } catch (err) {
        console.error('Error loading services:', err);
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    };
    loadServices();
  }, [selectedClinic]);

  useEffect(() => {
    if (!selectedClinic) {
      setShifts([]);
      return;
    }

    const loadShifts = async () => {
      try {
        setShiftsLoading(true);
        const data = await getShiftsByClinic(selectedClinic);
        setShifts(data);
      } catch (err) {
        console.error('Error loading shifts:', err);
        setShifts([]);
      } finally {
        setShiftsLoading(false);
      }
    };
    loadShifts();
  }, [selectedClinic]);

  useEffect(() => {
    const loadPets = async () => {
      try {
        setPetsLoading(true);
        const token = localStorage.getItem('authToken');
        let userId = localStorage.getItem('userId');

        if (!userId && token) {
          const decoded = parseJwt(token);
          const resolved = decoded?.userId ?? decoded?.id ?? decoded?.sub ?? null;
          if (resolved) {
            userId = String(resolved);
            localStorage.setItem('userId', userId);
          }
        }

        if (!userId) throw new Error('Không thể lấy userId');

        const data = await getPetsByOwner(userId);
        setPets(data);
      } catch (err) {
        console.log('Error loading pets:', err);
        setPets([]);
      } finally {
        setPetsLoading(false);
      }
    };

    loadPets();
  }, []);

  const selectedClinicInfo = clinics.find(c => c.id === selectedClinic);

  useEffect(() => {
    if (!selectedShift || !selectedDate) return;
    const chosen = shifts.find(s => s.id === selectedShift);
    if (isShiftPast(chosen, selectedDate)) {
      setSelectedShift('');
    }
  }, [selectedDate, shifts, selectedShift]);

  const togglePet = (petId: string) => {
    if (selectedPet === petId) {
      setSelectedPet('');
      setPetServiceMap({});
      setSelectedServices([]);
    } else {
      setSelectedPet(petId);
      const currentServices = selectedServices.length > 0 ? selectedServices : [];
      setPetServiceMap({ [petId]: currentServices });
      setSkipPetSelection(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const newServices = prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId];

      if (selectedPet) {
        setPetServiceMap({ [selectedPet]: newServices });
      }

      return newServices;
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedClinic !== '';
      case 2: {
        if (!selectedDate || !selectedShift) return false;
        const chosen = shifts.find(s => s.id === selectedShift);
        return !isShiftPast(chosen, selectedDate);
      }
      case 3: return selectedPet !== '' || skipPetSelection;
      case 4: return selectedServices.length > 0;
      default: return true;
    }
  };

  const calculateTotal = () => {
    let total = 0;
    selectedServices.forEach(id => {
      const service = services.find(s => s.id === id);
      if (service) total += service.price;
    });
    return total;
  };

  const handleSubmit = async () => {
    const payload = {
      clinic_id: selectedClinic,
      pet_ids: selectedPet ? [selectedPet] : [],
      service_ids: selectedServices,
      date: selectedDate,
      shift_id: selectedShift,
    };

    try {
      setIsSubmitting(true);
      await bookAppointment(payload);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setCurrentStep(1);
        setSelectedClinic('');
        setSelectedDate('');
        setSelectedShift('');
        setSelectedPet('');
        setSelectedServices([]);
        setPetServiceMap({});
        setSkipPetSelection(false);
        setIsSubmitting(false);
      }, 3000);
    } catch (err) {
      alert('Đặt lịch thất bại. Vui lòng thử lại!');
      console.error('Submit error:', err);
      setIsSubmitting(false);
    }
  };

  const availableCities = [...new Set(clinics.map(c => c.address.city))];
  const filteredClinics = selectedCity === 'all' ? clinics : clinics.filter(c => c.address.city === selectedCity);

  const handleViewClinicDetail = async (clinic: Clinic) => {
    setSelectedClinicForDetail(clinic);
    setShowClinicDetail(true);
    setRatingsLoading(true);
    try {
      const stats = await getClinicRating(clinic.id);
      setClinicRatingStats(stats);
    } catch (err) {
      console.error('Error loading clinic rating stats:', err);
      setClinicRatingStats(null);
    } finally {
      setRatingsLoading(false);
    }
  };

  const closeClinicDetail = () => {
    setShowClinicDetail(false);
    setSelectedClinicForDetail(null);
    setClinicRatingStats(null);
  };

  return {
    currentStep,
    setCurrentStep,
    selectedClinic,
    setSelectedClinic,
    selectedCity,
    setSelectedCity,
    selectedDate,
    setSelectedDate,
    selectedShift,
    setSelectedShift,
    selectedServices,
    selectedPet,
    showSuccess,
    isSubmitting,
    skipPetSelection,
    services,
    shifts,
    pets,
    loading,
    servicesLoading,
    shiftsLoading,
    petsLoading,
    error,
    showClinicDetail,
    selectedClinicForDetail,
    clinicRatingStats,
    ratingsLoading,
    selectedClinicInfo,
    togglePet,
    toggleService,
    canProceed,
    calculateTotal,
    handleSubmit,
    availableCities,
    filteredClinics,
    handleViewClinicDetail,
    closeClinicDetail,
  };
}
