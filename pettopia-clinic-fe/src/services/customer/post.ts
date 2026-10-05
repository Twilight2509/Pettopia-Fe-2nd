import { apiClient } from "@/services/apiClient";

const JSON_HEADERS = { 'Content-Type': 'application/json' };

// API Services
export const getReportedPosts = async () => {
    try {
        const response = await apiClient.get('/communication/staff/reported', { headers: JSON_HEADERS });
        return response.data;
    } catch {
        throw new Error('Không thể tải danh sách bài viết bị báo cáo');
    }
};

export const toggleHidePost = async (postId: string, isHidden: boolean) => {
    try {
        const response = await apiClient.patch(`/communication/${postId}/hide`, { isHidden }, { headers: JSON_HEADERS });
        return response.data;
    } catch {
        throw new Error(isHidden ? 'Không thể ẩn bài viết' : 'Không thể bỏ ẩn bài viết');
    }
};
