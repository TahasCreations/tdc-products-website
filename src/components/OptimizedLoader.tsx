'use client';

interface OptimizedLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function OptimizedLoader({ 
  message = 'Yükleniyor...', 
  size = 'md' 
}: OptimizedLoaderProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-center">
        <div className={`animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-2 ${sizeClasses[size]}`}></div>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}
