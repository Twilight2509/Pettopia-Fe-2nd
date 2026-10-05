'use client';

import Modal from '@/components/ui/Modal';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SECTIONS = [
  {
    title: 'Account Settings',
    items: [
      { label: 'Email Notifications', description: 'Receive updates about your clinic', defaultChecked: true },
      { label: 'Push Notifications', description: 'Get alerts on your device', defaultChecked: false },
    ],
  },
  {
    title: 'Appearance',
    items: [{ label: 'Dark Mode', description: 'Switch to dark theme', defaultChecked: false }],
  },
  {
    title: 'Privacy',
    items: [{ label: 'Profile Visibility', description: 'Make profile public', defaultChecked: true }],
  },
];

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Settings"
      size="2xl"
      zIndex="z-[9999]"
      bodyClassName="space-y-6"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Save Changes
          </button>
        </>
      }
    >
      {SECTIONS.map((section) => (
        <div key={section.title}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
          <div className="space-y-3">
            {section.items.map((item) => (
              <label key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <input type="checkbox" defaultChecked={item.defaultChecked} className="w-5 h-5 text-teal-600" />
              </label>
            ))}
          </div>
        </div>
      ))}
    </Modal>
  );
}
