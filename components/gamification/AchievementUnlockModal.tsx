'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface AchievementUnlockModalProps {
  achievement: {
    name: string;
    description: string;
    icon: string;
    points: number;
  } | null;
  onClose: () => void;
}

export default function AchievementUnlockModal({ achievement, onClose }: AchievementUnlockModalProps) {
  useEffect(() => {
    if (achievement) {
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotateY: 180 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Trophy Icon */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="inline-block mb-4"
              >
                <Trophy className="w-20 h-20 text-white drop-shadow-lg" />
              </motion.div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                🎉 Başarım Kazandın!
              </h2>

              {/* Achievement Icon & Name */}
              <div className="text-6xl mb-3">{achievement.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                {achievement.name}
              </h3>

              {/* Description */}
              <p className="text-white/90 text-lg mb-4">{achievement.description}</p>

              {/* Points Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white rounded-full shadow-lg"
              >
                <span className="text-2xl">⭐</span>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                  +{achievement.points} Puan
                </span>
              </motion.div>

              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                  className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full"
                />
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    rotate: [360, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity
                  }}
                  className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

