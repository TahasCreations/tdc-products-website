'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useVoiceSearch } from '@/lib/voice-search/voice-search-engine';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';

interface VoiceSearchButtonProps {
  onSearch?: (query: string) => void;
  className?: string;
}

export default function VoiceSearchButton({ onSearch, className = '' }: VoiceSearchButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { isSupported, startListening, stopListening, speak } = useVoiceSearch();
  const toast = useToast();
  const router = useRouter();

  if (!isSupported) {
    return null; // Don't show button if not supported
  }

  const handleVoiceSearch = async () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setTranscript('Dinliyorum...');

    await startListening(
      (result) => {
        console.log('Voice search result:', result);
        setTranscript(result.transcript);
        setIsListening(false);

        // Speak confirmation
        speak(`${result.query} için arama yapılıyor`);

        // Perform search
        if (onSearch) {
          onSearch(result.query);
        } else {
          router.push(`/search?q=${encodeURIComponent(result.query)}`);
        }

        toast.success(`🎤 "${result.transcript}" için arama yapıldı`);
        
        // Clear transcript after 3 seconds
        setTimeout(() => setTranscript(''), 3000);
      },
      (error) => {
        console.error('Voice search error:', error);
        setIsListening(false);
        setTranscript('');
        
        if (error === 'not-allowed') {
          toast.error('Mikrofon izni gerekli');
        } else {
          toast.error('Ses tanıma hatası');
        }
      }
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Voice Search Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleVoiceSearch}
        className={`p-3 rounded-full transition-all ${
          isListening
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
        }`}
        aria-label="Sesli arama"
      >
        {isListening ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </motion.button>

      {/* Listening Animation */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl p-4 min-w-[200px]"
          >
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-red-500 rounded-full"
                    animate={{
                      height: ['12px', '24px', '12px'],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Dinliyorum...</div>
                <div className="text-xs text-gray-600">Konuşabilirsiniz</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript Display */}
      <AnimatePresence>
        {transcript && !isListening && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 min-w-[200px] max-w-[300px]"
          >
            <div className="flex items-start space-x-2">
              <Volume2 className="w-4 h-4 text-indigo-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">"{transcript}"</div>
                <div className="text-xs text-gray-500 mt-1">Arama yapılıyor...</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

