'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface SellerReview {
  id: string;
  rating: number;
  communicationRating?: number;
  shippingSpeedRating?: number;
  productQualityRating?: number;
  title?: string;
  comment?: string;
  pros: string[];
  cons: string[];
  isVerified: boolean;
  isHelpful: number;
  sellerResponse?: string;
  sellerResponseAt?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

export default function SellerProfilePage({ params }: { params: { slug: string } }) {
  const { data: session } = useSession();
  const [seller, setSeller] = useState<any>(null);
  const [reviews, setReviews] = useState<SellerReview[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchSellerData();
  }, [params.slug, page, sortBy]);

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      // Bu gerçek implementasyonda seller slug'dan ID'yi bulmalısınız
      // Şimdilik mock data kullanıyoruz
      const mockSeller = {
        id: '1',
        storeName: 'AnimeWorld Store',
        storeSlug: 'animeworld-store',
        description: 'Anime ve manga ürünlerinde uzman mağaza. Orijinal ve lisanslı ürünler.',
        logoUrl: 'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=AW',
        rating: 4.8,
        reviewCount: 156,
        totalSales: 2340,
        policies: {
          shipping: '2-3 iş günü içinde kargo',
          returns: '14 gün içinde koşulsuz iade',
          warranty: '2 yıl satıcı garantisi'
        }
      };

      setSeller(mockSeller);
      
      // Mock reviews - gerçekte API'den gelecek
      setReviews([]);
      setStats({
        ratingDistribution: {
          5: 98,
          4: 42,
          3: 10,
          2: 4,
          1: 2
        },
        averageRatings: {
          communication: 4.9,
          shippingSpeed: 4.7,
          productQuality: 4.8
        }
      });
    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } fill-current`}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Satıcı Bulunamadı</h1>
          <Link href="/sellers" className="text-indigo-600 hover:text-indigo-800">
            Satıcılara dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seller Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <div className="flex items-start space-x-6">
            <img
              src={seller.logoUrl}
              alt={seller.storeName}
              className="w-24 h-24 rounded-full border-4 border-gray-200"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{seller.storeName}</h1>
              <p className="text-gray-600 mb-4">{seller.description}</p>
              
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-2">
                  <StarRating rating={Math.round(seller.rating)} size="md" />
                  <span className="text-lg font-semibold text-gray-900">{seller.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({seller.reviewCount} değerlendirme)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">📦 {seller.totalSales.toLocaleString()} satış</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                  Ürünleri Gör
                </button>
                <button 
                  onClick={() => setShowReviewForm(true)}
                  className="px-6 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium"
                >
                  Değerlendir
                </button>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="mt-6 pt-6 border-t grid md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🚚</span>
              <div>
                <div className="font-medium text-gray-900">Kargo</div>
                <div className="text-sm text-gray-600">{seller.policies.shipping}</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">↩️</span>
              <div>
                <div className="font-medium text-gray-900">İade</div>
                <div className="text-sm text-gray-600">{seller.policies.returns}</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="font-medium text-gray-900">Garanti</div>
                <div className="text-sm text-gray-600">{seller.policies.warranty}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rating Stats & Reviews */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Rating Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Değerlendirme Detayları</h2>
              
              {/* Overall Rating */}
              <div className="text-center pb-6 border-b mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">{seller.rating.toFixed(1)}</div>
                <StarRating rating={Math.round(seller.rating)} size="lg" />
                <div className="text-sm text-gray-600 mt-2">{seller.reviewCount} değerlendirme</div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-3 mb-6">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats?.ratingDistribution?.[star] || 0;
                  const percentage = seller.reviewCount > 0 
                    ? (count / seller.reviewCount) * 100 
                    : 0;
                  
                  return (
                    <div key={star} className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700 w-8">{star} ⭐</span>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Criteria Ratings */}
              {stats?.averageRatings && (
                <div className="pt-6 border-t space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-4">Kategorilere Göre Puan</h3>
                  {[
                    { label: 'İletişim', value: stats.averageRatings.communication, icon: '💬' },
                    { label: 'Kargo Hızı', value: stats.averageRatings.shippingSpeed, icon: '🚀' },
                    { label: 'Ürün Kalitesi', value: stats.averageRatings.productQuality, icon: '✨' }
                  ].map((criteria) => (
                    <div key={criteria.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 flex items-center space-x-2">
                        <span>{criteria.icon}</span>
                        <span>{criteria.label}</span>
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600"
                            style={{ width: `${(criteria.value / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-8">
                          {criteria.value.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Müşteri Yorumları</h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="recent">En Yeni</option>
                  <option value="helpful">En Yararlı</option>
                  <option value="rating">En Yüksek Puan</option>
                </select>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Değerlendirme Yok</h3>
                  <p className="text-gray-600">Bu satıcı için ilk değerlendirmeyi siz yapın!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={review.user.image || `https://ui-avatars.com/api/?name=${review.user.name}`}
                            alt={review.user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{review.user.name}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                          </div>
                          {review.isVerified && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                              ✓ Doğrulanmış Alışveriş
                            </span>
                          )}
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>

                      {/* Review Content */}
                      {review.title && (
                        <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                      )}
                      {review.comment && (
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                      )}

                      {/* Pros & Cons */}
                      {(review.pros.length > 0 || review.cons.length > 0) && (
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          {review.pros.length > 0 && (
                            <div className="bg-green-50 p-3 rounded-lg">
                              <div className="font-medium text-green-900 mb-2">👍 Artıları</div>
                              <ul className="text-sm text-green-700 space-y-1">
                                {review.pros.map((pro, i) => (
                                  <li key={i}>• {pro}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {review.cons.length > 0 && (
                            <div className="bg-red-50 p-3 rounded-lg">
                              <div className="font-medium text-red-900 mb-2">👎 Eksileri</div>
                              <ul className="text-sm text-red-700 space-y-1">
                                {review.cons.map((con, i) => (
                                  <li key={i}>• {con}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Seller Response */}
                      {review.sellerResponse && (
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-600">
                          <div className="font-medium text-gray-900 mb-2">
                            {seller.storeName} yanıtladı
                          </div>
                          <p className="text-sm text-gray-700">{review.sellerResponse}</p>
                          <div className="text-xs text-gray-500 mt-2">
                            {new Date(review.sellerResponseAt!).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      )}

                      {/* Helpful Button */}
                      <div className="flex items-center space-x-4 mt-3 text-sm">
                        <button className="text-gray-600 hover:text-indigo-600 flex items-center space-x-1">
                          <span>👍</span>
                          <span>Yararlı ({review.isHelpful})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

