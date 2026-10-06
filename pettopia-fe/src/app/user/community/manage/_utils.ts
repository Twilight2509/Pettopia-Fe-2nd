import type { FilterStatus, Post, SortBy } from './_types';

export const normalizeHiddenFlag = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1';
  }
  return false;
};

export const parseTags = (tags: any): string[] => {
  if (!tags) return [];
  if (!Array.isArray(tags)) return [];

  return tags.map(tag => {
    if (typeof tag === 'string') {
      if (tag.trim().startsWith('[') || tag.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(tag);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return tag;
        }
      }
      return tag;
    }
    return tag;
  }).flat().filter(t => t && typeof t === 'string' && t.trim().length > 0);
};

export const parseJwt = (token: string | null) => {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch (e) {
    console.error('Failed to parse JWT', e);
    return null;
  }
};

export const normalizePost = (p: any, uid: string): Post => ({
  ...p,
  post_id: p?.post_id || p?.id || '',
  author: p?.author || { user_id: uid, fullname: 'Unknown', avatar: null },
  title: p?.title || 'Untitled',
  content: p?.content || '',
  isHidden: normalizeHiddenFlag(p?.isHidden),
  tags: parseTags(p?.tags),
  images: Array.isArray(p?.images) ? p.images : [],
  comments: Array.isArray(p?.comments) ? p.comments : [],
  reports: Array.isArray(p?.reports) ? p.reports : [],
  commentCount: p?.commentCount || 0,
  likeCount: p?.likeCount || 0,
  reportCount: p?.reportCount || 0,
  viewCount: p?.viewCount || 0,
  createdAt: p?.createdAt || new Date().toISOString(),
  updatedAt: p?.updatedAt || new Date().toISOString(),
});

export const getStatusColor = (isHidden?: boolean) => {
  if (isHidden === true) return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
  return 'bg-green-500/20 text-green-700 border-green-500/30';
};

export const getStatusText = (isHidden?: boolean) => {
  return isHidden === true ? 'Đã ẩn' : 'Đang hiển thị';
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return 'Chưa rõ';
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return 'Ngày không hợp lệ';
  }
};

export const truncateTitle = (title: string, maxLength: number = 50) => {
  if (!title) return 'Untitled';
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + '...';
};

export const filterAndSortPosts = (
  posts: Post[],
  searchQuery: string,
  filterStatus: FilterStatus,
  sortBy: SortBy,
) =>
  posts
    .filter((post) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          post.title?.toLowerCase().includes(query) ||
          post.content?.toLowerCase().includes(query) ||
          post.author?.fullname?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (filterStatus === 'all') return true;
      if (filterStatus === 'visible') return post.isHidden === false;
      if (filterStatus === 'hidden') return post.isHidden === true;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      } else if (sortBy === 'reports') {
        return (b.reportCount || 0) - (a.reportCount || 0);
      } else if (sortBy === 'likes') {
        return (b.likeCount || 0) - (a.likeCount || 0);
      }
      return 0;
    });
