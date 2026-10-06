'use client'

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/services/auth/authService';
import type { UserData } from './types';
import { getInitials } from './utils';

interface SidebarUserSectionProps {
  collapsed: boolean;
  isLoading: boolean;
  userData: UserData | null;
  isVip: boolean;
  onOpenSettings: () => void;
}

export default function SidebarUserSection({ collapsed, isLoading, userData, isVip, onOpenSettings }: SidebarUserSectionProps) {
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleSettingsClick = () => {
    setIsUserMenuOpen(false);
    onOpenSettings();
  };

  const handleProfileClick = () => {
    setIsUserMenuOpen(false);
    router.push('/user/profile');
  };

  const handleLogoutClick = () => {
    setIsUserMenuOpen(false);
    logoutUser();
    setTimeout(() => {
      window.location.href = '/auth/login';
      if (window.history && window.history.length > 1) {
        window.history.forward();
      }
    }, 500);
  };

  return (
    <div className="border-t border-gray-200 p-3 space-y-2">
      <div className="relative" ref={userMenuRef}>
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors`}
        >
          {isLoading ? (
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {userData ? getInitials(userData.fullname) : '🐾'}
            </div>
          )}
          {!collapsed && (
            <>
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {userData?.fullname || 'User'}
                </div>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>

        {isUserMenuOpen && (
          <div className={`absolute ${collapsed ? 'left-full ml-2 bottom-0' : 'left-4 right-4 bottom-16'} bg-white rounded-lg shadow-2xl border border-gray-200 py-1 z-50 w-48`}>
            <button onClick={handleProfileClick} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-teal-50 transition-colors text-left">
              <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Hồ sơ</span>
            </button>
            <button
              onClick={() => {
                setIsUserMenuOpen(false);
                router.push('/user/change-password');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-teal-50 transition-colors text-left"
            >
              <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Đổi mật khẩu</span>
            </button>
            <button onClick={handleSettingsClick} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-teal-50 transition-colors text-left">
              <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Cài đặt</span>
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <button onClick={handleLogoutClick} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm font-medium text-red-600">Đăng xuất</span>
            </button>
          </div>
        )}
      </div>

      {!collapsed && (
        <button
          onClick={() => !isVip && router.push('/user/upgrade')}
          disabled={isVip}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors border font-medium ${
            isVip
              ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-300 cursor-not-allowed opacity-75'
              : 'bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 text-teal-700 border-teal-300 cursor-pointer'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span>{isVip ? 'Premium' : 'Nâng cấp'}</span>
        </button>
      )}
    </div>
  );
}
