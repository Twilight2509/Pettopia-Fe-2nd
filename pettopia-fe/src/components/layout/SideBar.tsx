'use client'

import { useState, useEffect } from 'react';
import SearchModal from '@/components/layout/SearchModal';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarNav from './sidebar/SidebarNav';
import SidebarUserSection from './sidebar/SidebarUserSection';
import SettingsModal from './sidebar/SettingsModal';
import { searchMenuItems } from './sidebar/navConfig';
import { useSidebarUser } from './sidebar/useSidebarUser';

interface UserNavbarProps {
  setShowSearch: (v: boolean) => void;
  showSearch: boolean;
}

export default function UserNavbar({ setShowSearch, showSearch }: UserNavbarProps) {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { userData, isLoading, isVip } = useSidebarUser();

  return (
    <>
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out h-screen sticky top-0 overflow-visible`}>
        <SidebarHeader
          collapsed={isSidebarCollapsed}
          isVip={isVip}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenSearch={() => setIsSearchModalOpen(true)}
        />

        <SidebarNav collapsed={isSidebarCollapsed} />

        <SidebarUserSection
          collapsed={isSidebarCollapsed}
          isLoading={isLoading}
          userData={userData}
          isVip={isVip}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />
      </div>

      <SettingsModal open={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => {
          setIsSearchModalOpen(false);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        menuItems={searchMenuItems}
      />
    </>
  );
}
