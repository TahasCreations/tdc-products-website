'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface InteractiveButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  ripple?: boolean;
}

export default function InteractiveButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  ripple = true,
  className = '',
  onClick,
  ...props 
}: InteractiveButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const variants = {
    primary: 'bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black hover:shadow-lg hover:shadow-[#CBA135]/30',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
    premium: 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRipples(prev => [...prev, { x, y, id }]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
    }
    
    onClick?.(e);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl font-semibold
        relative overflow-hidden
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300
        flex items-center justify-center gap-2
        ${className}
      `}
      onClick={handleClick}
      disabled={loading}
      {...props}
    >
      {/* Ripple effect */}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute w-5 h-5 bg-white rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Loading spinner */}
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}

      {/* Icon left */}
      {icon && iconPosition === 'left' && !loading && (
        <motion.span
          initial={{ x: -5, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {icon}
        </motion.span>
      )}

      {/* Content */}
      {!loading && children}

      {/* Icon right */}
      {icon && iconPosition === 'right' && !loading && (
        <motion.span
          initial={{ x: 5, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {icon}
        </motion.span>
      )}

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
}

// Icon Button variant
interface IconButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  icon: ReactNode;
  label: string;
  variant?: 'default' | 'premium';
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({ 
  icon, 
  label,
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}: IconButtonProps) {
  const variants = {
    default: 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700',
    premium: 'bg-gradient-to-br from-[#CBA135]/20 to-[#F4D03F]/20 text-[#CBA135] hover:from-[#CBA135]/30 hover:to-[#F4D03F]/30'
  };

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-full
        backdrop-blur-sm
        flex items-center justify-center
        shadow-lg hover:shadow-xl
        transition-all duration-300
        ${className}
      `}
      aria-label={label}
      {...props}
    >
      {icon}
    </motion.button>
  );
}
