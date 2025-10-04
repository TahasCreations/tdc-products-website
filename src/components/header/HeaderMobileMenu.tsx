'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import HeaderNav from './HeaderNav';
import HeaderActions from './HeaderActions';

interface HeaderMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchClick: () => void;
}

export default function HeaderMobileMenu({ 
  isOpen, 
  onClose, 
  onSearchClick 
}: HeaderMobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Mobile Menu */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">TDC Market</h2>
                  <p className="text-xs text-gray-500">Premium Koleksiyon</p>
                </div>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                aria-label="Menüyü Kapat"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6">
              <HeaderNav isMobile={true} onItemClick={onClose} />
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 p-6">
              <HeaderActions 
                isMobile={true} 
                onSearchClick={() => {
                  onSearchClick();
                  onClose();
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
