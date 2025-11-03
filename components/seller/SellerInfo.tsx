'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface SellerInfoProps {
  seller: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    rating: number;
    reviewCount: number;
    totalSales?: number;
    policies?: {
      shipping?: string;
      returns?: string;
    };
    badges?: string[];
  };
  showFullDetails?: boolean;
}

export default function SellerInfo({ seller, showFullDetails = true }: SellerInfoProps) {
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center space-x-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
          } fill-current`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-50 to-indigo-50 p-5 rounded-xl border-2 border-indigo-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-lg">🏪 Satıcı Bilgileri</h3>
        {seller.badges && seller.badges.length > 0 && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
            ✓ Güvenilir
          </span>
        )}
      </div>

      {/* Seller Card */}
      <Link
        href={`/sellers/${seller.slug}`}
        className="flex items-center space-x-4 p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-200 border border-gray-200 group mb-4"
      >
        <div className="relative">
          <img
            src={seller.logo || `https://ui-avatars.com/api/?name=${seller.name}&background=4F46E5&color=fff`}
            alt={seller.name}
            className="w-16 h-16 rounded-full border-2 border-indigo-200 group-hover:border-indigo-400 transition-colors"
          />
          {seller.rating >= 4.5 && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-xs">⭐</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
            {seller.name}
          </div>
          
          <div className="flex items-center space-x-2 mt-1">
            <StarRating rating={seller.rating} />
            <span className="text-sm font-medium text-gray-700">{seller.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">
              ({seller.reviewCount} değerlendirme)
            </span>
          </div>
          
          {seller.totalSales && (
            <div className="text-xs text-gray-600 mt-1">
              📦 {seller.totalSales.toLocaleString()} satış
            </div>
          )}
        </div>

        <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      {/* Full Details */}
      {showFullDetails && (
        <>
          {/* Policies */}
          {seller.policies && (
            <div className="space-y-2 text-sm mb-4">
              {seller.policies.shipping && (
                <div className="flex items-start space-x-2">
                  <span className="text-lg flex-shrink-0">🚚</span>
                  <div>
                    <div className="font-medium text-gray-700">Kargo</div>
                    <div className="text-gray-600">{seller.policies.shipping}</div>
                  </div>
                </div>
              )}
              {seller.policies.returns && (
                <div className="flex items-start space-x-2">
                  <span className="text-lg flex-shrink-0">↩️</span>
                  <div>
                    <div className="font-medium text-gray-700">İade</div>
                    <div className="text-gray-600">{seller.policies.returns}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Badges */}
          {seller.badges && seller.badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {seller.badges.map((badge, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2">
        <Link
          href={`/sellers/${seller.slug}`}
          className="px-4 py-2 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium text-center"
        >
          Mağazayı Ziyaret Et
        </Link>
        <Link
          href={`/sellers/${seller.slug}#reviews`}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium text-center"
        >
          Yorumları Gör
        </Link>
      </div>
    </motion.div>
  );
}

