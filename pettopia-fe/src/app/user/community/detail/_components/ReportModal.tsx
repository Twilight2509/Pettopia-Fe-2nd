"use client";

import { Modal } from "@/components/ui";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  reason: string;
  onReasonChange: (value: string) => void;
  reporting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function ReportModal({ open, onClose, reason, onReasonChange, reporting, onCancel, onSubmit }: ReportModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Báo cáo bài viết"
      footer={
        <>
          <button
            onClick={onCancel}
            disabled={reporting}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onSubmit}
            disabled={reporting || !reason.trim()}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              reporting || !reason.trim() ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {reporting ? "Đang gửi..." : "Gửi báo cáo"}
          </button>
        </>
      }
    >
      <p className="text-sm text-gray-600 mb-4">Vui lòng cho biết lý do báo cáo bài viết này.</p>
      <textarea
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        placeholder="Ví dụ: spam, nội dung không phù hợp, vi phạm bản quyền..."
        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-sm"
        maxLength={200}
      />
    </Modal>
  );
}
