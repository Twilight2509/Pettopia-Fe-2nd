'use client'

import Link from 'next/link';
import { Pacifico } from 'next/font/google';
import { CollapseIcon, SearchIcon } from './icons';

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
});

interface SidebarHeaderProps {
  collapsed: boolean;
  isVip: boolean;
  onToggleCollapse: () => void;
  onOpenSearch: () => void;
}

export default function SidebarHeader({ collapsed, isVip, onToggleCollapse, onOpenSearch }: SidebarHeaderProps) {
  const collapseTitle = collapsed ? 'Mở sidebar' : 'Đóng sidebar';

  return (
    <div className="p-4 border-b border-gray-200 flex flex-col gap-2">
      {!collapsed && (
        <div className="flex items-center justify-between gap-2">
          <Link href="/user/home">
            <div className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br rounded-lg flex items-center justify-center flex-shrink-0">
                <img src="/sampleimg/logo.png" alt="Pettopia Logo" className="w-8 h-8" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`${pacifico.className} text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent truncate`}>
                  Pettopia
                </span>
                {isVip && (
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">PREMIUM</span>
                )}
              </div>
            </div>
          </Link>

          <button
            onClick={onOpenSearch}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            title="Tìm kiếm"
          >
            <SearchIcon />
          </button>

          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            title={collapseTitle}
          >
            <CollapseIcon collapsed={collapsed} />
          </button>
        </div>
      )}

      {collapsed && (
        <>
          <div className="flex items-center justify-center">
            <Link href="/user/home">
              <div className="w-8 h-8 bg-gradient-to-br rounded-lg flex items-center justify-center">
                <img src="/sampleimg/logo.png" alt="Pettopia Logo" className="w-8 h-8" />
              </div>
            </Link>
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 w-full flex justify-center"
            title={collapseTitle}
          >
            <CollapseIcon collapsed={collapsed} />
          </button>

          <button
            onClick={onOpenSearch}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 w-full flex justify-center"
            title="Tìm kiếm"
          >
            <SearchIcon />
          </button>
        </>
      )}
    </div>
  );
}
