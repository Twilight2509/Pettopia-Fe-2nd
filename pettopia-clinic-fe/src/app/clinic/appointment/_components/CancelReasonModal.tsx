'use client';

interface CancelReasonModalProps {
    open: boolean;
    cancelReason: string;
    setCancelReason: (value: string) => void;
    error: string | null;
    updatingStatus: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function CancelReasonModal({
    open,
    cancelReason,
    setCancelReason,
    error,
    updatingStatus,
    onClose,
    onConfirm,
}: CancelReasonModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Hủy lịch hẹn</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Vui lòng nhập lý do hủy lịch hẹn này:
                    </p>
                    <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Nhập lý do hủy..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows={4}
                    />
                    {error && (
                        <p className="text-sm text-red-600 mt-2">{error}</p>
                    )}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={updatingStatus || !cancelReason.trim()}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {updatingStatus ? 'Đang xử lý...' : 'Xác nhận hủy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
