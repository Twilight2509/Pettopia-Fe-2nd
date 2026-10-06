'use client';

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCustomerProfile, updateCustomerProfile } from "@/services/user/userService";
import { fetchAreaData } from "@/services/location/locationService";
import type { District, ProfileFormData, Province, User, Ward } from "../_types";
import {
  PROVINCES_URL,
  districtsUrl,
  fallbackDistricts,
  fallbackProvinces,
  fallbackWards,
  formatDateForInput,
  getProfilePath,
  mapDistricts,
  mapProvinces,
  mapWards,
  validateProfileForm,
  wardsUrl,
} from "../_utils";

export function useEditProfile() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullname: '',
    email: '',
    phone: '',
    dob: '',
    address: {
      city: '',
      district: '',
      ward: '',
      description: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const fetchWithRetry = fetchAreaData;

  const fetchProvinces = async () => {
    setIsLoadingProvinces(true);
    setApiError(false);
    try {
      const data = await fetchWithRetry(PROVINCES_URL);
      const processedData = mapProvinces(data);
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
          const data = await fetchWithRetry(districtsUrl(selectedCityCode));
          const processedDistricts = mapDistricts(data);
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
          const data = await fetchWithRetry(wardsUrl(selectedDistrictCode));
          const processedWards = mapWards(data);
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const hasToken =
          typeof window !== "undefined" ? !!localStorage.getItem("authToken") : false;
        if (!hasToken) {
          setError('Vui lòng đăng nhập để xem trang này');
          router.push('/auth/login');
          return;
        }

        const data = await getCustomerProfile();
        if (!data) {
          setError('Không tìm thấy thông tin người dùng');
          return;
        }

        const mapped: User = {
          id: data.id || data._id || data.customer_id || '',
          fullname: data.fullname || data.username || 'Người dùng',
          username: data.username,
          email: typeof data.email === 'string' ? data.email : data.email?.email_address || '',
          phone: typeof data.phone === 'string' ? data.phone : data.phone?.phone_number || '',
          avatar_url: data.avatar_url || data.avatar || undefined,
          address: {
            city: data.address?.city || '',
            district: data.address?.district || '',
            ward: data.address?.ward || '',
            description: data.address?.description || ''
          },
          dob: data.dob || '',
          createdAt: data.createdAt || data.created_at || ''
        };

        setUser(mapped);

        const formattedDob = formatDateForInput(mapped.dob);

        setFormData({
          fullname: mapped.fullname,
          email: mapped.email || '',
          phone: mapped.phone || '',
          dob: formattedDob,
          address: {
            city: mapped.address?.city ?? '',
            district: mapped.address?.district ?? '',
            ward: mapped.address?.ward ?? '',
            description: mapped.address?.description ?? ''
          }
        });
      } catch (err: any) {
        console.error('Error fetching user profile:', err);
        setError(err?.message || 'Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const setValue = (field: string, value: string) => {
    if (field === 'district' || field === 'ward') {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        description: value
      }
    }));
  };

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
          const districtData = await fetchWithRetry(districtsUrl(cityCode));
          const processedDistricts = mapDistricts(districtData);
          const filteredFallback = fallbackDistricts.filter((d: District) => d.province_code === cityCode);
          const districtList = processedDistricts.length > 0 ? processedDistricts : filteredFallback;
          setDistricts(districtList);

          if (user.address?.district) {
            const districtCode = districtList.find((d: District) => d.name === user.address?.district)?.code || '';
            if (districtCode) {
              setSelectedDistrictCode(districtCode);

              try {
                const wardData = await fetchWithRetry(wardsUrl(districtCode));
                const processedWards = mapWards(wardData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateProfileForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const updateData = {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone || undefined,
        dob: formData.dob || undefined,
        address: {
          city: formData.address.city || undefined,
          district: formData.address.district || undefined,
          ward: formData.address.ward || undefined,
          description: formData.address.description || undefined
        }
      };

      const result = await updateCustomerProfile(updateData);

      if (result) {
        setSuccess('Cập nhật hồ sơ thành công!');

        setTimeout(() => {
          router.push(getProfilePath(pathname));
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err?.message || 'Không thể cập nhật hồ sơ');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    router,
    user,
    formData,
    loading,
    submitting,
    error,
    success,
    provinces,
    districts,
    wards,
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingWards,
    isEditingAddress,
    selectedCityCode,
    selectedDistrictCode,
    handleInputChange,
    handleDescriptionChange,
    handleCityChange,
    handleDistrictChange,
    handleWardChange,
    handleEditAddress,
    handleCancelEditAddress,
    handleSubmit,
  };
}
