'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useGamification } from '@/lib/gamification/gamification-engine';

interface LevelBadgeProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  className?: string;
}

export default function LevelBadge({ 
  points, 
  size = 'md', 
  showProgress = false,
  className = '' 
}: LevelBadgeProps) {
  const gamification = useGamification();
  const level = gamification.getUserLevel(points);
  const nextLevel = gamification.getNextLevel(points);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  const progress = nextLevel
    ? ((points - level.minPoints) / (nextLevel.level.minPoints - level.minPoints)) * 100
    : 100;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Badge */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={`rounded-full flex flex-col items-center justify-center font-bold text-white shadow-lg ${sizeClasses[size]}`}
        style={{ backgroundColor: level.color }}
        title={`${level.name} - Level ${level.level}`}
      >
        <Trophy className={iconSizes[size]} />
        <span className="text-[10px] mt-0.5">{level.level}</span>
      </motion.div>

      {/* Level Info */}
      {showProgress && (
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-gray-900">{level.name}</span>
            {nextLevel && (
              <span className="text-xs text-gray-600">
                {nextLevel.pointsNeeded} puan kaldı
              </span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(to right, ${level.color}, ${nextLevel?.level.color || level.color})`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

