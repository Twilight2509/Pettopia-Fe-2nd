'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Spinner } from '@/components/ui';
import type { ExtendedAppointment } from '../_types';
import { formatDate, getShiftLabel, getStatusColor, getStatusLabel } from '../_utils';

interface AppointmentTableProps {
    appointments: ExtendedAppointment[];
    loading: boolean;
    page: number;
    totalPages: number;
    total: number;
    setPage: (updater: (p: number) => number) => void;
    onRowClick: (appointmentId: string) => void;
    onUpdateStatus: (appointmentId: string, newStatus: string) => Promise<void>;
    onCancelClick: (appointmentId: string) => void;
}

const TH = 'px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider';
const PAGE_BTN = 'px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition text-sm font-medium';

export default function AppointmentTable({
    appointments,
    loading,
    page,
    totalPages,
    total,
    setPage,
    onRowClick,
    onUpdateStatus,
    onCancelClick,
}: AppointmentTableProps) {
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
            <div className="overflow-x-auto w-full">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className={TH}>Ngày</th>
                            <th className={TH}>Ca</th>
                            <th className={TH}>Trạng thái</th>
                            <th className={TH}>Người tạo</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading && appointments.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex justify-center items-center">
                                        <Spinner size="sm" color="teal" className="mr-2" />
                                        <span>Đang tải dữ liệu...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : appointments.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    Không có lịch hẹn nào phù hợp
                                </td>
                            </tr>
                        ) : (
                            appointments.map((apt) => {
                                const id = apt.id || apt._id;

                                return (
                                    <tr
                                        key={id}
                                        className="hover:bg-gray-50 transition cursor-pointer"
                                        onClick={() => onRowClick(id)}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {formatDate(apt.date)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {getShiftLabel(apt.shift)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs border font-medium ${getStatusColor(apt.status)}`}>
                                                {getStatusLabel(apt.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${apt.created_by === "customer"
                                                        ? "bg-purple-100 text-purple-800"
                                                        : "bg-teal-100 text-teal-800"
                                                    }`}
                                            >
                                                {apt.created_by === "customer" ? "Khách" : "Đối tác"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
                                                {apt.status === "Pending_Confirmation" && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setUpdatingId(id);
                                                                onUpdateStatus(id, "Confirmed").finally(() =>
                                                                    setUpdatingId(null)
                                                                );
                                                            }}
                                                            disabled={updatingId === id || loading}
                                                            className="group relative"
                                                            title="Xác nhận lịch hẹn"
                                                        >
                                                            {updatingId === id ? (
                                                                <Spinner size="sm" color="gray" />
                                                            ) : (
                                                                <CheckCircle className="h-5 w-5 text-green-600 hover:text-green-700 transition" />
                                                            )}
                                                        </button>

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onCancelClick(id);
                                                            }}
                                                            disabled={updatingId === id || loading}
                                                            className="group relative"
                                                            title="Hủy lịch hẹn"
                                                        >
                                                            <XCircle className="h-5 w-5 text-red-600 hover:text-red-700 transition" />
                                                        </button>
                                                    </>
                                                )}

                                                {apt.status === "Confirmed" && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onCancelClick(id);
                                                        }}
                                                        disabled={updatingId === id || loading}
                                                        className="group relative"
                                                        title="Hủy lịch hẹn"
                                                    >
                                                        <XCircle className="h-5 w-5 text-red-600 hover:text-red-700 transition" />
                                                    </button>
                                                )}

                                                {apt.status === "Cancelled" && (
                                                    <span className="text-gray-400 text-xs">Đã hủy</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="text-sm text-gray-700">
                        Trang <span className="font-medium">{page}</span> / <span className="font-medium">{totalPages}</span>
                        <span className="mx-2">•</span>
                        Tổng <span className="font-medium">{total}</span> lịch hẹn
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page <= 1 || loading}
                            className={PAGE_BTN}
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages || loading}
                            className={PAGE_BTN}
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
