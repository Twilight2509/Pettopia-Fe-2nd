import { LoadingState } from '@/components/ui';

export default function Loading() {
    return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
        <LoadingState message="Đang tải..." className="py-0!" />
    </main>); }
