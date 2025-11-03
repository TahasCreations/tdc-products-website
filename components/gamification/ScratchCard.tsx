'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/components/ui/Toast';

interface ScratchCardProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed?: (reward: number) => void;
}

export default function ScratchCard({ orderId, isOpen, onClose, onRewardClaimed }: ScratchCardProps) {
  const [isScratched, setIsScratched] = useState(false);
  const [reward, setReward] = useState<number | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      initCanvas();
      generateReward();
    }
  }, [isOpen]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 200;

    // Draw scratch layer
    ctx.fillStyle = '#9333ea'; // Purple
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add pattern
    ctx.fillStyle = '#a855f7';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 30 + 10,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('KAZI KAZAN', canvas.width / 2, canvas.height / 2);

    ctx.font = '16px Arial';
    ctx.fillText('👆 Kaşımaya başla!', canvas.width / 2, canvas.height / 2 + 30);
  };

  const generateReward = async () => {
    try {
      const response = await fetch(`/api/scratch-card/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      if (response.ok) {
        const data = await response.json();
        setReward(data.reward);
      }
    } catch (error) {
      console.error('Failed to generate reward:', error);
      setReward(10); // Fallback reward
    }
  };

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsScratching(true);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left
      : e.clientX - rect.left;
    const y = 'touches' in e
      ? e.touches[0].clientY - rect.top
      : e.clientY - rect.top;

    // Scratch effect
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Check if scratched enough (>50%)
    checkScratchProgress(ctx);
  };

  const checkScratchProgress = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let scratchedPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) scratchedPixels++;
    }

    const scratchPercentage = (scratchedPixels / (pixels.length / 4)) * 100;

    if (scratchPercentage > 50 && !isScratched) {
      revealReward();
    }
  };

  const revealReward = () => {
    setIsScratched(true);
    
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });

    toast.success(`🎉 ${reward}₺ indirim kuponu kazandınız!`);

    if (onRewardClaimed && reward) {
      onRewardClaimed(reward);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />

          {/* Scratch Card */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-6 text-white text-center relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <Gift className="w-16 h-16 mx-auto mb-3" />
                <h2 className="text-3xl font-bold mb-2">🎁 Kazı Kazan!</h2>
                <p className="text-sm opacity-90">
                  Siparişin için sana özel bir hediye hazırladık!
                </p>
              </div>

              {/* Scratch Area */}
              <div className="p-8">
                {!isScratched ? (
                  <div className="relative">
                    {/* Hidden Reward (behind scratch layer) */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-white mb-2">
                          {reward}₺
                        </div>
                        <div className="text-white font-semibold">İNDİRİM KUPONU!</div>
                      </div>
                    </div>

                    {/* Scratch Canvas */}
                    <canvas
                      ref={canvasRef}
                      onMouseMove={(e) => {
                        if (e.buttons === 1) handleScratch(e);
                      }}
                      onTouchMove={handleScratch}
                      className="relative z-10 rounded-2xl cursor-pointer touch-none"
                      style={{ width: '300px', height: '200px' }}
                    />
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                    
                    <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                      {reward}₺
                    </h3>
                    
                    <p className="text-xl font-bold text-gray-900 mb-4">
                      İndirim Kuponu Kazandın!
                    </p>

                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-6">
                      <div className="text-sm text-gray-600 mb-2">Kupon Kodun</div>
                      <div className="text-2xl font-bold text-purple-600 tracking-wider">
                        SCRATCH{reward}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`SCRATCH${reward}`);
                        toast.success('Kupon kodu kopyalandı! 📋');
                      }}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Kuponu Kopyala
                    </button>

                    <p className="text-xs text-gray-500 mt-4">
                      * Bir sonraki alışverişinde kullanabilirsin
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Instructions */}
              {!isScratched && (
                <div className="px-8 pb-8 text-center">
                  <p className="text-sm text-gray-600">
                    👆 Fareyle veya parmağınla kaşıyarak ödülünü keşfet!
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

