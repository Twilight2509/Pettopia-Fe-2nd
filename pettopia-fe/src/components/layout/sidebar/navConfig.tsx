import type { ReactNode } from 'react';
import type { MenuItem } from '@/components/layout/SearchModal';
import {
  CalendarCheckIcon,
  CalendarIcon,
  CommunityIcon,
  HistoryIcon,
  ManagePostsIcon,
  PawsIcon,
  PetPlusIcon,
} from './icons';

export const searchMenuItems: MenuItem[] = [
  {
    id: 'list',
    name: 'Danh sách thú cưng',
    icon: <PawsIcon className="size-5" />,
    path: '/user/pet/list',
    category: 'Thú cưng',
    keywords: ['thú cưng', 'pet', 'danh sách', 'list', 'quản lý pet']
  },
  {
    id: 'register-pet',
    name: 'Đăng ký thú cưng mới',
    icon: <PetPlusIcon className="size-5" />,
    path: '/user/pet/new',
    category: 'Thú cưng',
    keywords: ['đăng ký', 'thêm', 'register', 'add', 'pet mới', 'thú cưng mới']
  },
  {
    id: 'community',
    name: 'Cộng đồng Pettopia',
    icon: <CommunityIcon className="size-5" />,
    path: '/user/community',
    category: 'Cộng đồng',
    keywords: ['cộng đồng', 'community', 'pettopia', 'social', 'bạn bè']
  },
  {
    id: 'manage',
    name: 'Quản lý bài viết',
    icon: <ManagePostsIcon className="size-5" />,
    path: '/user/community/manage',
    category: 'Cộng đồng',
    keywords: ['quản lý', 'bài viết', 'post', 'manage', 'nội dung', 'content']
  },
  {
    id: 'booking',
    name: 'Đặt lịch khám',
    icon: <CalendarIcon className="size-5" />,
    path: '/user/appointments/booking',
    category: 'Đặt lịch',
    keywords: ['lịch khám', 'booking', 'appointment', 'đặt lịch', 'khám bệnh', 'veterinary', 'bác sĩ thú y']
  },
  {
    id: 'view-appointments',
    name: 'Xem lịch khám',
    icon: <CalendarCheckIcon className="size-5" />,
    path: '/user/appointments/list',
    category: 'Đặt lịch',
    keywords: ['xem', 'lịch khám', 'appointments', 'lịch hẹn', 'quản lý', 'lịch sử']
  },
  {
    id: 'prescription',
    name: 'Lịch sử khám',
    icon: <HistoryIcon className="size-5" />,
    path: '/user/prescription',
    category: 'Đặt lịch',
    keywords: ['lịch sử', 'prescription', 'medicine', 'thuốc', 'y tế']
  }
];

export interface NavLinkItem {
  href: string;
  label: string;
  icon: ReactNode;
  wrapperClassName: string;
}

export interface NavSectionConfig {
  title: string;
  activeClassName: string;
  items: NavLinkItem[];
}

const navIconClass = 'size-5 flex-shrink-0';

export const navSections: NavSectionConfig[] = [
  {
    title: 'Thú cưng',
    activeClassName: 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-sm',
    items: [
      { href: '/user/pet/list', label: 'Danh sách thú cưng', icon: '🐾', wrapperClassName: 'relative overflow-visible' },
      { href: '/user/pet/new', label: 'Đăng ký thú cưng mới', icon: <PetPlusIcon className={navIconClass} />, wrapperClassName: 'relative overflow-visible' },
    ],
  },
  {
    title: 'Cộng đồng',
    activeClassName: 'bg-gradient-to-r from-teal-500 to-teal-700 text-white shadow-sm',
    items: [
      { href: '/user/community', label: 'Cộng đồng Pettopia', icon: <CommunityIcon className={navIconClass} />, wrapperClassName: 'relative overflow-visible' },
      { href: '/user/community/manage', label: 'Quản lý bài viết', icon: <ManagePostsIcon className={navIconClass} />, wrapperClassName: 'relative' },
    ],
  },
  {
    title: 'Đặt lịch & Y tế',
    activeClassName: 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-sm',
    items: [
      { href: '/user/appointments/booking', label: 'Đặt lịch khám', icon: <CalendarIcon className={navIconClass} />, wrapperClassName: 'relative' },
      { href: '/user/appointments/list', label: 'Xem lịch khám', icon: <CalendarCheckIcon className={navIconClass} />, wrapperClassName: 'relative' },
      { href: '/user/prescription', label: 'Lịch sử khám', icon: <HistoryIcon className={navIconClass} />, wrapperClassName: 'relative' },
    ],
  },
];
