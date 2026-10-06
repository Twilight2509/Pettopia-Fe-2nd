'use client'
import { useState, useEffect, useCallback } from 'react';
import { communicationService } from '@/services/communication/communicationService';
import type { Post } from '../_types';
import { normalizePost, parseJwt } from '../_utils';

export function useMyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchPosts = useCallback(async (uid: string) => {
    if (!uid) {
      setError('User ID không hợp lệ');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await communicationService.getUserPosts(uid);
      const normalized = (Array.isArray(data) ? data : []).map((p: any) => normalizePost(p, uid));
      setPosts(normalized);
    } catch (err) {
      setPosts([]);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('authToken');
    let id = localStorage.getItem('userId');

    if (!id && token) {
      const decoded = parseJwt(token);
      const resolved = decoded?.userId ?? decoded?.id ?? decoded?.sub ?? null;
      if (resolved) {
        id = String(resolved);
        localStorage.setItem('userId', id);
      }
    }

    if (id) {
      setUserId(id);
      if (token) {
        communicationService.setToken(token);
      }
      fetchPosts(id);
    } else {
      setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      setLoading(false);
    }
  }, [fetchPosts]);

  return { posts, setPosts, loading, error, userId, fetchPosts };
}
