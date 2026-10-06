'use client';

import type { ExtendedAppointment } from '../_types';
import { getAppointmentsForDate, getCustomerColor, getWeekDays, toDateKey } from '../_utils';
import { getShiftIcon } from './ShiftIcon';

interface WeekViewProps {
    currentDate: Date;
    appointments: ExtendedAppointment[];
    getCustomerOrder: (customerId: string | undefined, customerName: string | undefined) => number;
    onSelectDate: (date: Date) => void;
}

export default function WeekView({ currentDate, appointments, getCustomerOrder, onSelectDate }: WeekViewProps) {
    const days = getWeekDays(currentDate);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full overflow-x-auto">
            <div className="grid grid-cols-7 min-w-[800px]">
                {days.map((date, i) => {
                    const appts = getAppointmentsForDate(appointments, date);
                    const displayed = appts.slice(0, 6);
                    const more = appts.length - 6;

                    return (
                        <div key={i} className="border-r border-gray-200 last:border-r-0">
                            <div className="bg-gray-50 p-3 text-center border-b border-gray-200">
                                <div className="text-sm text-gray-600">
                                    {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                                </div>

                                <div className="h-10 flex items-center justify-center">
                                    <div
                                        className={`text-lg font-bold ${toDateKey(date) === toDateKey(new Date())
                                                ? 'bg-teal-600 text-white w-9 h-9 rounded-full flex items-center justify-center'
                                                : ''
                                            }`}
                                    >
                                        {date.getDate()}
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 space-y-2 min-h-96">
                                {displayed.map(apt => {
                                    const order = getCustomerOrder(apt.customer || apt.user_id, apt.customer_name);
                                    return (
                                        <div
                                            key={apt.id || apt._id}
                                            onClick={() => onSelectDate(date)}
                                            className={`${getCustomerColor(apt.customer || apt.user_id, apt.customer_name)} text-white p-2 rounded-lg text-xs cursor-pointer transition-colors flex items-center gap-2 hover:opacity-90 group relative`}
                                            title={apt.customer_name || 'Khách hàng'}
                                        >
                                            <span className="flex-shrink-0">{getShiftIcon(apt.shift)}</span>
                                            <div className="font-medium truncate">Đơn {order}</div>
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                                                {apt.customer_name || 'Khách hàng'}
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {more > 0 && (
                                    <button
                                        onClick={() => onSelectDate(date)}
                                        className="w-full text-center text-teal-600 hover:text-teal-800 text-xs font-medium"
                                    >
                                        +{more} lịch khác
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
