"use client";

import { useRouter } from "next/navigation";
import { communicationService, Post } from "@/services/communication/communicationService";

interface RelatedPostsProps {
  posts: Post[];
  loading: boolean;
}

export default function RelatedPosts({ posts, loading }: RelatedPostsProps) {
  const router = useRouter();

  return (
    <aside className="lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden sticky top-6">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-bold text-lg text-gray-900">Xem bài viết khác</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-4 text-center text-gray-500 text-sm">Đang tải...</div>
          ) : posts.length > 0 ? (
            posts.map((relatedPost) => (
              <div
                key={relatedPost.post_id}
                onClick={() => router.push(`/user/community/detail?id=${relatedPost.post_id}`)}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">{relatedPost.title}</h4>
                <p className="text-xs text-gray-500">{communicationService.formatTimeAgo(relatedPost.createdAt)}</p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">Không có bài viết nào</div>
          )}
        </div>

        {posts.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => router.push("/user/community")}
              className="w-full text-sm font-semibold text-gray-600 hover:text-blue-600 flex items-center justify-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
              Xem tất cả bài viết
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
