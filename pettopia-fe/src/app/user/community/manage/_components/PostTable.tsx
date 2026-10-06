'use client'
import React from 'react';
import type { Post } from '../_types';
import { formatDate, getStatusColor, getStatusText, truncateTitle } from '../_utils';

interface PostTableProps {
  posts: Post[];
  searchQuery: string;
  onGoToDetail: (postId: string) => void;
  onViewDetails: (postId: string) => void;
  onEdit: (postId: string, e?: React.MouseEvent) => void;
  onDelete: (post: Post, e: React.MouseEvent) => void;
}

export default function PostTable({ posts, searchQuery, onGoToDetail, onViewDetails, onEdit, onDelete }: PostTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-200 px-6 py-3">
        <div className="flex items-center gap-6 text-xs font-bold text-teal-700 uppercase tracking-wider">
          <div className="w-64">Tiêu đề bài viết</div>
          <div className="w-32">Ngày đăng</div>
          <div className="w-32">Trạng thái</div>
          <div className="ml-auto text-right pr-2">Hành động</div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {posts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {searchQuery ? 'Không tìm thấy bài viết nào phù hợp' : 'Không có bài viết nào'}
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.post_id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center gap-6 px-4 py-3">
                <div className="w-64">
                  <button
                    onClick={() => onGoToDetail(post.post_id)}
                    className="text-left font-semibold text-gray-900 hover:text-teal-600 transition-colors truncate w-full"
                    title={post.title}
                  >
                    {truncateTitle(post.title)}
                  </button>
                </div>

                <div className="w-32 text-sm text-gray-600">
                  {formatDate(post.createdAt)}
                </div>

                <div className="w-32">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(post.isHidden)}`}>
                    {getStatusText(post.isHidden)}
                  </span>
                </div>

                <div className="flex gap-1 ml-auto">
                  <button
                    onClick={() => onViewDetails(post.post_id)}
                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    title="Xem nhanh"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => onEdit(post.post_id, e)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-1-1v2m-6 6v6m0 0h6m-6 0l9-9a2.121 2.121 0 013 3l-9 9" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => onDelete(post, e)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
