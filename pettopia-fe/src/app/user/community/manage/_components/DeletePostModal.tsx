'use client'
import { Spinner, Modal } from '@/components/ui';
import type { Post } from '../_types';

interface DeletePostModalProps {
  post: Post;
  open: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeletePostModal({ post, open, isDeleting, onConfirm, onCancel }: DeletePostModalProps) {
  return (
    <>
      <Modal
        open={open}
        onClose={onCancel}
        size="2xl"
        showCloseButton={false}
        className="rounded-2xl!"
        bodyClassName="p-0!"
      >
        <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">Xác nhận xóa bài viết</h3>
              <p className="text-red-100 text-sm mt-1">Hành động này không thể hoàn tác</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-lg text-gray-900 mb-2">{post.title}</h4>
            <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  Bạn có chắc chắn muốn xóa bài viết này?
                </p>
                <p className="text-xs text-red-700 mt-1">
                  Tất cả dữ liệu bao gồm bình luận, lượt thích sẽ bị xóa vĩnh viễn.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Spinner size="sm" color="white" />
                  Đang xóa...
                </>
              ) : (
                'Xác nhận xóa'
              )}
            </button>
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
