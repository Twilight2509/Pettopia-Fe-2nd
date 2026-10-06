'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { Filter, X, Sun, Sunset, Moon } from 'lucide-react';
import type { AppointmentFilters } from '../_types';
import { formatDate, getStatusLabel } from '../_utils';

interface AppointmentFiltersPanelProps {
    filters: AppointmentFilters;
    setFilters: Dispatch<SetStateAction<AppointmentFilters>>;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    onReset: () => void;
    shownCount: number;
    total: number;
}

const FIELD = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition';
const LABEL = 'block text-sm font-medium mb-2 text-gray-700';

function FilterChip({ children, onRemove }: { children: ReactNode; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
            {children}
            <button onClick={onRemove} className="hover:text-teal-900">
                <X size={12} />
            </button>
        </span>
    );
}

export default function AppointmentFiltersPanel({
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    onReset,
    shownCount,
    total,
}: AppointmentFiltersPanelProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <Filter size={20} /> Bộ lọc
                </h2>
                <button
                    onClick={onReset}
                    className="text-teal-600 hover:text-teal-800 text-sm flex items-center gap-1 font-medium"
                >
                    <X size={16} /> Xóa bộ lọc
                </button>
            </div>

            <div className="mb-4">
                <label className={LABEL}>Tìm kiếm</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        placeholder="Tìm kiếm theo ID (chính xác) hoặc tên khách hàng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className={LABEL}>Trạng thái</label>
                    <select
                        value={filters.status}
                        onChange={e => setFilters({ ...filters, status: e.target.value as any })}
                        className={FIELD}
                    >
                        <option value="all">Tất cả</option>
                        <option value="Confirmed">Đã xác nhận</option>
                        <option value="Pending_Confirmation">Chờ xác nhận</option>
                        <option value="Cancelled">Đã hủy</option>
                    </select>
                </div>
                <div>
                    <label className={LABEL}>Từ ngày</label>
                    <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
                        className={FIELD}
                    />
                </div>
                <div>
                    <label className={LABEL}>Đến ngày</label>
                    <input
                        type="date"
                        value={filters.dateTo}
                        onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
                        className={FIELD}
                    />
                </div>
                <div>
                    <label className={LABEL}>Người tạo</label>
                    <select
                        value={filters.createdBy}
                        onChange={e => setFilters({ ...filters, createdBy: e.target.value as any })}
                        className={FIELD}
                    >
                        <option value="all">Tất cả</option>
                        <option value="customer">Khách hàng</option>
                        <option value="partner">Đối tác</option>
                    </select>
                </div>
            </div>

            {(filters.status !== 'all' || filters.dateFrom || filters.dateTo || filters.createdBy !== 'all' || searchQuery.trim()) && (
                <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                        <Filter className="w-4 h-4 text-teal-600 mt-0.5" />
                        <span className="text-sm font-medium text-teal-900">Đang lọc theo:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {filters.status !== 'all' && (
                            <FilterChip onRemove={() => setFilters(prev => ({ ...prev, status: 'all' }))}>
                                Trạng thái: {getStatusLabel(filters.status)}
                            </FilterChip>
                        )}
                        {filters.dateFrom && (
                            <FilterChip onRemove={() => setFilters(prev => ({ ...prev, dateFrom: '' }))}>
                                Từ: {formatDate(filters.dateFrom)}
                            </FilterChip>
                        )}
                        {filters.dateTo && (
                            <FilterChip onRemove={() => setFilters(prev => ({ ...prev, dateTo: '' }))}>
                                Đến: {formatDate(filters.dateTo)}
                            </FilterChip>
                        )}
                        {filters.createdBy !== 'all' && (
                            <FilterChip onRemove={() => setFilters(prev => ({ ...prev, createdBy: 'all' }))}>
                                Người tạo: {filters.createdBy === 'customer' ? 'Khách hàng' : 'Đối tác'}
                            </FilterChip>
                        )}
                        {searchQuery.trim() && (
                            <FilterChip onRemove={() => setSearchQuery('')}>
                                Tìm kiếm: {searchQuery}
                            </FilterChip>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                <div className="flex flex-col gap-3">
                    <div>
                        Hiển thị <strong className="text-gray-900">{shownCount}</strong> / <strong className="text-gray-900">{total}</strong> lịch hẹn
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-black-700">Chú thích:</span>
                            <div className="flex items-center gap-1">
                                <Sun className="w-5 h-5 text-black-500" />
                                <span className="text-black-500">Sáng</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-700">
                                <Sunset className="w-5 h-5 text-black-500" />
                                <span>Chiều</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-700">
                                <Moon className="w-5 h-5 text-black-500" />
                                <span>Tối</span>
                            </div>
                            <span className="mx-1">•</span>
                            <span className="text-gray-700">Màu sắc tượng trưng cho 1 khách hàng</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-full bg-purple-100 mr-1 text-gray-700"></span>
                            <span className="text-gray-700">Khách = Khách hàng tạo</span>
                            <span className="inline-block w-3 h-3 rounded-full bg-teal-100 mr-1 ml-3 text-gray-700"></span>
                            <span className="text-gray-700">Đối tác = Phòng khám tạo</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
