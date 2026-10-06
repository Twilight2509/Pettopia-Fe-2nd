'use client';

import type { ExtendedAppointment } from '../_types';
import { getAppointmentsForDate, getCustomerColor, getDaysInMonth, toDateKey } from '../_utils';
import { getShiftIcon } from './ShiftIcon';

interface MonthViewProps {
    currentDate: Date;
    appointments: ExtendedAppointment[];
    getCustomerOrder: (customerId: string | undefined, customerName: string | undefined) => number;
    onSelectDate: (date: Date) => void;
}

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export default function MonthView({ currentDate, appointments, getCustomerOrder, onSelectDate }: MonthViewProps) {
    const days = getDaysInMonth(currentDate);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full overflow-x-auto">
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200 min-w-[700px]">
                {WEEK_DAYS.map(day => (
                    <div key={day} className="p-2 md:p-4 text-center font-semibold text-gray-700 text-xs md:text-sm">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 min-w-[700px]">
                {days.map((day, idx) => {
                    const appts = getAppointmentsForDate(appointments, day.date);
                    const displayed = appts.slice(0, 3);
                    const more = appts.length - 3;
                    const todayKey = toDateKey(new Date());

                    return (
                        <div
                            key={idx}
                            className={`min-h-[100px] md:min-h-[120px] p-1 md:p-2 border-r border-b border-gray-200 last:border-r-0 ${!day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                                } hover:bg-gray-50 transition-colors`}
                        >
                            <div
                                className={`text-sm font-medium mb-1 w-8 h-8 flex items-center justify-center rounded-full ${toDateKey(day.date) === todayKey
                                        ? 'bg-teal-600 text-white'
                                        : day.isCurrentMonth
                                            ? 'text-gray-900'
                                            : 'text-gray-400'
                                    }`}
                            >
                                {day.date.getDate()}
                            </div>
                            <div className="space-y-1 text-xs">
                                {displayed.map(apt => {
                                    const order = getCustomerOrder(apt.customer || apt.user_id, apt.customer_name);
                                    return (
                                        <div
                                            key={apt.id || apt._id}
                                            onClick={() => onSelectDate(day.date)}
                                            className={`${getCustomerColor(apt.customer || apt.user_id, apt.customer_name)} text-white px-2 py-1 rounded-lg cursor-pointer truncate transition-colors flex items-center gap-1.5 group relative`}
                                            title={apt.customer_name || 'Khách hàng'}
                                        >
                                            <span className="flex-shrink-0">{getShiftIcon(apt.shift)}</span>
                                            <span className="truncate">Đơn {order}</span>
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                                                {apt.customer_name || 'Khách hàng'}
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {more > 0 && (
                                    <button
                                        onClick={() => onSelectDate(day.date)}
                                        className="text-teal-600 hover:text-teal-800 font-medium"
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
