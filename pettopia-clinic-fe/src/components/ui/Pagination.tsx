'use client';

import { cn } from '@/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
  maxButtons?: number;
  className?: string;
}

function getPageNumbers(current: number, total: number, max: number): number[] {
  const count = Math.min(total, max);
  let start = 1;
  if (total > max) {
    const half = Math.floor(max / 2);
    start = Math.min(Math.max(1, current - half), total - max + 1);
  }
  return Array.from({ length: count }, (_, i) => start + i);
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  maxButtons = 5,
  className,
}: PaginationProps) {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;
  const navBtn = 'relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium transition-colors';

  return (
    <div className={cn('bg-white px-4 py-4 border-t border-gray-200 sm:px-6', className)}>
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          {pageSize !== undefined && totalItems !== undefined && totalItems > 0 && (
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-semibold text-indigo-600">{(currentPage - 1) * pageSize + 1}</span> đến{' '}
              <span className="font-semibold text-indigo-600">{Math.min(currentPage * pageSize, totalItems)}</span> trong số{' '}
              <span className="font-semibold text-indigo-600">{totalItems}</span> kết quả
            </p>
          )}
        </div>
        <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Phân trang">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Trang trước"
            className={cn(navBtn, 'rounded-l-lg', isFirst ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50')}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          {getPageNumbers(currentPage, totalPages, maxButtons).map((page) => (
            <button
              type="button"
              key={page}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={cn(
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all',
                page === currentPage
                  ? 'z-10 bg-indigo-600 border-indigo-600 text-white shadow-md'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
              )}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            disabled={isLast}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Trang sau"
            className={cn(navBtn, 'rounded-r-lg', isLast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50')}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
}
