'use client';

import { ChevronRight } from 'lucide-react';
import type { AppointmentDetail, ExtendedAppointment } from '../_types';
import { getAppointmentsForDate, LONG_DATE_OPTIONS } from '../_utils';
import AppointmentDetailView from './AppointmentDetailView';

interface DayViewProps {
    currentDate: Date;
    appointments: ExtendedAppointment[];
    getCustomerOrder: (customerId: string | undefined, customerName: string | undefined) => number;
    selectedAppointmentId: string | null;
    appointmentDetail: AppointmentDetail | null;
    loadingDetail: boolean;
    updatingStatus: boolean;
    onAppointmentClick: (appointmentId: string) => void;
    onCloseDetail: () => void;
    onConfirm: (appointmentId: string) => void;
    onCancel: () => void;
}

export default function DayView({
    currentDate,
    appointments,
    getCustomerOrder,
    selectedAppointmentId,
    appointmentDetail,
    loadingDetail,
    updatingStatus,
    onAppointmentClick,
    onCloseDetail,
    onConfirm,
    onCancel,
}: DayViewProps) {
    if (selectedAppointmentId && appointmentDetail) {
        return (
            <AppointmentDetailView
                currentDate={currentDate}
                appointmentDetail={appointmentDetail}
                loadingDetail={loadingDetail}
                updatingStatus={updatingStatus}
                onBack={onCloseDetail}
                onConfirm={onConfirm}
                onCancel={onCancel}
            />
        );
    }

    const appts = getAppointmentsForDate(appointments, currentDate);
    const grouped = appts.reduce((acc, apt) => {
        const customerKey = apt.customer || apt.user_id || apt.customer_name || 'unknown';
        if (!acc[customerKey]) {
            acc[customerKey] = {
                apts: [],
                customerName: apt.customer_name || 'Khách hàng',
                order: getCustomerOrder(apt.customer || apt.user_id, apt.customer_name)
            };
        }
        acc[customerKey].apts.push(apt);
        return acc;
    }, {} as Record<string, { apts: typeof appts; customerName: string; order: number }>);

    const customerKeys = Object.keys(grouped);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full">
            <div className="bg-gray-50 p-6 text-center border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                    {currentDate.toLocaleDateString('vi-VN', LONG_DATE_OPTIONS)}
                </h2>
            </div>

            <div className="p-6 space-y-4">
                {customerKeys.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">Không có lịch hẹn nào trong ngày</p>
                ) : (
                    customerKeys.map(customerKey => {
                        const customerData = grouped[customerKey];
                        const custAppts = customerData.apts;
                        const totalPets = custAppts.reduce((s, a) => s + (a.pet_ids?.length || 0), 0);
                        const firstApt = custAppts[0];
                        const firstAptId = firstApt?.id || firstApt?._id;

                        return (
                            <div
                                key={customerKey}
                                onClick={() => firstAptId && onAppointmentClick(firstAptId)}
                                className="border-2 border-gray-200 rounded-xl p-5 hover:border-teal-500 hover:shadow-md cursor-pointer transition-all group relative"
                                title={customerData.customerName}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold text-lg text-gray-900">Đơn {customerData.order}</h4>
                                        <p className="text-gray-600">
                                            {custAppts.length} lịch hẹn • {totalPets} thú cưng
                                        </p>
                                    </div>
                                    <ChevronRight className="text-gray-400" />
                                </div>
                                <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                                    {customerData.customerName}
                                    <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
