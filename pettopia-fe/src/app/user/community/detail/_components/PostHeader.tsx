"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import type { Post } from "@/services/communication/communicationService";
import { formatDate } from "../_utils";

interface PostHeaderProps {
  post: Post;
  currentUserId: string | null;
  onReportClick: () => void;
}

export default function PostHeader({ post, currentUserId, onReportClick }: PostHeaderProps) {
  const router = useRouter();
  const { showInfo } = useToast();

  return (
    <div className="px-4 pt-4 pb-3">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <img
            src={post.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.user_id}`}
            alt={post.author.fullname}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.user_id}`;
            }}
          />
          <div>
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
              {post.author.fullname}
            </h3>
            <p className="text-xs text-gray-600">Member</p>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentUserId === post.author.user_id && (
            <button
              onClick={() => router.push(`/user/community/edit/${post.post_id}`)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {currentUserId && currentUserId !== post.author.user_id && (
            <button
              onClick={onReportClick}
              className="text-gray-600 hover:text-red-600 transition-colors"
              title="Báo cáo bài viết"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </button>
          )}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: post.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                showInfo("Đã copy link!", 5000);
              }
            }}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
