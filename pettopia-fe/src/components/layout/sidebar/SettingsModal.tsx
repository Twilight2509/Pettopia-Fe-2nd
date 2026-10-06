'use client'

import { toast } from 'react-hot-toast';
import { Modal } from '@/components/ui';

const notifyInDevelopment = () => toast('Chức năng này đang phát triển', { duration: 2000, position: 'top-right' });

interface SettingRowProps {
  title: string;
  description: string;
  defaultChecked?: boolean;
}

function SettingRow({ title, description, defaultChecked }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <input type="checkbox" defaultChecked={defaultChecked} className="w-5 h-5 text-teal-600" onChange={notifyInDevelopment} />
    </div>
  );
}

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="2xl"
      closeOnBackdrop={false}
      title={<span className="text-2xl">Cài đặt - tính năng đang phát triển</span>}
      bodyClassName="space-y-6"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              toast('Chức năng này đang phát triển', { duration: 3000, position: 'top-right' });
              setTimeout(() => {
                onClose();
              }, 3000);
            }}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Lưu thay đổi
          </button>
        </>
      }
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông báo</h3>
        <div className="space-y-3">
          <SettingRow title="Thông báo Email" description="Nhận cập nhật về thú cưng của bạn" defaultChecked />
          <SettingRow title="Thông báo đẩy" description="Nhận thông báo trên thiết bị" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Giao diện</h3>
        <div className="space-y-3">
          <SettingRow title="Chế độ tối" description="Chuyển sang giao diện tối" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quyền riêng tư</h3>
        <div className="space-y-3">
          <SettingRow title="Hiển thị hồ sơ công khai" description="Cho phép người khác xem hồ sơ" defaultChecked />
        </div>
      </div>
    </Modal>
  );
}
