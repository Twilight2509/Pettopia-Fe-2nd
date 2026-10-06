import type { Shift } from '@/services/petcare/petService';

export const parseJwt = (token: string | null) => {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch (e) {
    console.error('Failed to parse JWT', e);
    return null;
  }
};

export const formatAddress = (address: any) =>
  `${address.detail}, ${address.ward}, ${address.district}, ${address.city}`;

export const formatDate = (date: string) => {
  if (!date) return '';
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
};

export const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h${m}ph` : `${h}h`;
};

const SHIFT_NAME_MAP: Record<string, string> = {
  'morning': 'Sáng',
  'afternoon': 'Chiều',
  'evening': 'Tối',
  'night': 'Đêm',
  'Morning': 'Sáng',
  'Afternoon': 'Chiều',
  'Evening': 'Tối',
  'Night': 'Đêm',
};

export const formatShiftName = (shift: string) => SHIFT_NAME_MAP[shift] || shift;

export const getMinDate = () => new Date().toISOString().split('T')[0];

export const isShiftPast = (shift?: Shift | null, dateStr?: string) => {
  if (!shift || !dateStr) return false;
  const [year, month, day] = dateStr.split('-').map(n => parseInt(n, 10));
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return false;
  const [hStr = '0', mStr = '0'] = (shift.end_time || '00:00').split(':');
  const hours = parseInt(hStr, 10);
  const minutes = parseInt(mStr, 10);
  const shiftEnd = new Date(year, month - 1, day, hours, minutes, 0);
  return shiftEnd.getTime() <= Date.now();
};

export const CHECK_ICON_PATH = 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z';
