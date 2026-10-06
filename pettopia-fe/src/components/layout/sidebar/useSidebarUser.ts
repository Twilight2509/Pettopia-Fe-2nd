'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseJwt, isTokenExpired } from '@/utils/jwt';
import { logoutUser } from '@/services/auth/authService';
import { getVipStatus } from '@/services/user/userService';
import { getPetsByOwner } from '@/services/petcare/petService';
import type { Pet, UserData } from './types';

export function useSidebarUser() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [vipLoading, setVipLoading] = useState(false);

  useEffect(() => {
    const loadUserDataFromToken = () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
          console.error('No auth token found');
          setIsLoading(false);
          return;
        }

        if (isTokenExpired(token)) {
          console.error('Token expired');
          logoutUser();
          router.replace('/auth/login');
          return;
        }

        const decodedToken = parseJwt(token);

        if (!decodedToken) {
          console.error('Failed to decode token');
          setIsLoading(false);
          return;
        }

        if (decodedToken.id !== undefined && decodedToken.id !== null) {
          localStorage.setItem('userId', String(decodedToken.id));
        }

        const user: UserData = {
          userId: decodedToken.id,
          fullname: decodedToken.fullname,
          email: decodedToken.email,
          phone_number: decodedToken.phone.phone_number,
          username: decodedToken.username,
          dob: decodedToken.dob,
          address: decodedToken.address
        };

        setUserData(user);
        setIsLoading(false);

      } catch (error) {
        console.error('Error loading user data from token:', error);
        setIsLoading(false);
      }
    };

    loadUserDataFromToken();
  }, []);

  useEffect(() => {
    const fetchPets = async () => {
      if (!userData?.userId) return;

      try {
        setLoadingPets(true);
        const data = await getPetsByOwner(userData.userId);
        setPets(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching pets:', error);
        setPets([]);
      } finally {
        setLoadingPets(false);
      }
    };

    if (userData?.userId) {
      fetchPets();
    }
  }, [userData?.userId]);

  useEffect(() => {
    const fetchVipStatus = async () => {
      try {
        setVipLoading(true);
        const vipData = await getVipStatus();
        if (vipData && vipData.is_vip) {
          setIsVip(true);
        }
      } catch (error) {
        console.error('Error fetching VIP status:', error);
        setIsVip(false);
      } finally {
        setVipLoading(false);
      }
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      fetchVipStatus();
    }
  }, []);

  return { userData, isLoading, pets, loadingPets, isVip, vipLoading };
}
