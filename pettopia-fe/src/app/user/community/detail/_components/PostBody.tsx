"use client";

import type { Post } from "@/services/communication/communicationService";
import { getLikedUsersText, getTagDisplayName } from "../_utils";

interface PostBodyProps {
  post: Post;
  parsedTags: string[];
  isLiked: boolean;
  liking: boolean;
  onToggleLike: () => void;
  onImageClick: (index: number) => void;
}

export function PostImages({ post, onImageClick }: Pick<PostBodyProps, "post" | "onImageClick">) {
  if (!post.images || post.images.length === 0) return null;
  return (
    <div className={`grid gap-1 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
      {post.images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`image-${i}`}
          className="w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
          style={{ maxHeight: post.images!.length === 1 ? "500px" : "300px" }}
          onClick={() => onImageClick(i)}
        />
      ))}
    </div>
  );
}

export function PostContent({ post, parsedTags }: Pick<PostBodyProps, "post" | "parsedTags">) {
  return (
    <div className="px-4 pb-2">
      <h2 className="text-xl font-normal text-gray-900 mb-3 break-words">{post.title}</h2>
      {parsedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {parsedTags.map((tag, idx) => (
            <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
              #{getTagDisplayName(tag)}
            </span>
          ))}
        </div>
      )}
      <div className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">{post.content}</div>
    </div>
  );
}

export function LikeBar({ post, isLiked, liking, onToggleLike }: Pick<PostBodyProps, "post" | "isLiked" | "liking" | "onToggleLike">) {
  return (
    <div className="space-y-3">
      {post.likeCount > 0 && (
        <div className="flex items-center gap-2 px-4">
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </div>
          <span className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer hover:underline">
            {getLikedUsersText(post)}
          </span>
        </div>
      )}
      <div className="flex items-center justify-around py-1 border-t border-gray-200">
        <button
          onClick={onToggleLike}
          disabled={liking}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors ${
            isLiked ? "text-blue-600 hover:bg-blue-50" : "text-gray-600 hover:bg-gray-100"
          } disabled:opacity-60 font-semibold text-sm`}
        >
          <svg
            className="w-5 h-5"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
            />
          </svg>
          <span>{isLiked ? "Đã thích" : "Thích"}</span>
        </button>
      </div>
    </div>
  );
}
