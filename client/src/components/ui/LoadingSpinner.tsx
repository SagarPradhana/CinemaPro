import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ className, fullScreen }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullScreen && 'fixed inset-0 bg-[#FDFAF5]/80 backdrop-blur-md z-50',
        className
      )}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#B8892A]/20 border-t-[#B8892A]" />
    </div>
  );
}