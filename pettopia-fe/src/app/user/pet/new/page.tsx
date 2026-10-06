'use client'
import Link from 'next/link';
import { Spinner } from '@/components/ui';
import { useRegisterPet } from './_hooks/useRegisterPet';
import PetBasicFields from './_components/PetBasicFields';
import PetDetailFields from './_components/PetDetailFields';
import PetIdCardPreview from './_components/PetIdCardPreview';
import PetServerError from './_components/PetServerError';

export default function RegisterPetPage() {
    const {
        router,
        fileInputRef,
        isSubmitting,
        serverError,
        isFlipped,
        setIsFlipped,
        avatarUploadMethod,
        setAvatarUploadMethod,
        avatarPreview,
        errors,
        petCount,
        isVip,
        petForm,
        handleInputChange,
        handleFileUpload,
        handleUrlChange,
        getCurrentAvatarSrc,
        handleSubmitPet,
    } = useRegisterPet();

    return (
        <>
            {isSubmitting && (
              <div className="fixed inset-0 bg-opacity-5 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center gap-4 min-w-[300px] max-w-[400px]">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
                            <Spinner size="xl" className="absolute inset-0" />
                        </div>
                        <p className="text-lg font-semibold text-gray-700">Đang tạo thú cưng...</p>
                        <p className="text-sm text-gray-500 text-center">Vui lòng đợi trong giây lát</p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-11 py-8">
                    <form onSubmit={handleSubmitPet} className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative ${isSubmitting ? 'pointer-events-none opacity-70' : ''}`}>
                        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Thông tin đăng kí thú cưng</h2>
                                <div className="text-sm">
                                    Số pet hiện tại: <span className="font-bold">{petCount}</span>/{isVip ? '∞' : '3'}
                                </div>
                            </div>
                        </div>

                        {!isVip && petCount >= 3 && (
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 m-6 rounded-r-lg flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-amber-800 font-medium">Giới hạn đạt tối đa</p>
                                        <p className="text-amber-700 text-sm mt-1">Số lượng thú cưng đăng ký đạt giới hạn, vui lòng nâng cấp tài khoản để có thể đăng ký thêm!</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => router.push('/user/upgrade')}
                                    className="ml-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium whitespace-nowrap flex-shrink-0"
                                >
                                    Nâng cấp
                                </button>
                            </div>
                        )}

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-8">
                                <PetBasicFields petForm={petForm} errors={errors} onChange={handleInputChange} />
                                <PetDetailFields
                                    petForm={petForm}
                                    errors={errors}
                                    onChange={handleInputChange}
                                    avatarUploadMethod={avatarUploadMethod}
                                    setAvatarUploadMethod={setAvatarUploadMethod}
                                    avatarPreview={avatarPreview}
                                    fileInputRef={fileInputRef}
                                    onFileUpload={handleFileUpload}
                                    onUrlChange={handleUrlChange}
                                />
                            </div>

                            <PetIdCardPreview
                                petForm={petForm}
                                isFlipped={isFlipped}
                                onToggle={() => setIsFlipped(!isFlipped)}
                                avatarSrc={getCurrentAvatarSrc()}
                            />

                            {serverError && <PetServerError serverError={serverError} errors={errors} />}

                            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                                <Link href="/" className="flex-1">
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                                    >
                                        Hủy bỏ
                                    </button>
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2 ${isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700'
                                        }`}
                                >
                                    {isSubmitting && (
                                        <Spinner size="sm" color="white" />
                                    )}
                                    {isSubmitting ? 'Đang xử lý...' : 'Đăng ký thú cưng'}
                                </button>
                            </div>
                        </div>
                    </form>
            </div>
        </>
    );
}
