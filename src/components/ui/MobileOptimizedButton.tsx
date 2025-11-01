'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileOptimizedButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  loading?: boolean;
}

export default function MobileOptimizedButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  loading = false,
  className = '',
  ...props
}: MobileOptimizedButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation";
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg focus:ring-indigo-500 active:scale-95',
    secondary: 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md focus:ring-gray-500 active:scale-95',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 active:scale-95',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-lg focus:ring-red-500 active:scale-95',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg focus:ring-green-500 active:scale-95',
  };

  // Mobile-first sizing - minimum 44px for touch targets
  const sizes = {
    sm: 'min-h-[44px] px-4 py-2 text-sm',  // Mobile minimum
    md: 'min-h-[48px] px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base', // Standard
    lg: 'min-h-[52px] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg', // Large CTA
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        widthClass,
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>İşleniyor...</span>
        </>
      ) : (
        <>
          {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
          <span className="flex-1 text-center">{children}</span>
        </>
      )}
    </motion.button>
  );
}

// Preset button components for common use cases
export function PrimaryButton(props: Omit<MobileOptimizedButtonProps, 'variant'>) {
  return <MobileOptimizedButton variant="primary" {...props} />;
}

export function SecondaryButton(props: Omit<MobileOptimizedButtonProps, 'variant'>) {
  return <MobileOptimizedButton variant="secondary" {...props} />;
}

export function AddToCartButton(props: Omit<MobileOptimizedButtonProps, 'variant' | 'size'>) {
  return <MobileOptimizedButton variant="success" size="lg" fullWidth {...props} />;
}

export function BuyNowButton(props: Omit<MobileOptimizedButtonProps, 'variant' | 'size'>) {
  return <MobileOptimizedButton variant="primary" size="lg" fullWidth {...props} />;
}

export function CheckoutButton(props: Omit<MobileOptimizedButtonProps, 'variant' | 'size'>) {
  return <MobileOptimizedButton variant="primary" size="lg" fullWidth {...props} />;
}

