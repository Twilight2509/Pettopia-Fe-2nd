'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { getAppointments, updateAppointmentStatus, getAppointmentDetail, type AppointmentData } from '@/services/partner/clinicService';
import { getCustomerById } from '@/services/customer/customerService';
import type { AppointmentDetail, AppointmentFilters, ExtendedAppointment, ViewMode } from '../_types';
import { buildCustomerOrderMap, filterAppointments, getWeekDays, LONG_DATE_OPTIONS, toDateKey } from '../_utils';

const enrichAppointment = async (apt: AppointmentData): Promise<ExtendedAppointment> => {
    const enriched: ExtendedAppointment = { ...apt };

    const customerId = apt.customer || apt.user_id;
    if (customerId) {
        try {
            const customerData = await getCustomerById(customerId);
            const fullname = customerData?.data?.fullname || customerData?.fullname;
            if (fullname) {
                enriched.customer_name = fullname;
            } else {
                enriched.customer_name = `Khách hàng ${customerId.substring(0, 8)}`;
            }
        } catch (err) {
            console.warn(`Không thể lấy thông tin khách hàng ${customerId}:`, err);
            enriched.customer_name = `Khách hàng ${customerId.substring(0, 8)}`;
        }
    } else {
        enriched.customer_name = 'Khách hàng';
    }

    if (apt.date) {
        try {
            const dateObj = new Date(apt.date);
            if (!isNaN(dateObj.getTime())) {
                enriched.time = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
            }
        } catch {
            enriched.time = 'N/A';
        }
    }

    return enriched;
};

export function useAppointments() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showSuccess, showError } = useToast();
    const [appointments, setAppointments] = useState<ExtendedAppointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
    const [appointmentDetail, setAppointmentDetail] = useState<AppointmentDetail | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [cancellingAppointmentId, setCancellingAppointmentId] = useState<string | null>(null);

    useEffect(() => {
        const appointmentId = searchParams.get('appointmentId');
        if (appointmentId && appointments.length > 0) {
            const apt = appointments.find(a => (a.id || a._id) === appointmentId);
            if (apt) {
                const aptDate = new Date(apt.date);
                setCurrentDate(aptDate);
                setViewMode('day');
                setSelectedAppointmentId(appointmentId);
                loadAppointmentDetail(appointmentId);
                router.replace('/clinic/appointment');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, appointments]);

    const [filters, setFilters] = useState<AppointmentFilters>({
        status: 'all',
        dateFrom: '',
        dateTo: '',
        createdBy: 'all'
    });
    const [searchQuery, setSearchQuery] = useState('');

    const loadAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const currentLimit = viewMode === 'table' ? limit : 1000;
            const currentPage = viewMode === 'table' ? page : 1;
            const response = await getAppointments(currentPage, currentLimit);
            if (response.status === 'success' && response.data) {
                const enrichedAppointments: ExtendedAppointment[] = await Promise.all(
                    response.data.map(enrichAppointment)
                );

                setAppointments(enrichedAppointments);
                setTotal(response.pagination?.total || enrichedAppointments.length);
                setTotalPages(response.pagination?.totalPages || 1);
            } else {
                setAppointments([]);
                setTotal(0);
            }
        } catch (err: any) {
            setError(err?.message || 'Không thể tải danh sách lịch hẹn');
            setAppointments([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, viewMode]);

    useEffect(() => {
        if (viewMode === 'table') {
            if (page !== 1) {
                setPage(1);
            } else {
                loadAppointments();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, viewMode]);

    const filteredAppointments = useMemo(
        () => filterAppointments(appointments, filters, searchQuery),
        [appointments, filters, searchQuery]
    );

    const customerOrderMap = useMemo(() => buildCustomerOrderMap(appointments), [appointments]);

    const getCustomerOrder = (customerId: string | undefined, customerName: string | undefined) => {
        const customerKey = customerId || customerName || 'unknown';
        return customerOrderMap.get(customerKey) || 0;
    };

    const resetFilters = () => {
        setFilters({ status: 'all', dateFrom: '', dateTo: '', createdBy: 'all' });
        setSearchQuery('');
    };

    const loadAppointmentDetail = async (appointmentId: string) => {
        setLoadingDetail(true);
        setError(null);
        try {
            const response = await getAppointmentDetail(appointmentId);
            if (response.status === 'success' && response.data) {
                const detail = response.data as any;
                if (detail._id && !detail.id) {
                    detail.id = detail._id;
                }
                setAppointmentDetail(detail);
            }
        } catch (err: any) {
            setError(err?.message || 'Không thể tải chi tiết lịch hẹn');
            setAppointmentDetail(null);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleUpdateStatus = async (appointmentId: string, newStatus: string, cancelReason?: string) => {
        setUpdatingStatus(true);
        setError(null);
        try {
            await updateAppointmentStatus(appointmentId, newStatus, cancelReason);
            await loadAppointments();
            if (appointmentDetail && (appointmentDetail.id === appointmentId || selectedAppointmentId === appointmentId)) {
                await loadAppointmentDetail(appointmentId);
            }
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('appointmentUpdated'));
                localStorage.setItem('appointment_updated', Date.now().toString());
            }
            const statusText = newStatus === 'Confirmed' ? 'xác nhận' : newStatus === 'Cancelled' ? 'hủy' : 'cập nhật';
            showSuccess(`Đã ${statusText} lịch hẹn thành công!`, undefined, () => {
                loadAppointments();
            });
        } catch (err: any) {
            const errorMessage = err?.message || 'Không thể cập nhật trạng thái lịch hẹn';
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleCancelClick = (appointmentId?: string) => {
        const idToCancel = appointmentId || appointmentDetail?.id;
        if (!idToCancel) return;
        setCancellingAppointmentId(idToCancel);
        setShowCancelModal(true);
        setCancelReason('');
    };

    const handleConfirmCancel = async () => {
        if (!cancellingAppointmentId) return;
        if (!cancelReason.trim()) {
            setError('Vui lòng nhập lý do hủy');
            return;
        }
        const appointmentIdToCancel = cancellingAppointmentId;
        const reasonToCancel = cancelReason.trim();

        setShowCancelModal(false);
        setCancelReason('');
        setCancellingAppointmentId(null);

        await handleUpdateStatus(appointmentIdToCancel, 'Cancelled', reasonToCancel);
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
        setCancelReason('');
        setCancellingAppointmentId(null);
        setError(null);
    };

    const goToToday = () => setCurrentDate(new Date());

    const handleRowClick = async (appointmentId: string) => {
        const apt = appointments.find(a => (a.id || a._id) === appointmentId);
        if (apt) {
            const aptDate = new Date(apt.date);
            setCurrentDate(aptDate);
            setViewMode('day');
            setSelectedAppointmentId(appointmentId);
            await loadAppointmentDetail(appointmentId);
        }
    };

    const handleAppointmentClick = async (appointmentId: string) => {
        setSelectedAppointmentId(appointmentId);
        await loadAppointmentDetail(appointmentId);
    };

    const closeDetailView = () => {
        setSelectedAppointmentId(null);
        setAppointmentDetail(null);
    };

    const navigateDate = (dir: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (viewMode === 'month') {
            newDate.setMonth(newDate.getMonth() + (dir === 'next' ? 1 : -1));
        } else if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + (dir === 'next' ? 7 : -7));
        } else if (viewMode === 'day') {
            newDate.setDate(newDate.getDate() + (dir === 'next' ? 1 : -1));
        }
        setCurrentDate(newDate);
    };

    const setDateFilterAndSwitchToTable = (date: Date) => {
        const dateKey = toDateKey(date);
        setFilters(prev => ({ ...prev, dateFrom: dateKey, dateTo: dateKey }));
        setPage(1);
        setViewMode('table');
    };

    const changeViewMode = (mode: ViewMode) => {
        setViewMode(mode);
        if (mode === 'table') {
            setPage(1);
        }
    };

    const getViewTitle = () => {
        if (viewMode === 'month') {
            return currentDate.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' });
        }
        if (viewMode === 'week') {
            const days = getWeekDays(currentDate);
            return `${days[0].getDate()}/${days[0].getMonth() + 1} - ${days[6].getDate()}/${days[6].getMonth() + 1}, ${currentDate.getFullYear()}`;
        }
        if (viewMode === 'day') {
            return currentDate.toLocaleDateString('vi-VN', LONG_DATE_OPTIONS);
        }
        return 'Danh sách lịch hẹn';
    };

    return {
        appointments,
        filteredAppointments,
        loading,
        error,
        setError,
        page,
        setPage,
        total,
        totalPages,
        viewMode,
        changeViewMode,
        currentDate,
        selectedAppointmentId,
        appointmentDetail,
        loadingDetail,
        showCancelModal,
        cancelReason,
        setCancelReason,
        updatingStatus,
        filters,
        setFilters,
        searchQuery,
        setSearchQuery,
        loadAppointments,
        getCustomerOrder,
        resetFilters,
        handleUpdateStatus,
        handleCancelClick,
        handleConfirmCancel,
        closeCancelModal,
        goToToday,
        handleRowClick,
        handleAppointmentClick,
        closeDetailView,
        navigateDate,
        setDateFilterAndSwitchToTable,
        getViewTitle,
    };
}

export type UseAppointmentsReturn = ReturnType<typeof useAppointments>;
