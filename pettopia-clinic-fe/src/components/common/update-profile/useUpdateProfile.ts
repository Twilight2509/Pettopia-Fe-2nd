'use client';

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCustomerProfile, updateCustomerProfile } from "@/services/user/userService";
import type { ProfileFormData, User } from "./types";
import { formatDateForInput, getProfilePath, mapProfileToUser } from "./utils";
import { useAddressFields } from "./useAddressFields";

export function useUpdateProfile() {
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

  const address = useAddressFields(user, setFormData);

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

        const mapped = mapProfileToUser(data);
        setUser(mapped);

        setFormData({
          fullname: mapped.fullname,
          email: mapped.email || '',
          phone: mapped.phone || '',
          dob: formatDateForInput(mapped.dob),
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullname.trim()) {
      setError('Họ và tên không được để trống');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email không được để trống');
      return;
    }

    if (formData.dob) {
      const selectedDate = new Date(formData.dob);
      const now = new Date();
      if (selectedDate > now) {
        setError('Ngày sinh không được lớn hơn hiện tại');
        return;
      }
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const updateData: Record<string, any> = {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone || undefined,
        dob: formData.dob || undefined
      };

      if (address.isEditingAddress) {
        updateData.address = {
          city: formData.address.city || undefined,
          district: formData.address.district || undefined,
          ward: formData.address.ward || undefined,
          description: formData.address.description || undefined
        };
      }

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
    address,
    handleInputChange,
    handleSubmit,
  };
}
