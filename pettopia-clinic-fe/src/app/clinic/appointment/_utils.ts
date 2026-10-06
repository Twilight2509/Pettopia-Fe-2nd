import type { AppointmentFilters, ExtendedAppointment } from './_types';

export const toDateKey = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const LONG_DATE_OPTIONS: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'Pending_Confirmation': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Confirmed': return 'bg-green-100 text-green-800 border-green-300';
        case 'Cancelled': return 'bg-red-100 text-red-800 border-red-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

export const getStatusLabel = (status: string) => {
    switch (status) {
        case 'Pending_Confirmation': return 'Chờ ';
        case 'Confirmed': return 'Xác nhận';
        case 'Cancelled': return 'Đã hủy';
        default: return status;
    }
};

export const getShiftLabel = (shift: string) => {
    switch (shift?.toLowerCase()) {
        case 'morning': return 'Sáng';
        case 'afternoon': return 'Chiều';
        case 'evening': return 'Tối';
        default: return shift || 'N/A';
    }
};

const CUSTOMER_COLORS = [
    'bg-blue-500 hover:bg-blue-600',
    'bg-teal-500 hover:bg-teal-600',
    'bg-green-500 hover:bg-green-600',
    'bg-amber-500 hover:bg-amber-600',
    'bg-orange-500 hover:bg-orange-600',
    'bg-red-500 hover:bg-red-600',
    'bg-pink-500 hover:bg-pink-600',
    'bg-purple-500 hover:bg-purple-600',
    'bg-indigo-500 hover:bg-indigo-600',
    'bg-cyan-500 hover:bg-cyan-600',
];

export const getCustomerColor = (customerId: string | undefined, customerName: string | undefined) => {
    const id = customerId || customerName || 'default';
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return CUSTOMER_COLORS[Math.abs(hash) % CUSTOMER_COLORS.length];
};

export const buildCustomerOrderMap = (appointments: ExtendedAppointment[]) => {
    const customerMap = new Map<string, number>();
    let order = 1;
    appointments.forEach(apt => {
        const customerKey = apt.customer || apt.user_id || apt.customer_name || 'unknown';
        if (!customerMap.has(customerKey)) {
            customerMap.set(customerKey, order++);
        }
    });
    return customerMap;
};

export const formatDate = (dateStr: string) => {
    try {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [year, month, day] = dateStr.split('-');
            return `${day}/${month}/${year}`;
        }
        return new Date(dateStr).toLocaleDateString('vi-VN');
    } catch {
        return dateStr;
    }
};

export const filterAppointments = (
    appointments: ExtendedAppointment[],
    filters: AppointmentFilters,
    searchQuery: string,
) => {
    let filtered = [...appointments];

    if (filters.status !== 'all') {
        filtered = filtered.filter(a => a.status === filters.status);
    }
    if (filters.dateFrom) {
        filtered = filtered.filter(a => {
            try {
                return toDateKey(new Date(a.date)) >= filters.dateFrom;
            } catch {
                return false;
            }
        });
    }
    if (filters.dateTo) {
        filtered = filtered.filter(a => {
            try {
                return toDateKey(new Date(a.date)) <= filters.dateTo;
            } catch {
                return false;
            }
        });
    }
    if (filters.createdBy !== 'all') {
        filtered = filtered.filter(a => (a.created_by || '') === filters.createdBy);
    }

    if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(a => {
            const appointmentId = (a.id || a._id || '').toLowerCase();
            const customerName = (a.customer_name || '').toLowerCase();
            const customerId = (a.customer || a.user_id || '').toLowerCase();
            if (appointmentId === query || customerId === query) {
                return true;
            }
            return customerName.includes(query);
        });
    }

    return filtered;
};

export const getAppointmentsForDate = (appointments: ExtendedAppointment[], date: Date) => {
    const key = toDateKey(date);
    return appointments.filter(a => {
        try {
            return toDateKey(new Date(a.date)) === key;
        } catch {
            return false;
        }
    });
};

export const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDow = (firstDay.getDay() + 6) % 7;

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    for (let i = startDow - 1; i >= 0; i--) {
        days.push({ date: new Date(year, month, -i), isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    const total = days.length;
    const remaining = total < 42 ? 42 - total : 35 - total;
    for (let i = 1; i <= remaining; i++) {
        days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
};

export const getWeekDays = (currentDate: Date) => {
    const start = new Date(currentDate);
    const dow = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - dow);

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    });
};
