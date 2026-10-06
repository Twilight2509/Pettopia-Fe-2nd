'use client'
import React from 'react';
import { Modal } from '@/components/ui';
import type { Post } from '../_types';
import { formatDate } from '../_utils';

interface PostDetailModalProps {
  post: Post;
  open: boolean;
  onClose: () => void;
  onGoToDetail: (postId: string) => void;
  onEdit: (postId: string, e?: React.MouseEvent) => void;
  onDelete: (post: Post, e: React.MouseEvent) => void;
}

export default function PostDetailModal({ post, open, onClose, onGoToDetail, onEdit, onDelete }: PostDetailModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="3xl"
      showCloseButton={false}
      className="rounded-2xl!"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 pr-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
          <div className="flex items-center gap-3">
            <img
              src={post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.user_id || 'default'}`}
              alt={post.author?.fullname || 'User'}
              className="w-10 h-10 rounded-full border-2 border-teal-100"
            />
            <div>
              <div className="font-semibold text-gray-900">{post.author?.fullname || 'Unknown'}</div>
              <div className="text-sm text-gray-500">{formatDate(post.createdAt)}</div>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex gap-6 mb-6 pb-6 border-b border-gray-200">
        <div>
          <div className="text-lg font-bold text-gray-900">{post.viewCount || 0}</div>
          <div className="text-xs text-gray-500">Views</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">{post.likeCount || 0}</div>
          <div className="text-xs text-gray-500">Likes</div>
        </div>
        <div>
          <div className={`text-lg font-bold ${(post.reportCount || 0) > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {post.reportCount || 0}
          </div>
          <div className="text-xs text-gray-500">Reports</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Nội dung bài viết</h3>
        <div className="prose max-w-none bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>

      {post.images && post.images.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 text-lg">Hình ảnh</h3>
          <div className="grid grid-cols-2 gap-3">
            {post.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Image ${idx + 1}`}
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
            ))}
          </div>
        </div>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 text-lg">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags
              .filter(t => t && typeof t === 'string')
              .map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      )}

      {post.reports && post.reports.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 text-lg">
            Báo cáo ({post.reports.length})
          </h3>
          <div className="space-y-2">
            {post.reports.map((report, idx) => (
              <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="font-medium text-red-900 mb-1">{report.reason}</div>
                <div className="text-red-700 text-xs">{formatDate(report.reportedAt)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => onGoToDetail(post.post_id)}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 font-semibold shadow-md transition-all"
        >
          Xem trang chi tiết
        </button>
        <button
          onClick={(e) => {
            onEdit(post.post_id, e);
          }}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold shadow-md transition-all"
        >
          Chỉnh sửa
        </button>
        <button
          onClick={(e) => {
            onClose();
            onDelete(post, e);
          }}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 font-semibold shadow-md transition-all"
        >
          Xóa vĩnh viễn
        </button>
      </div>
    </Modal>
  );
}
