'use client';

import { motion } from 'framer-motion';

interface DigitalProductBadgeProps {
  productType: 'PHYSICAL' | 'DIGITAL' | 'SERVICE';
  fileFormat?: string;
  fileSize?: number;
  licenseType?: string;
  className?: string;
}

export default function DigitalProductBadge({
  productType,
  fileFormat,
  fileSize,
  licenseType,
  className = ''
}: DigitalProductBadgeProps) {
  if (productType !== 'DIGITAL') return null;

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = (bytes / (1024 * 1024)).toFixed(1);
    return `${mb} MB`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main Badge */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium text-sm shadow-md"
      >
        <span className="text-base">📥</span>
        <span>Dijital Ürün</span>
      </motion.div>

      {/* Details */}
      <div className="flex flex-wrap gap-2">
        {fileFormat && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium uppercase">
            {fileFormat}
          </span>
        )}
        {fileSize && (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            💾 {formatFileSize(fileSize)}
          </span>
        )}
        {licenseType && (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            📜 {licenseType === 'personal' ? 'Kişisel' : licenseType === 'commercial' ? 'Ticari' : 'Genişletilmiş'}
          </span>
        )}
      </div>

      {/* Features */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs space-y-1">
        <div className="flex items-center space-x-2 text-purple-700">
          <span>✅</span>
          <span>Anında indirme</span>
        </div>
        <div className="flex items-center space-x-2 text-purple-700">
          <span>✅</span>
          <span>Kargo ücreti yok</span>
        </div>
        <div className="flex items-center space-x-2 text-purple-700">
          <span>✅</span>
          <span>Ömür boyu erişim</span>
        </div>
      </div>
    </div>
  );
}

