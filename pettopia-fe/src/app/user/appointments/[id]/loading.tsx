import { LoadingState } from '@/components/ui';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <LoadingState message="Đang tải thông tin..." />
      </div>
    </div>
  );
}
