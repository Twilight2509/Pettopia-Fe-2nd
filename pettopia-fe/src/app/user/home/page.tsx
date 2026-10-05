'use client'
import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import Link from "next/link";
import PetCards from '@/components/NumberofPet';
import { getAppointments } from '@/services/petcare/petService';
import type { Appointment, AppointmentsResponse } from '@/services/petcare/petService';

// Timeline Component - Simplified without Calendar
const AppointmentTimeline = memo(function AppointmentTimeline() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response: AppointmentsResponse = await getAppointments({ page: 1, limit: 50 });

        // Lọc chỉ lấy lịch hẹn sắp tới (chưa qua và chưa hủy)
        const upcoming = response.data
          .filter(apt => {
            const aptDate = new Date(apt.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return aptDate >= today && apt.status !== 'Cancelled';
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 10); // Lấy tối đa 10 lịch hẹn gần nhất

        setAppointments(upcoming);
      } catch (err) {
        console.error('Không thể tải lịch hẹn:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const dayName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()];
    return { day, month, dayName };
  };

  const formatShift = (s: string) => ({
    Morning: 'Sáng',
    Afternoon: 'Chiều',
    Evening: 'Tối'
  }[s] || s);

  const getStatusColor = (s: string) => ({
    Pending_Confirmation: 'bg-yellow-50 border-yellow-300',
    Confirmed: 'bg-emerald-50 border-emerald-300',
    Completed: 'bg-blue-50 border-blue-300'
  }[s] || 'bg-gray-50 border-gray-300');

  const getStatusDot = (s: string) => ({
    Pending_Confirmation: 'bg-yellow-500',
    Confirmed: 'bg-emerald-500',
    Completed: 'bg-blue-500'
  }[s] || 'bg-gray-500');

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const isToday = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-teal-100 rounded-lg animate-pulse"></div>
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="min-w-[140px] h-40 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return null; // Không hiển thị nếu không có lịch hẹn
  }

  return (
    <section className="mb-8" aria-labelledby="timeline-heading">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <h2 id="timeline-heading" className="text-xl font-bold text-gray-900">
              Lịch hẹn sắp tới <span className="text-teal-600">({appointments.length})</span>
            </h2>
          </div>
          <Link href="/user/appointments/list">
            <button className="text-teal-600 hover:text-teal-700 font-medium text-sm hover:underline transition-colors px-4 py-2">
              Xem chi tiết →
            </button>
          </Link>
        </div>

        {/* Timeline View */}
        <div className="relative group">
          {/* Scroll buttons */}
          {appointments.length > 4 && (
            <>
              <button
                onClick={() => scrollTimeline('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-gray-50 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200"
                aria-label="Cuộn trái"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={() => scrollTimeline('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-gray-50 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200"
                aria-label="Cuộn phải"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          {/* Timeline scroll container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {appointments.map((apt, index) => {
              const { day, month, dayName } = formatShortDate(apt.date);
              const today = isToday(apt.date);

              return (
                <Link key={apt.id} href={`/user/appointments/${apt.id}`}>
                  <div
                    className={`
                      min-w-[120px] p-5 rounded-xl border-2 cursor-pointer
                      transition-all duration-300 hover:scale-100 hover:shadow-xl
                      ${getStatusColor(apt.status)}
                     
                    `}
                  >
                    {/* Date display */}
                    <div className="text-center mb-4">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        {dayName}
                      </div>
                      <div className="text-3xl font-bold text-gray-900 leading-none">
                        {day}
                      </div>
                      <div className="text-sm font-medium text-gray-600 mt-1">
                        Tháng {month}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gray-300 my-3"></div>

                    {/* Appointment info */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-teal-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          {formatShift(apt.shift)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${getStatusDot(apt.status)}`}></div>
                        <span className="text-xs text-gray-600">
                          {apt.pet_ids.length} pet • {apt.service_ids.length} dịch vụ
                        </span>
                      </div>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-6 pt-5 border-t border-gray-200 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">
              {appointments.filter(a => a.status === 'Pending_Confirmation').length} chờ xác nhận
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-600">
              {appointments.filter(a => a.status === 'Confirmed').length} đã xác nhận
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
});

// Tách Pet Registration Banner thành component riêng
const PetRegistrationBanner = memo(function PetRegistrationBanner() {
  return (
    <section className="mb-12" aria-labelledby="register-heading">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
        {/* Background decoration */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" aria-hidden="true" />
        <div className="absolute left-0 bottom-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" aria-hidden="true" />

        <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
          <div className="flex-1 min-w-[300px]">
            <div className="flex items-center gap-3 mb-3">
              <h2 id="register-heading" className="text-3xl font-bold text-white">
                Bạn đã đăng ký thú cưng chưa?
              </h2>
            </div>
            <p className="text-cyan-50 text-lg mb-6">
              Đăng ký hồ sơ để theo dõi sức khỏe và chăm sóc thú cưng của bạn tốt hơn
            </p>
            <Link href="/user/pet/new">
              <button className="bg-white text-teal-700 px-8 py-4 rounded-full font-semibold hover:bg-teal-50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-101 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-600">
                Đăng ký ngay →
              </button>
            </Link>
          </div>

          {/* Decorative pet icons */}
          <div className="flex gap-4 text-6xl opacity-80">
            <span className="animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>🐕</span>
            <span className="animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2s' }}>🐈</span>
            <span className="animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '2s' }}>🐇</span>
          </div>
        </div>
      </div>
    </section>
  );
});

// Tách Recent Items thành component riêng
const RecentlyVisited = memo(function RecentlyVisited() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const recentItems = useMemo(() => [
    {
      id: 1,
      title: 'Hồ sơ thú cưng',
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=200&fit=crop',
      time: '1w ago',
      icon: '🐾',
      href: '/user/pet/list', // giống mục "Danh sách thú cưng" ở sidebar
    },
    {
      id: 2,
      title: 'Lịch khám sắp tới',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=200&fit=crop',
      time: '2d ago',
      icon: '📅',
      href: '/user/appointments/list', // giống mục "Xem lịch khám" ở sidebar
    },
    {
      id: 3,
      title: 'Nhật ký hôm nay',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1443&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      time: '1d ago',
      icon: '📝',
      color: 'from-teal-600 to-cyan-600',
      href: '/user/prescription', // giống mục "Lịch sử khám" ở sidebar
    },
    {
      id: 4,
      title: 'Community',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=200&fit=crop',
      time: '3h ago',
      icon: '💬',
      href: '/user/community', // giống mục "Cộng đồng Pettopia" ở sidebar
    },
    {
      id: 5,
      title: 'Dịch vụ kí gửi - Đang phát triển',
      image: 'https://images.unsplash.com/photo-1548620848-d375c7919ea2?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      time: '1w ago',
      icon: '🏨',
      color: 'from-teal-500 to-cyan-500',
      // Chưa có route tương ứng trong sidebar, nên tạm thời để không link
    }
  ], []);

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900">Chức năng</h2>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {recentItems.map((item) => {
          const CardContent = (
            <div
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`rounded-xl overflow-hidden mb-3 aspect-video transition-all duration-300 shadow-md hover:shadow-xl ${hoveredCard === item.id ? 'scale-105' : ''}`}>
                {item.image ? (
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <span className="text-4xl">{item.icon}</span>
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-sm mb-1 text-gray-900">{item.title}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-4 h-4 bg-teal-100 rounded-full" />
                <span>{item.time}</span>
              </div>
            </div>
          );

          return item.href ? (
            <Link key={item.id} href={item.href}>
              {CardContent}
            </Link>
          ) : (
            <div key={item.id}>{CardContent}</div>
          );
        })}
      </div>
    </div>
  );
});

// Tách Quick Actions thành component riêng
const QuickActions = memo(function QuickActions() {
  const quickActions = useMemo(() => [
    {
      id: 1,
      title: 'Quản lí hồ sơ Pet',
      description: 'Thông tin, sức khỏe, lịch sử khám',
      icon: '',
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=200&fit=crop',
      href: '/user/pet/list'
    },
    {
      id: 2,
      title: 'Đặt lịch khám',
      description: 'Đặt hẹn với bác sĩ thú y',
      icon: '',
      color: 'from-teal-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9nfGVufDB8fDB8fHww',
      href: '/user/appointments/booking'
    },
    {
      id: 3,
      title: 'Bạn & Cộng đồng',
      description: 'Kết nối với các chủ pet và bác sĩ',
      icon: '',
      color: 'from-cyan-600 to-teal-600',
      image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZG9nfGVufDB8fDB8fHww',
      href: '/user/community'
    }
  ], []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Thao tác nhanh</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {quickActions.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl relative overflow-hidden"
            style={
              item.image
                ? {
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
                : {}
            }
          >
            <div className="relative z-10 text-left">
              <h3 className="font-bold text-xl mb-2 text-white">{item.title}</h3>
              <p className="text-sm text-cyan-50">{item.description}</p>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-cyan-600 opacity-40 rounded-2xl"></div>
          </div>
        ))}
      </div>
    </div>

  );
});

// Tách Pet Cards Section thành component riêng
const PetCardsSection = memo(function PetCardsSection({
  userId,
  refreshKey,
  petsLoading,
  onPetsLoaded,
  onRefresh
}: {
  userId: string;
  refreshKey: number;
  petsLoading: boolean;
  onPetsLoaded: (count: number) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">

      </div>
      <PetCards key={refreshKey} userId={userId} onPetsLoaded={onPetsLoaded} />
    </div>
  );
});

export default function PetCareApp() {
  const [userId, setUserId] = useState<string | null>(null);
  const [hasPets, setHasPets] = useState<boolean>(false);
  const [petsLoading, setPetsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    const parseJwt = (token: string | null) => {
      if (!token) return null;
      try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      } catch (e) {
        console.error('Failed to parse JWT', e);
        return null;
      }
    };

    // Only run on client-side
    if (typeof window === 'undefined') return;

    try {
      const token = localStorage.getItem('authToken');
      let id = localStorage.getItem('userId');

      if (!id && token) {
        const decoded = parseJwt(token);
        const resolved = decoded?.userId ?? decoded?.id ?? decoded?.sub ?? null;
        if (resolved) {
          id = String(resolved);
          localStorage.setItem('userId', id);
        }
      }

      if (id) setUserId(id);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  // Callback được memo hóa để tránh re-render PetCards
  const handlePetsLoaded = useCallback((petsCount: number) => {
    setHasPets(petsCount > 0);
    setPetsLoading(false);
  }, []);

  // Hàm refresh pets được memo hóa
  const handleRefreshPets = useCallback(() => {
    setPetsLoading(true);
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-12">
      {/* Header */}
      <h1 className="text-5xl font-extrabold mb-12 text-teal-800 tracking-tight whitespace-nowrap">
        Trang chính
      </h1>

      {/* Timeline Lịch Hẹn - Simplified */}
      <AppointmentTimeline />

      {/* Pet Registration Banner - Chỉ hiện khi chưa có thú cưng */}
      {(!petsLoading && !hasPets) && <PetRegistrationBanner />}

      {/* Pet Cards Section với Refresh Button */}
      {userId ? (
        <PetCardsSection
          userId={userId}
          refreshKey={refreshKey}
          petsLoading={petsLoading}
          onPetsLoaded={handlePetsLoaded}
          onRefresh={handleRefreshPets}
        />
      ) : (
        <div className="text-sm text-gray-500">Loading pets...</div>
      )}

      {/* Recently Visited */}
      <RecentlyVisited />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}