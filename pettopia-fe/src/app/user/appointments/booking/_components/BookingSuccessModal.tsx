export default function BookingSuccessModal() {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold mb-3 text-gray-800">Đặt lịch thành công!</h3>
        <p className="text-gray-600 text-lg">Chúng tôi đã nhận lịch hẹn của bạn</p>
        <p className="mt-6 text-sm text-gray-500">
          Bạn sẽ nhận thông báo qua ứng dụng và SMS sớm nhé
        </p>
      </div>
    </div>
  );
}
