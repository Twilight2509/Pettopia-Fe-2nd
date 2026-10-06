export interface Author {
  user_id: string;
  fullname: string;
  avatar: string | null;
}

export interface Comment {
  comment_id: string;
  author: Author;
  content: string;
  likes: any[];
  reports: any[];
  isHidden: boolean;
  isDeleted: boolean;
  createdAt: string;
}

export interface Report {
  user_id: string;
  reason: string;
  reportedAt: string;
}

export interface Post {
  post_id: string;
  author: Author;
  title: string;
  content: string;
  tags?: string[];
  images?: string[];
  isHidden?: boolean;
  comments: Comment[];
  commentCount: number;
  likeCount: number;
  reportCount: number;
  viewCount?: number;
  reports: Report[];
  createdAt?: string;
  updatedAt?: string;
}

export type FilterStatus = 'all' | 'visible' | 'hidden';
export type SortBy = 'date' | 'reports' | 'likes';
