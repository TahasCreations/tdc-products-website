'use client';

interface ImageSkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'card' | 'gallery' | 'thumbnail';
}

export default function ImageSkeleton({ 
  width = 'w-full', 
  height = 'h-64', 
  className = '',
  variant = 'card'
}: ImageSkeletonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'gallery':
        return 'h-80 md:h-96';
      case 'thumbnail':
        return 'h-16 w-16';
      default:
        return height;
    }
  };

  return (
    <div className={`${width} ${getVariantClasses()} ${className} relative overflow-hidden`}>
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
      </div>
      
      {/* Content placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-2 animate-pulse"></div>
          <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// CSS animation için tailwind.config.ts'ye eklenmesi gereken:
// animation: {
//   'shimmer': 'shimmer 2s infinite',
// },
// keyframes: {
//   shimmer: {
//     '0%': { transform: 'translateX(-100%)' },
//     '100%': { transform: 'translateX(100%)' },
//   },
// },
