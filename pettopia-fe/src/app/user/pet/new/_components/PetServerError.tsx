import type { FieldErrors } from '../_types';

interface Props {
    serverError: string;
    errors: FieldErrors;
}

export default function PetServerError({ serverError, errors }: Props) {
    return (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md">
            <div className="flex items-start">
                <svg className="w-6 h-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-red-800 mb-1">❌ Không thể tạo thú cưng</h3>
                    <p className="text-sm text-red-700 mb-2">{serverError}</p>
                    {Object.keys(errors).length > 0 && (
                        <div className="mt-3 bg-red-100 rounded-md p-3">
                            <p className="text-xs font-semibold text-red-800 mb-2">Chi tiết lỗi:</p>
                            <ul className="space-y-1">
                                {Object.entries(errors).map(([field, error], idx) => (
                                    <li key={idx} className="text-sm text-red-700 flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>
                                            <strong className="font-medium">{field}:</strong> {error}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="mt-3 flex items-center gap-2 text-xs text-red-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                        </svg>
                        <span>Ảnh của bạn có thể quá dung lượng. Hoặc thiếu trường bắt buộc.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
