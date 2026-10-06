'use client';

import React, { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import type { District, ProfileFormData, Province, User, Ward } from "./types";
import {
  PROVINCES_URL,
  districtsUrl,
  wardsUrl,
  fallbackProvinces,
  fallbackDistricts,
  fallbackWards,
  fetchWithRetry,
  mapProvinces,
  mapDistricts,
  mapWards,
} from "./utils";

export function useAddressFields(user: User | null, setFormData: Dispatch<SetStateAction<ProfileFormData>>) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [, setApiError] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [selectedCityCode, setSelectedCityCode] = useState<string>('');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>('');

  const setValue = (field: string, value: string) => {
    if (field === 'district' || field === 'ward' || field === 'description') {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    }
  };

  const fetchProvinces = async () => {
    setIsLoadingProvinces(true);
    setApiError(false);
    try {
      const processedData = mapProvinces(await fetchWithRetry(PROVINCES_URL));
      setProvinces(processedData.length > 0 ? processedData : fallbackProvinces);
    } catch (error) {
      setProvinces(fallbackProvinces);
      setApiError(true);
    } finally {
      setIsLoadingProvinces(false);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedCityCode) {
      const fetchDistricts = async () => {
        setIsLoadingDistricts(true);
        setApiError(false);
        try {
          const processedDistricts = mapDistricts(await fetchWithRetry(districtsUrl(selectedCityCode)));
          const filteredFallback = fallbackDistricts.filter((d: District) => d.province_code === selectedCityCode);
          setDistricts(processedDistricts.length > 0 ? processedDistricts : filteredFallback);
          setValue("district", "");
          setValue("ward", "");
          setWards([]);
        } catch (error) {
          const filteredFallback = fallbackDistricts.filter((d: District) => d.province_code === selectedCityCode);
          setDistricts(filteredFallback);
          setApiError(true);
        } finally {
          setIsLoadingDistricts(false);
        }
      };
      fetchDistricts();
    }
  }, [selectedCityCode]);

  useEffect(() => {
    if (selectedDistrictCode) {
      const fetchWards = async () => {
        setIsLoadingWards(true);
        setApiError(false);
        try {
          const processedWards = mapWards(await fetchWithRetry(wardsUrl(selectedDistrictCode)));
          const filteredFallback = fallbackWards.filter((w: Ward) => w.district_code === selectedDistrictCode);
          setWards(processedWards.length > 0 ? processedWards : filteredFallback);
          setValue("ward", "");
        } catch (error) {
          const filteredFallback = fallbackWards.filter((w: Ward) => w.district_code === selectedDistrictCode);
          setWards(filteredFallback);
          setApiError(true);
        } finally {
          setIsLoadingWards(false);
        }
      };
      fetchWards();
    }
  }, [selectedDistrictCode]);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityCode = e.target.value;
    setSelectedCityCode(cityCode);
    const selectedProvince = provinces.find(p => p.code === cityCode);
    setFormData(prev => ({
      ...prev,
      address: {
        city: selectedProvince?.name || '',
        district: '',
        ward: '',
        description: prev.address.description
      }
    }));
    setSelectedDistrictCode('');
    setDistricts([]);
    setWards([]);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtCode = e.target.value;
    setSelectedDistrictCode(districtCode);
    const selectedDistrict = districts.find(d => d.code === districtCode);
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        district: selectedDistrict?.name || '',
        ward: ''
      }
    }));
    setWards([]);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = e.target.value;
    const selectedWard = wards.find(w => w.code === wardCode);
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        ward: selectedWard?.name || ''
      }
    }));
  };

  const handleAddressDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        description: e.target.value
      }
    }));
  };

  const handleEditAddress = async () => {
    setIsEditingAddress(true);
    if (provinces.length === 0) {
      await fetchProvinces();
    }

    if (user?.address?.city) {
      const provinceList = provinces.length > 0 ? provinces : fallbackProvinces;
      const cityCode = provinceList.find(p => p.name === user.address?.city)?.code || '';
      if (cityCode) {
        setSelectedCityCode(cityCode);
        try {
          const processedDistricts = mapDistricts(await fetchWithRetry(districtsUrl(cityCode)));
          const filteredFallback = fallbackDistricts.filter((d: District) => d.province_code === cityCode);
          const districtList = processedDistricts.length > 0 ? processedDistricts : filteredFallback;
          setDistricts(districtList);

          if (user.address?.district) {
            const districtCode = districtList.find((d: District) => d.name === user.address?.district)?.code || '';
            if (districtCode) {
              setSelectedDistrictCode(districtCode);
              try {
                const processedWards = mapWards(await fetchWithRetry(wardsUrl(districtCode)));
                const filteredWardFallback = fallbackWards.filter((w: Ward) => w.district_code === districtCode);
                setWards(processedWards.length > 0 ? processedWards : filteredWardFallback);
              } catch (error) {
                console.error('Error loading wards:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error loading districts:', error);
        }
      }
    }
  };

  const handleCancelEditAddress = () => {
    setIsEditingAddress(false);
    if (user) {
      setFormData(prev => ({
        ...prev,
        address: {
          city: user.address?.city || '',
          district: user.address?.district || '',
          ward: user.address?.ward || '',
          description: user.address?.description || ''
        }
      }));
    }
  };

  return {
    provinces,
    districts,
    wards,
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingWards,
    isEditingAddress,
    selectedCityCode,
    selectedDistrictCode,
    handleCityChange,
    handleDistrictChange,
    handleWardChange,
    handleAddressDescriptionChange,
    handleEditAddress,
    handleCancelEditAddress,
  };
}

export type AddressFields = ReturnType<typeof useAddressFields>;
