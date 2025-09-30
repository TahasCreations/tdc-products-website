'use client';

import { useState } from 'react';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface AnnouncementBarProps {
  onClose?: () => void;
}

export default function AnnouncementBar({ onClose }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-tdc text-white py-3 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-slide-right"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex items-center space-x-2 text-sm font-medium">
          <InformationCircleIcon className="w-4 h-4 flex-shrink-0" />
          <span>
            <span className="font-bold">%7 komisyon</span> • 
            <span className="mx-2">Özel domain</span> • 
            <span className="mx-2">14 gün iade</span>
          </span>
        </div>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Duyuruyu kapat"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

