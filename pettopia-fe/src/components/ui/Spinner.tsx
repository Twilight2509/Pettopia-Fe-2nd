import { cn } from '@/utils/cn';

const SIZES = {
  xs: 'w-4 h-4 border-2',
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-4',
  lg: 'w-12 h-12 border-4',
  xl: 'w-16 h-16 border-4',
} as const;

const COLORS = {
  teal: 'border-teal-600',
  indigo: 'border-indigo-600',
  blue: 'border-blue-600',
  white: 'border-white',
  gray: 'border-gray-400',
  dark: 'border-gray-800',
} as const;

export type SpinnerSize = keyof typeof SIZES;
export type SpinnerColor = keyof typeof COLORS;

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

export default function Spinner({ size = 'md', color = 'teal', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Đang tải"
      className={cn(
        'inline-block shrink-0 rounded-full border-t-transparent animate-spin',
        SIZES[size],
        COLORS[color],
        className,
      )}
    />
  );
}
