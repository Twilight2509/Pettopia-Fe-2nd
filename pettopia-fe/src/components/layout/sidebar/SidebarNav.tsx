'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { navSections } from './navConfig';

export default function SidebarNav({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-visible">
      <div className={`${collapsed ? 'px-2 py-4 space-y-2' : 'space-y-4 px-2 py-4'} overflow-y-auto max-h-full overflow-x-visible`}>
        {navSections.map((section) => (
          <div key={section.title}>
            {!collapsed && <div className="text-xs text-teal-600 font-semibold px-3 mb-2 uppercase tracking-wide">{section.title}</div>}
            {collapsed && <div className="h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent mx-2 mb-2"></div>}
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className={item.wrapperClassName}>
                    <button
                      className={cn(
                        'w-full flex gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer',
                        collapsed ? 'justify-center' : 'items-center',
                        pathname === item.href ? section.activeClassName : 'hover:bg-gray-100 text-gray-700',
                      )}
                    >
                      {item.icon}
                      {!collapsed && <span>{item.label}</span>}
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
