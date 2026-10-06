'use client';

import { Calendar, Filter, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import NotificationBell from '@/components/common/NotificationBell';
import type { ViewMode } from '../_types';
import { LONG_DATE_OPTIONS } from '../_utils';

interface AppointmentToolbarProps {
    viewMode: ViewMode;
    viewTitle: string;
    loading: boolean;
    onNavigate: (dir: 'prev' | 'next') => void;
    onToday: () => void;
    onRefresh: () => void;
    onChangeViewMode: (mode: ViewMode) => void;
}

const VIEW_MODES = ['month', 'week', 'day', 'table'] as const;

export default function AppointmentToolbar({
    viewMode,
    viewTitle,
    loading,
    onNavigate,
    onToday,
    onRefresh,
    onChangeViewMode,
}: AppointmentToolbarProps) {
    return (
        <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Danh sách lịch hẹn</h1>
                    <p className="mt-1 text-sm md:text-base text-gray-600">{new Date().toLocaleDateString('vi-VN', LONG_DATE_OPTIONS)}</p>
                </div>
                <NotificationBell notificationCount={1} />
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        <button
                            onClick={() => onNavigate('prev')}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => onNavigate('next')}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <button
                        onClick={onToday}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                        Hôm nay
                    </button>
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Làm mới danh sách"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <div className="min-w-0">
                        <p className="text-sm md:text-base text-gray-700 font-medium">{viewTitle}</p>
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {VIEW_MODES.map(mode => (
                        <button
                            key={mode}
                            onClick={() => onChangeViewMode(mode)}
                            className={`px-3 md:px-4 py-2 rounded-lg flex items-center gap-1 md:gap-2 transition-colors font-medium text-sm ${viewMode === mode
                                    ? 'bg-teal-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {mode === 'table' && <Filter size={16} className="md:w-[18px] md:h-[18px]" />}
                            {mode === 'month' && <Calendar size={16} className="md:w-[18px] md:h-[18px]" />}
                            {mode === 'month' && <span className="hidden sm:inline">Tháng</span>}
                            {mode === 'week' && <span className="hidden sm:inline">Tuần</span>}
                            {mode === 'day' && <span className="hidden sm:inline">Ngày</span>}
                            {mode === 'table' && <span className="hidden sm:inline">Bảng</span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
