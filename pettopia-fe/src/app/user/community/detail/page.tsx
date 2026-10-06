"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LoadingState } from "@/components/ui";
import { usePostDetail } from "./_hooks/usePostDetail";
import { usePostActions } from "./_hooks/usePostActions";
import { useLightbox } from "./_hooks/useLightbox";
import PostHeader from "./_components/PostHeader";
import { LikeBar, PostContent, PostImages } from "./_components/PostBody";
import CommentSection from "./_components/CommentSection";
import RelatedPosts from "./_components/RelatedPosts";
import ImageLightbox from "./_components/ImageLightbox";
import ReportModal from "./_components/ReportModal";

export default function PostDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postId = searchParams.get("id");

  const {
    post,
    setPost,
    loading,
    error,
    relatedPosts,
    loadingRelated,
    currentUserId,
    parsedTags,
    isLikedByCurrentUser,
  } = usePostDetail(postId);

  const {
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
  } = usePostActions({ postId, currentUserId, isLikedByCurrentUser, setPost });

  const { lightbox, openLightbox, closeLightbox, goToPrevImage, goToNextImage } = useLightbox(post?.images);

  if (loading) {
    return (
      <LoadingState fullScreen color="blue" message="Đang tải..." className="py-0!" />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Quay lại</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-4">
          <main className="flex-1 min-w-0 lg:max-w-3xl">
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mb-4">
              <PostImages post={post} onImageClick={openLightbox} />
              <PostHeader post={post} currentUserId={currentUserId} onReportClick={() => setShowReportModal(true)} />
              <PostContent post={post} parsedTags={parsedTags} />
              <LikeBar post={post} isLiked={isLikedByCurrentUser} liking={liking} onToggleLike={handleToggleLike} />
              <CommentSection
                post={post}
                currentUserId={currentUserId}
                commentInput={commentInput}
                onCommentInputChange={setCommentInput}
                submittingComment={submittingComment}
                onSubmit={handleSubmitComment}
              />
            </div>
          </main>

          <RelatedPosts posts={relatedPosts} loading={loadingRelated} />
        </div>
      </div>

      {lightbox.isOpen && post.images && post.images.length > 0 && (
        <ImageLightbox
          images={post.images}
          currentIndex={lightbox.currentIndex}
          onClose={closeLightbox}
          onPrev={goToPrevImage}
          onNext={goToNextImage}
        />
      )}

      <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        reason={reportReason}
        onReasonChange={setReportReason}
        reporting={reporting}
        onCancel={() => {
          setShowReportModal(false);
          setReportReason("");
        }}
        onSubmit={handleReport}
      />
    </div>
  );
}
