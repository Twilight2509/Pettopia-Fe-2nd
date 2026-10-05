'use client';

import { useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import SettingsModal from './SettingsModal';

const Sidebar = dynamic(() => import('@/components/common/Sidebar'), {
  loading: () => <div className="w-64 bg-gray-200 animate-pulse md:flex hidden flex-col" />,
  ssr: true,
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [showSearch, setShowSearch] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <section>
      <div className="flex h-screen bg-gradient-to-b from-teal-50 to-white text-gray-900 relative">
        <Sidebar
          setShowSearch={setShowSearch}
          showSearch={showSearch}
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <button
          type="button"
          aria-label="Mở menu"
          className="md:hidden fixed top-4 left-4 z-30 p-2 bg-white border border-teal-100 rounded-lg shadow-md text-teal-700 hover:bg-teal-50 transition"
          onClick={() => setIsMenuOpen(true)}
        >
          ☰
        </button>

        <main className="flex-1 overflow-y-auto ml-0 md:ml-[16rem] p-10 md:p-12 bg-gradient-to-b from-teal-50 to-white transition-all duration-300">
          {children}
        </main>

        <SettingsModal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    </section>
  );
}
