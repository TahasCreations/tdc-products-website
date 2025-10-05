'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Clock, 
  TrendingUp, 
  Gift, 
  Shield, 
  Zap,
  Heart,
  Crown,
  Flame,
  Award,
  Tag,
  Sparkles,
  X
} from 'lucide-react';

// Rozet türleri
export const BadgeType = {
  NEW: 'new',
  SALE: 'sale',
  LIMITED: 'limited',
  PREORDER: 'preorder',
  HOT: 'hot',
  TRENDING: 'trending',
  PREMIUM: 'premium',
  FEATURED: 'featured',
  EXCLUSIVE: 'exclusive',
  SOLD_OUT: 'sold_out',
  COMING_SOON: 'coming_soon',
  BESTSELLER: 'bestseller',
  FREE_SHIPPING: 'free_shipping',
  GUARANTEED: 'guaranteed'
} as const;

export type BadgeType = typeof BadgeType[keyof typeof BadgeType];

// Rozet pozisyonları
export const BadgePosition = {
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  CENTER: 'center'
} as const;

export type BadgePosition = typeof BadgePosition[keyof typeof BadgePosition];

// Rozet konfigürasyonu
interface BadgeConfig {
  type: BadgeType;
  text: string;
  icon?: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor?: string;
  animation?: 'pulse' | 'bounce' | 'glow' | 'none';
  size?: 'sm' | 'md' | 'lg';
  position: BadgePosition;
}

// Rozet konfigürasyonları
const BADGE_CONFIGS: Record<BadgeType, Partial<BadgeConfig>> = {
  [BadgeType.NEW]: {
    text: 'Yeni',
    icon: <Sparkles className="w-3 h-3" />,
    color: '#0B0B0B',
    bgColor: '#CBA135',
    borderColor: '#F4D03F',
    animation: 'pulse',
    size: 'md'
  },
  [BadgeType.SALE]: {
    text: 'İndirim',
    icon: <Tag className="w-3 h-3" />,
    color: '#FFFFFF',
    bgColor: '#EF4444',
    borderColor: '#DC2626',
    animation: 'glow',
    size: 'md'
  },
  [BadgeType.LIMITED]: {
    text: 'Sınırlı',
    icon: <Crown className="w-3 h-3" />,
    color: '#0B0B0B',
    bgColor: '#F4D03F',
    borderColor: '#CBA135',
    animation: 'bounce',
    size: 'md'
  },
  [BadgeType.PREORDER]: {
    text: 'Ön Sipariş',
    icon: <Clock className="w-3 h-3" />,
    color: '#FFFFFF',
    bgColor: '#8B5CF6',
    borderColor: '#7C3AED',
    animation: 'pulse',
    size: 'md'
  },
  [BadgeType.HOT]: {
    text: 'Popüler',
    icon: <Flame className="w-3 h-3" />,
    color: '#FFFFFF',
    bgColor: '#F97316',
    borderColor: '#EA580C',
    animation: 'glow',
    size: 'md'
  },
  [BadgeType.TRENDING]: {
    text: 'Trend',
    icon: <TrendingUp className="w-3 h-3" />,
    color: '#0B0B0B',
    bgColor: '#10B981',
    borderColor: '#059669',
    animation: 'bounce',
    size: 'md'
  },
  [BadgeType.PREMIUM]: {
    text: 'Premium',
    icon: <Crown className="w-3 h-3" />,
    color: '#0B0B0B',
    bgColor: '#CBA135',
    borderColor: '#F4D03F',
    animation: 'glow',
    size: 'lg'
  },
  [BadgeType.FEATURED]: {
    text: 'Öne Çıkan',
    icon: <Star className="w-3 h-3" />,
    color: '#0B0B0B',
    bgColor: '#F4D03F',
    borderColor: '#CBA135',
    animation: 'pulse',
    size: 'md'
  },
  [BadgeType.EXCLUSIVE]: {
    text: 'Özel',
    icon: <Award className="w-3 h-3" />,
    color: '#FFFFFF',
    bgColor: '#1E40AF',
    borderColor: '#1D4ED8',
    animation: 'glow',
    size: 'lg'
  },
  [BadgeType.SOLD_OUT]: {
    text: 'Tükendi',
    icon: <X className="w-3 h-3" />,
    color: '#FFFFFF',
    bgColor: '#6B7280',
    borderColor: '#4B5563',
    animation: 'none',
    size: 'md'
  },
  [BadgeType.COMING_SOON]: {
    text: 'Yakında',
    icon: <Clock className="w-3 h-3" />,
    color: '#0B0B0B',
    bgColor: '#E5E7EB',
    borderColor: '#D1D5DB',
    animation: 'pulse',
    size: 'md'
  },
  [BadgeType.BESTSELLER]: {
    text: 'Çok Satan',
    icon: <Award className="w-3 h-3" />,
    color: '#0B0B0B',
    bgColor: '#FDE047',
    borderColor: '#FACC15',
    animation: 'bounce',
    size: 'md'
  },
  [BadgeType.FREE_SHIPPING]: {
    text: 'Ücretsiz Kargo',
    icon: <Zap className="w-3 h-3" />,
    color: '#FFFFFF',
    bgColor: '#10B981',
    borderColor: '#059669',
    animation: 'glow',
    size: 'sm'
  },
  [BadgeType.GUARANTEED]: {
    text: 'Garantili',
    icon: <Shield className="w-3 h-3" />,
    color: '#0B0B0B',
    bgColor: '#34D399',
    borderColor: '#10B981',
    animation: 'none',
    size: 'sm'
  }
};

interface DynamicBadgeProps {
  type: BadgeType;
  position?: BadgePosition;
  customText?: string;
  customIcon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function DynamicBadge({
  type,
  position = BadgePosition.TOP_RIGHT,
  customText,
  customIcon,
  className = '',
  onClick,
  disabled = false
}: DynamicBadgeProps) {
  const config = BADGE_CONFIGS[type];
  
  if (!config) {
    console.warn(`Unknown badge type: ${type}`);
    return null;
  }

  const text = customText || config.text;
  const icon = customIcon || config.icon;
  const size = config.size || 'md';
  const animation = config.animation || 'none';

  // Size sınıfları
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  // Position sınıfları
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  // Animasyon props
  const getAnimationProps = () => {
    switch (animation) {
      case 'pulse':
        return {
          animate: {
            scale: [1, 1.05, 1]
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        };
      case 'bounce':
        return {
          animate: {
            y: [0, -4, 0]
          },
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        };
      case 'glow':
        return {
          animate: {
            boxShadow: [
              `0 0 0 0 ${config.bgColor}`,
              `0 0 0 4px ${config.bgColor}40`,
              `0 0 0 0 ${config.bgColor}`
            ]
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      {...getAnimationProps()}
      className={`absolute z-10 ${positionClasses[position]} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick && !disabled ? 'pointer' : 'default' }}
    >
      <Badge
        className={`
          ${sizeClasses[size]} 
          font-semibold 
          border-2 
          shadow-lg 
          backdrop-blur-sm
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{
          color: config.color,
          backgroundColor: config.bgColor,
          borderColor: config.borderColor || config.bgColor
        }}
      >
        <div className="flex items-center space-x-1">
          {icon && (
            <motion.div
              animate={animation === 'bounce' ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {icon}
            </motion.div>
          )}
          <span>{text}</span>
        </div>
      </Badge>
    </motion.div>
  );
}

// Çoklu rozet wrapper
interface MultiBadgeProps {
  badges: Array<{
    type: BadgeType;
    position?: BadgePosition;
    customText?: string;
    customIcon?: React.ReactNode;
  }>;
  className?: string;
}

export function MultiBadge({ badges, className = '' }: MultiBadgeProps) {
  return (
    <div className={`relative ${className}`}>
      {badges.map((badge, index) => (
        <DynamicBadge
          key={`${badge.type}-${index}`}
          type={badge.type}
          position={badge.position}
          customText={badge.customText}
          customIcon={badge.customIcon}
          className="mb-1"
        />
      ))}
    </div>
  );
}

// Watermark bileşeni
interface WatermarkProps {
  text?: string;
  opacity?: number;
  position?: BadgePosition;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Watermark({
  text = 'TDC Market',
  opacity = 0.15,
  position = BadgePosition.BOTTOM_RIGHT,
  size = 'sm',
  className = ''
}: WatermarkProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  return (
    <div
      className={`absolute z-0 ${positionClasses[position]} ${sizeClasses[size]} ${className}`}
      style={{
        color: '#CBA135',
        opacity,
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      {text}
    </div>
  );
}

// Preset kombinasyonlar
export const BadgeCombinations = {
  newProduct: [
    { type: BadgeType.NEW, position: BadgePosition.TOP_RIGHT },
    { type: BadgeType.FREE_SHIPPING, position: BadgePosition.BOTTOM_RIGHT }
  ],
  
  saleItem: [
    { type: BadgeType.SALE, position: BadgePosition.TOP_RIGHT },
    { type: BadgeType.LIMITED, position: BadgePosition.TOP_LEFT }
  ],
  
  premiumProduct: [
    { type: BadgeType.PREMIUM, position: BadgePosition.TOP_RIGHT },
    { type: BadgeType.EXCLUSIVE, position: BadgePosition.BOTTOM_RIGHT }
  ],
  
  trendingItem: [
    { type: BadgeType.TRENDING, position: BadgePosition.TOP_RIGHT },
    { type: BadgeType.HOT, position: BadgePosition.TOP_LEFT }
  ]
};
