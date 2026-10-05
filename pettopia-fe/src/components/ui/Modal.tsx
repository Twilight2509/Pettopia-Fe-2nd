'use client';

import { useEffect, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
} as const;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  size?: keyof typeof SIZES;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  zIndex?: string;
  className?: string;
  bodyClassName?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  footer,
  children,
  size = 'lg',
  closeOnBackdrop = true,
  showCloseButton = true,
  zIndex = 'z-50',
  className,
  bodyClassName,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn('fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn', zIndex)}
      onClick={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative bg-white rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn',
          SIZES[size],
          className,
        )}
      >
        {(title || showCloseButton) && (
          <div className={cn('flex items-center justify-between gap-4', title ? 'p-6 border-b border-gray-200' : 'absolute top-4 right-4')}>
            {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng"
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className={cn('p-6', bodyClassName)}>{children}</div>
        {footer && <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">{footer}</div>}
      </div>
    </div>
  );
}
