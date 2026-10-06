interface Props {
  currentStep: number;
}

export default function StepProgress({ currentStep }: Props) {
  return (
    <div className="mb-12">
      <div className="flex justify-center items-center">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${currentStep >= step ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step}
            </div>
            {step < 5 && <div className={`w-24 h-1 mx-4 ${currentStep > step ? 'bg-teal-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-4 text-center mt-4 text-sm font-medium">
        <span className={currentStep >= 1 ? 'text-teal-600' : 'text-gray-500'}>Phòng khám</span>
        <span className={currentStep >= 2 ? 'text-teal-600' : 'text-gray-500'}>Ngày & Ca</span>
        <span className={currentStep >= 3 ? 'text-teal-600' : 'text-gray-500'}>Thú cưng</span>
        <span className={currentStep >= 4 ? 'text-teal-600' : 'text-gray-500'}>Dịch vụ</span>
        <span className={currentStep >= 5 ? 'text-teal-600' : 'text-gray-500'}>Xác nhận</span>
      </div>
    </div>
  );
}
