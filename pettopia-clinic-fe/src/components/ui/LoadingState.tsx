import { cn } from '@/utils/cn';
import Spinner, { type SpinnerColor, type SpinnerSize } from './Spinner';

interface LoadingStateProps {
  message?: string;
  size?: SpinnerSize;
  color?: SpinnerColor;
  fullScreen?: boolean;
  className?: string;
}

export default function LoadingState({
  message,
  size = 'lg',
  color = 'teal',
  fullScreen = false,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 text-center',
        fullScreen ? 'min-h-screen' : 'py-16',
        className,
      )}
    >
      <Spinner size={size} color={color} />
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  );
}
