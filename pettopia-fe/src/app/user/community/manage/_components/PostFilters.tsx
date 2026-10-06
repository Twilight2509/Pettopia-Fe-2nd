'use client'
import type { FilterStatus, SortBy } from '../_types';

interface PostFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  sortBy: SortBy;
  onSortByChange: (value: SortBy) => void;
  filterStatus: FilterStatus;
  onFilterStatusChange: (value: FilterStatus) => void;
}

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'visible', label: 'Đang hiển thị' },
  { value: 'hidden', label: 'Đã ẩn' },
];

export default function PostFilters({
  searchQuery,
  onSearchQueryChange,
  sortBy,
  onSortByChange,
  filterStatus,
  onFilterStatusChange,
}: PostFiltersProps) {
  return (
    <>
      <div className=" p-5">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as any)}
            className="px-4 py-2.5 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white text-gray-700 font-medium"
          >
            <option value="date">Mới nhất</option>
            <option value="reports">Nhiều báo cáo nhất</option>
            <option value="likes">Nhiều like nhất</option>
          </select>
        </div>
      </div>

      <div className="flex items-center mb-5">
        <div className="flex gap-2">
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onFilterStatusChange(value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === value
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-teal-50 border border-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
