"use client";

import { useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { communicationService, Post } from "@/services/communication/communicationService";

interface UsePostActionsParams {
  postId: string | null;
  currentUserId: string | null;
  isLikedByCurrentUser: boolean;
  setPost: (post: Post) => void;
}

export function usePostActions({ postId, currentUserId, isLikedByCurrentUser, setPost }: UsePostActionsParams) {
  const { showInfo, showError } = useToast();
  const [commentInput, setCommentInput] = useState<string>("");
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  const [liking, setLiking] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>("");
  const [reporting, setReporting] = useState<boolean>(false);

  const handleToggleLike = async () => {
    if (!postId || !currentUserId) {
      if (!currentUserId) showInfo("Bạn cần đăng nhập để thích bài viết.", 5000);
      return;
    }
    if (liking) return;

    const wasLiked = isLikedByCurrentUser;

    try {
      setLiking(true);
      if (wasLiked) {
        await communicationService.unlikePost(postId);
      } else {
        await communicationService.likePost(postId);
      }
      const updatedPost = await communicationService.getPostDetail(postId);
      setPost(updatedPost);
    } catch (e: any) {
      console.error("Toggle like error:", e);
      showError(e?.message || "Không thể cập nhật lượt thích.", 5000);
      try {
        const updatedPost = await communicationService.getPostDetail(postId);
        setPost(updatedPost);
      } catch {}
    } finally {
      setLiking(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!postId) return;
    const content = commentInput.trim();
    if (!content) return;
    if (content.length > 200) {
      showError("Bình luận không được vượt quá 200 ký tự.", 5000);
      return;
    }
    if (!currentUserId) {
      showInfo("Bạn cần đăng nhập để bình luận.", 5000);
      return;
    }
    try {
      setSubmittingComment(true);
      await communicationService.createComment({
        post_id: postId,
        user_id: currentUserId,
        content,
      });
      setCommentInput("");
      const detail = await communicationService.getPostDetail(postId);
      setPost(detail);
    } catch (e: any) {
      console.error("Create comment error:", e);
      showError(e?.message || "Không thể gửi bình luận.", 5000);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReport = async () => {
    const reason = reportReason.trim();
    if (!reason) {
      showError("Vui lòng nhập lý do báo cáo.", 5000);
      return;
    }
    if (!currentUserId) {
      showInfo("Bạn cần đăng nhập để báo cáo.", 5000);
      return;
    }
    try {
      setReporting(true);
      const response = await communicationService.reportPost(postId!, reason);
      showInfo(response.message || "Đã báo cáo bài viết thành công.", 5000);
      setShowReportModal(false);
      setReportReason("");
      const updatedPost = await communicationService.getPostDetail(postId!);
      setPost(updatedPost);
    } catch (e: any) {
      let errorMessage = "Không thể báo cáo bài viết.";
      if (e.message) errorMessage = e.message;
      else if (e.response?.data?.message) errorMessage = e.response.data.message;
      showError(errorMessage, 5000);
    } finally {
      setReporting(false);
    }
  };

  return {
    commentInput,
    setCommentInput,
    submittingComment,
    liking,
    showReportModal,
    setShowReportModal,
    reportReason,
    setReportReason,
    reporting,
    handleToggleLike,
    handleSubmitComment,
    handleReport,
  };
}
