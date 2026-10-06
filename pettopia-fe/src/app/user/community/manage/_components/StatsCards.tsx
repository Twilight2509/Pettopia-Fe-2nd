import type { Post } from '../_types';

export default function StatsCards({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 rounded-xl shadow-sm p-4 border border-blue-200">
        <p className="text-sm text-blue-600 font-medium mb-1">Bài viết của bạn</p>
        <p className="text-3xl font-bold text-blue-900">{posts.length}</p>
      </div>

      <div className="bg-amber-50 rounded-xl shadow-sm p-4 border border-amber-200">
        <p className="text-sm text-amber-600 font-medium mb-1">Đang hiển thị</p>
        <p className="text-3xl font-bold text-amber-900">
          {posts.filter(p => p.isHidden === false).length}
        </p>
      </div>

      <div className="bg-orange-50 rounded-xl shadow-sm p-4 border border-orange-200">
        <p className="text-sm text-orange-600 font-medium mb-1">Đã ẩn</p>
        <p className="text-3xl font-bold text-orange-900">
          {posts.filter(p => p.isHidden === true).length}
        </p>
      </div>

      <div className="bg-indigo-50 rounded-xl shadow-sm p-4 border border-indigo-200">
        <p className="text-sm text-indigo-600 font-medium mb-1">Có báo cáo</p>
        <p className="text-3xl font-bold text-indigo-900">
          {posts.filter(p => (p.reportCount || 0) > 0).length}
        </p>
      </div>
    </div>
  );
}
