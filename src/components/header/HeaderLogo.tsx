'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function HeaderLogo() {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex-shrink-0"
    >
      <Link 
        href="/" 
        className="flex items-center space-x-3 group"
        aria-label="TDC Market Ana Sayfa"
      >
        {/* Logo Icon */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
            <span className="text-white font-bold text-lg">T</span>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300" />
          </div>
        </motion.div>

        {/* Logo Text */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="hidden sm:block"
        >
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
              TDC Market
            </span>
            <p className="text-[11px] text-gray-500 -mt-0.5 font-medium whitespace-nowrap">
              Özel figürlerden elektroniğe, tasarımdan ev yaşamına
            </p>
            {/* Secondary links under logo */}
            <div className="mt-1 flex items-center space-x-3 text-[12px] text-gray-600">
              <Link href="/blog" className="hover:text-[#CBA135] transition-colors">Blog</Link>
              <span className="text-gray-300">•</span>
              <Link href="/hakkimizda" className="hover:text-[#CBA135] transition-colors">Hakkımızda</Link>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
