'use client';

import { X, XCircle } from 'lucide-react';
import { useAppointments } from './_hooks/useAppointments';
import AppointmentToolbar from './_components/AppointmentToolbar';
import AppointmentFiltersPanel from './_components/AppointmentFiltersPanel';
import MonthView from './_components/MonthView';
import WeekView from './_components/WeekView';
import DayView from './_components/DayView';
import AppointmentTable from './_components/AppointmentTable';
import CancelReasonModal from './_components/CancelReasonModal';

export default function AppointmentsPage() {
    const a = useAppointments();

    return (
        <div className="w-full">
            <div className="w-full">
                <AppointmentToolbar
                    viewMode={a.viewMode}
                    viewTitle={a.getViewTitle()}
                    loading={a.loading}
                    onNavigate={a.navigateDate}
                    onToday={a.goToToday}
                    onRefresh={() => a.loadAppointments()}
                    onChangeViewMode={a.changeViewMode}
                />

                {a.error && (
                    <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <XCircle className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm text-red-800">{a.error}</p>
                            </div>
                            <button
                                onClick={() => a.setError(null)}
                                className="ml-3 flex-shrink-0 text-red-400 hover:text-red-600"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}

                <AppointmentFiltersPanel
                    filters={a.filters}
                    setFilters={a.setFilters}
                    searchQuery={a.searchQuery}
                    setSearchQuery={a.setSearchQuery}
                    onReset={a.resetFilters}
                    shownCount={a.filteredAppointments.length}
                    total={a.total}
                />

                {a.viewMode === 'month' && (
                    <MonthView
                        currentDate={a.currentDate}
                        appointments={a.filteredAppointments}
                        getCustomerOrder={a.getCustomerOrder}
                        onSelectDate={a.setDateFilterAndSwitchToTable}
                    />
                )}
                {a.viewMode === 'week' && (
                    <WeekView
                        currentDate={a.currentDate}
                        appointments={a.filteredAppointments}
                        getCustomerOrder={a.getCustomerOrder}
                        onSelectDate={a.setDateFilterAndSwitchToTable}
                    />
                )}
                {a.viewMode === 'day' && (
                    <DayView
                        currentDate={a.currentDate}
                        appointments={a.filteredAppointments}
                        getCustomerOrder={a.getCustomerOrder}
                        selectedAppointmentId={a.selectedAppointmentId}
                        appointmentDetail={a.appointmentDetail}
                        loadingDetail={a.loadingDetail}
                        updatingStatus={a.updatingStatus}
                        onAppointmentClick={a.handleAppointmentClick}
                        onCloseDetail={a.closeDetailView}
                        onConfirm={(id) => a.handleUpdateStatus(id, 'Confirmed')}
                        onCancel={() => a.handleCancelClick()}
                    />
                )}
                {a.viewMode === 'table' && (
                    <AppointmentTable
                        appointments={a.filteredAppointments}
                        loading={a.loading}
                        page={a.page}
                        totalPages={a.totalPages}
                        total={a.total}
                        setPage={a.setPage}
                        onRowClick={a.handleRowClick}
                        onUpdateStatus={a.handleUpdateStatus}
                        onCancelClick={a.handleCancelClick}
                    />
                )}
            </div>

            <CancelReasonModal
                open={a.showCancelModal}
                cancelReason={a.cancelReason}
                setCancelReason={a.setCancelReason}
                error={a.error}
                updatingStatus={a.updatingStatus}
                onClose={a.closeCancelModal}
                onConfirm={a.handleConfirmCancel}
            />
        </div>
    );
}
