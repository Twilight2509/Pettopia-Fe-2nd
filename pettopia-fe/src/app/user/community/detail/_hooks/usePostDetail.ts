"use client";

import { useEffect, useMemo, useState } from "react";
import { communicationService, Post } from "@/services/communication/communicationService";
import { parseJwt } from "@/utils/jwt";

export function usePostDetail(postId: string | null) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loadingRelated, setLoadingRelated] = useState<boolean>(false);

  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("authToken") : null), []);
  const currentUserId = useMemo(() => {
    if (!token) return null;
    const decoded = parseJwt(token);
    return decoded?.id ?? null;
  }, [token]);

  useEffect(() => {
    if (token) communicationService.setToken(token);
  }, [token]);

  useEffect(() => {
    const loadDetail = async () => {
      if (!postId) {
        setError("Thiếu tham số bài viết (id)");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const detail = await communicationService.getPostDetail(postId);
        setPost(detail);
      } catch (e: any) {
        console.error("Load post detail error:", e);
        setError(e?.message || "Không thể tải chi tiết bài viết.");
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [postId]);

  useEffect(() => {
    const loadRelatedPosts = async () => {
      try {
        setLoadingRelated(true);
        const allPosts = await communicationService.getAllPosts();
        const filtered = allPosts
          .filter((p: Post) => !p.isHidden && p.post_id !== postId)
          .sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        setRelatedPosts(filtered);
      } catch (e: any) {
        console.error("Load related posts error:", e);
      } finally {
        setLoadingRelated(false);
      }
    };
    if (postId) {
      loadRelatedPosts();
    }
  }, [postId]);

  const parsedTags = useMemo(() => communicationService.parseTags(post?.tags || []), [post?.tags]);

  const isLikedByCurrentUser = useMemo(() => {
    if (!post || !currentUserId) return false;
    const anyLikes: any = post.likes as any;
    if (!Array.isArray(anyLikes)) return false;
    return anyLikes.some((l: any) => (typeof l === "string" ? l === currentUserId : l?.user_id === currentUserId));
  }, [post, currentUserId]);

  return {
    post,
    setPost,
    loading,
    error,
    relatedPosts,
    loadingRelated,
    currentUserId,
    parsedTags,
    isLikedByCurrentUser,
  };
}
