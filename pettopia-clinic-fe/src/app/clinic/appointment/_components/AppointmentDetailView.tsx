'use client';

import { ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import { Spinner } from '@/components/ui';
import type { AppointmentDetail } from '../_types';
import { formatDate, getShiftLabel, getStatusColor, getStatusLabel, LONG_DATE_OPTIONS } from '../_utils';

interface AppointmentDetailViewProps {
    currentDate: Date;
    appointmentDetail: AppointmentDetail;
    loadingDetail: boolean;
    updatingStatus: boolean;
    onBack: () => void;
    onConfirm: (appointmentId: string) => void;
    onCancel: () => void;
}

export default function AppointmentDetailView({
    currentDate,
    appointmentDetail,
    loadingDetail,
    updatingStatus,
    onBack,
    onConfirm,
    onCancel,
}: AppointmentDetailViewProps) {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full">
                <div className="bg-gray-50 p-6 border-b border-gray-200">
                    <button
                        onClick={onBack}
                        className="mb-4 text-teal-600 hover:text-teal-800 flex items-center gap-2 font-medium"
                    >
                        <ChevronLeft size={18} /> Quay lại
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Chi tiết lịch hẹn - {currentDate.toLocaleDateString('vi-VN', LONG_DATE_OPTIONS)}
                    </h2>
                </div>

                <div className="p-6">
                    {loadingDetail ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner size="md" color="teal" className="mr-2" />
                            <span className="text-gray-600">Đang tải chi tiết...</span>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Ngày</p>
                                        <p className="font-medium text-gray-900">{formatDate(appointmentDetail.date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Ca</p>
                                        <p className="font-medium text-gray-900">{getShiftLabel(appointmentDetail.shift)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Trạng thái</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs border font-medium ${getStatusColor(appointmentDetail.status)}`}>
                                            {getStatusLabel(appointmentDetail.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {appointmentDetail.user_info && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Họ tên</p>
                                            <p className="font-medium text-gray-900">{appointmentDetail.user_info.fullname}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Số điện thoại</p>
                                            <p className="font-medium text-gray-900">{appointmentDetail.user_info.phone_number}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {appointmentDetail.service_infos && appointmentDetail.service_infos.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Dịch vụ</h3>
                                    <div className="space-y-3">
                                        {appointmentDetail.service_infos.map((service, index) => (
                                            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{service.name}</p>
                                                        {service.description && (
                                                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                                        )}
                                                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                                            <span>Thời gian: {service.duration} phút</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-teal-600">{service.price.toLocaleString('vi-VN')} đ</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {appointmentDetail.pet_infos && appointmentDetail.pet_infos.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thú cưng</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {appointmentDetail.pet_infos.map((pet) => (
                                            <div key={pet.id} className="bg-white rounded-lg p-4 border border-gray-200">
                                                <div className="flex gap-4">
                                                    {pet.avatar_url && (
                                                        <img
                                                            src={pet.avatar_url}
                                                            alt={pet.name}
                                                            className="w-20 h-20 rounded-lg object-cover"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{pet.name}</p>
                                                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                            <p>Loài: {pet.species}</p>
                                                            <p>Giống: {pet.breed}</p>
                                                            <p>Giới tính: {pet.gender === 'Male' ? 'Đực' : 'Cái'}</p>
                                                            <p>Màu sắc: {pet.color}</p>
                                                            <p>Cân nặng: {pet.weight} kg</p>
                                                            <p>Ngày sinh: {formatDate(pet.dateOfBirth)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {appointmentDetail.status === 'Pending_Confirmation' && (
                                <div className="bg-gray-50 rounded-lg p-4 border-t-2 border-teal-500">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => appointmentDetail.id && onConfirm(appointmentDetail.id)}
                                            disabled={updatingStatus}
                                            className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                                        >
                                            {updatingStatus ? (
                                                <>
                                                    <Spinner size="sm" color="white" />
                                                    <span>Đang xử lý...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="h-5 w-5" />
                                                    <span>Xác nhận lịch hẹn</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={onCancel}
                                            disabled={updatingStatus}
                                            className="flex-1 px-4 py-2.5 bg-red-700 text-white rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="h-5 w-5" />
                                            <span>Hủy lịch hẹn</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {appointmentDetail.status === 'Confirmed' && (
                                <div className="bg-gray-50 rounded-lg p-4 border-t-2 border-green-500">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác</h3>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={onCancel}
                                            disabled={updatingStatus}
                                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                                        >
                                            {updatingStatus ? (
                                                <>
                                                    <Spinner size="sm" color="white" />
                                                    <span>Đang xử lý...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-5 w-5" />
                                                    <span>Hủy lịch hẹn</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
