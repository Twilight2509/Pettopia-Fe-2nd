'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { communicationService } from '@/services/communication/communicationService';
import { LoadingState } from '@/components/ui';
import type { FilterStatus, Post, SortBy } from './_types';
import { filterAndSortPosts } from './_utils';
import { useMyPosts } from './_hooks/useMyPosts';
import StatsCards from './_components/StatsCards';
import PostFilters from './_components/PostFilters';
import PostTable from './_components/PostTable';
import PostDetailModal from './_components/PostDetailModal';
import DeletePostModal from './_components/DeletePostModal';

export default function ManagePostsPage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const { posts, setPosts, loading, error, userId, fetchPosts } = useMyPosts();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (selectedPost && posts.length > 0) {
      const updatedPost = posts.find(p => p.post_id === selectedPost.post_id);
      if (updatedPost) {
        setSelectedPost(updatedPost);
      }
    }
  }, [posts, selectedPost]);

  const filteredPosts = filterAndSortPosts(posts, searchQuery, filterStatus, sortBy);

  const handleViewDetails = (postId: string) => {
    const post = posts.find(p => p.post_id === postId);
    if (post) {
      setSelectedPost(post);
      setShowDetailModal(true);
    }
  };

  const handleGoToDetailPage = (postId: string) => {
    if (!postId) return;
    router.push(`/user/community/detail?id=${postId}`);
  };

  const handleDeleteClick = (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await communicationService.deletePost(postToDelete.post_id);
      setPosts(prev => prev.filter(post => post.post_id !== postToDelete.post_id));
      setDeleteModalOpen(false);
      setPostToDelete(null);
      if (showDetailModal) {
        setShowDetailModal(false);
        setSelectedPost(null);
      }
      alert('Xóa bài viết thành công!');
    } catch (error: any) {
      console.error('Delete post error:', error);
      alert('Có lỗi xảy ra khi xóa bài viết: ' + (error?.message || 'Unknown error'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };

  const handleNavigateEdit = (postId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!postId) return;
    router.push(`/user/community/edit/${postId}`);
  };

  if (loading) {
    return (
      <LoadingState fullScreen size="xl" message="Đang tải danh sách bài viết..." className="p-10" />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Có lỗi xảy ra</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => userId && fetchPosts(userId)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-gray-900">Danh sách bài viết của bạn</h1>
              <p className="text-gray-600">Quản lý và theo dõi tất cả bài viết của bạn ({posts.length} bài viết)</p>
            </div>
            <button
              onClick={() => router.push('/user/community/create')}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Tạo bài viết mới
            </button>
          </div>

          <StatsCards posts={posts} />

          <PostFilters
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
          />
        </div>

        <PostTable
          posts={filteredPosts}
          searchQuery={searchQuery}
          onGoToDetail={handleGoToDetailPage}
          onViewDetails={handleViewDetails}
          onEdit={handleNavigateEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onGoToDetail={handleGoToDetailPage}
          onEdit={handleNavigateEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {postToDelete && (
        <DeletePostModal
          post={postToDelete}
          open={deleteModalOpen}
          isDeleting={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );
}
