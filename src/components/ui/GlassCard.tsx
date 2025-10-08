'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: 'default' | 'premium' | 'subtle';
  hover3d?: boolean;
  glowColor?: string;
}

export default function GlassCard({ 
  children, 
  variant = 'default',
  hover3d = true,
  glowColor = '#CBA135',
  className = '',
  ...props 
}: GlassCardProps) {
  const variants = {
    default: 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/20',
    premium: 'bg-gradient-to-br from-white/80 via-white/70 to-white/60 dark:from-gray-900/80 dark:via-gray-900/70 dark:to-gray-900/60 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30',
    subtle: 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border border-white/10 dark:border-gray-700/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover3d ? { 
        y: -8, 
        rotateX: 5,
        rotateY: 5,
        scale: 1.02,
        boxShadow: `0 20px 40px -12px ${glowColor}33`
      } : undefined}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className={`
        ${variants[variant]}
        rounded-2xl shadow-xl
        relative overflow-hidden
        transition-all duration-300
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      {...props}
    >
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Glow effect */}
      <div 
        className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${glowColor}, transparent)`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
