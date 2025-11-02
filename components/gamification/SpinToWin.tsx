"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles } from 'lucide-react';

const PRIZES = [
  { id: 1, label: '10% İndirim', color: '#FF6B6B', angle: 0 },
  { id: 2, label: 'Ücretsiz Kargo', color: '#4ECDC4', angle: 45 },
  { id: 3, label: '50₺ Hediye', color: '#FFE66D', angle: 90 },
  { id: 4, label: '5% İndirim', color: '#95E1D3', angle: 135 },
  { id: 5, label: '100 Puan', color: '#F38181', angle: 180 },
  { id: 6, label: 'Tekrar Dene', color: '#AA96DA', angle: 225 },
  { id: 7, label: '25₺ Hediye', color: '#FCBAD3', angle: 270 },
  { id: 8, label: '15% İndirim', color: '#FFFFD2', angle: 315 },
];

export default function SpinToWin() {
  const [isOpen, setIsOpen] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<typeof PRIZES[0] | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const randomPrize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
    const spins = 5;
    const finalRotation = 360 * spins + randomPrize.angle;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setPrize(randomPrize);
    }, 4000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full relative"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Çarkı Çevir, Kazan!
              </h2>
              <p className="text-gray-600">
                İlk alışverişinize özel hediyenizi kazanın
              </p>
            </div>

            {/* Wheel */}
            <div className="relative w-72 h-72 mx-auto mb-6">
              <motion.div
                className="w-full h-full rounded-full relative"
                style={{
                  background: `conic-gradient(${PRIZES.map((p, i) => 
                    `${p.color} ${i * 45}deg ${(i + 1) * 45}deg`
                  ).join(', ')})`
                }}
                animate={{ rotate: rotation }}
                transition={{ duration: 4, ease: 'easeOut' }}
              >
                {PRIZES.map((prize, index) => (
                  <div
                    key={prize.id}
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{
                      transform: `rotate(${index * 45 + 22.5}deg)`,
                      transformOrigin: 'center',
                    }}
                  >
                    <span
                      className="text-white font-bold text-xs"
                      style={{ transform: `translateY(-120px)` }}
                    >
                      {prize.label}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Center Button */}
              <button
                onClick={handleSpin}
                disabled={isSpinning || !!prize}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-2xl border-4 border-purple-600 flex items-center justify-center font-bold text-purple-600 hover:scale-110 transition-transform disabled:opacity-50"
              >
                {isSpinning ? '...' : 'ÇEVİR'}
              </button>

              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-red-600" />
              </div>
            </div>

            {/* Result */}
            {prize && !isSpinning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl"
              >
                <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-3 animate-bounce" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Tebrikler!
                </h3>
                <p className="text-lg text-gray-700 mb-4">
                  {prize.label} kazandınız!
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                >
                  Ödülü Kullan
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

