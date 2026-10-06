"use client";

import { communicationService, Post } from "@/services/communication/communicationService";

interface CommentSectionProps {
  post: Post;
  currentUserId: string | null;
  commentInput: string;
  onCommentInputChange: (value: string) => void;
  submittingComment: boolean;
  onSubmit: () => void;
}

export default function CommentSection({
  post,
  currentUserId,
  commentInput,
  onCommentInputChange,
  submittingComment,
  onSubmit,
}: CommentSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mb-4">
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-3">
          <img
            src={currentUserId ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserId}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=default`}
            alt="You"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <textarea
              value={commentInput}
              onChange={(e) => onCommentInputChange(e.target.value)}
              placeholder="Thêm bình luận..."
              rows={1}
              maxLength={200}
              className="w-full px-0 py-0 border-0 focus:outline-none focus:ring-0 resize-none text-sm placeholder-gray-500"
              onFocus={(e) => {
                e.target.rows = 3;
              }}
              onBlur={(e) => {
                if (!commentInput.trim()) e.target.rows = 1;
              }}
            />
            {commentInput.trim() && (
              <div className="flex justify-end items-center mt-2 pt-2 border-t border-gray-200">
                <button
                  onClick={onSubmit}
                  disabled={submittingComment || !commentInput.trim()}
                  className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all ${
                    submittingComment || !commentInput.trim()
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {submittingComment ? "Đang gửi..." : "Đăng"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((c) => (
            <div key={c.comment_id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex gap-3">
                <img
                  src={c.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author?.user_id || "user"}`}
                  alt={c.author?.fullname || "user"}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author?.user_id || "user"}`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm text-gray-900 hover:text-blue-600 cursor-pointer">
                      {c.author?.fullname || "Người dùng"}
                    </span>
                    <span className="text-xs text-gray-500">• {communicationService.formatTimeAgo(c.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-600">Member</p>
                  <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap leading-relaxed">{c.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 text-sm">
            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
          </div>
        )}
      </div>
    </div>
  );
}
