"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, Camera, Plus, Check, X, Filter } from 'lucide-react';
import Image from 'next/image';
import ReviewForm from './ReviewForm';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  pros?: string[];
  cons?: string[];
  isVerified: boolean;
  isHelpful: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  likes: Array<{
    userId: string;
    isLike: boolean;
  }>;
}

interface ReviewSectionProps {
  productId: string;
  productTitle: string;
  currentRating: number;
  reviewCount: number;
  ratingDistribution: Record<number, number>;
}

export default function ReviewSection({ 
  productId, 
  productTitle, 
  currentRating, 
  reviewCount,
  ratingDistribution 
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId, page, filter, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        productId,
        page: page.toString(),
        limit: '10',
        sortBy,
      });
      
      if (filter !== 'all') {
        params.append('rating', filter.toString());
      }

      const response = await fetch(`/api/reviews?${params}`);
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Değerlendirmeler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (reviewId: string, isLike: boolean) => {
    try {
      const response = await fetch('/api/reviews/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, isLike }),
      });

      if (response.ok) {
        // Review'ı güncelle
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, isHelpful: review.isHelpful + (isLike ? 1 : -1) }
            : review
        ));
      }
    } catch (error) {
      console.error('Like işlemi sırasında hata:', error);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    const texts = {
      1: 'Çok Kötü',
      2: 'Kötü', 
      3: 'Orta',
      4: 'İyi',
      5: 'Mükemmel'
    };
    return texts[rating as keyof typeof texts] || '';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Değerlendirmeler</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(currentRating), 'lg')}
              <span className="text-2xl font-bold text-gray-900">{currentRating.toFixed(1)}</span>
            </div>
            <span className="text-gray-600">({reviewCount} değerlendirme)</span>
          </div>
        </div>
        <button
          onClick={() => setShowReviewForm(true)}
          className="px-4 py-2 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Değerlendirme Yap
        </button>
      </div>

      {/* Rating Distribution */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">Rating Dağılımı</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating] || 0;
            const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-8">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#CBA135] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtrele:</span>
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tümü' },
            { value: 5, label: '5 Yıldız' },
            { value: 4, label: '4 Yıldız' },
            { value: 3, label: '3 Yıldız' },
            { value: 2, label: '2 Yıldız' },
            { value: 1, label: '1 Yıldız' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as any)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === option.value
                  ? 'bg-[#CBA135] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="ml-auto px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
        >
          <option value="newest">En Yeni</option>
          <option value="oldest">En Eski</option>
          <option value="helpful">En Yararlı</option>
          <option value="rating">En Yüksek Puan</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-20 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Henüz değerlendirme bulunmuyor.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-gray-100 pb-6 last:border-b-0"
            >
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-full flex items-center justify-center text-white font-medium">
                  {review.user.name.charAt(0).toUpperCase()}
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">{review.user.name}</span>
                    {review.isVerified && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        <Check className="w-3 h-3" />
                        Doğrulanmış Alışveriş
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600">
                      {getRatingText(review.rating)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>

                  {review.title && (
                    <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                  )}

                  {review.comment && (
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                  )}

                  {/* Pros & Cons */}
                  {(review.pros || review.cons) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      {review.pros && (
                        <div>
                          <h5 className="text-sm font-medium text-green-700 mb-1">Artıları:</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {review.pros.map((pro, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <span className="text-green-500">•</span>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {review.cons && (
                        <div>
                          <h5 className="text-sm font-medium text-red-700 mb-1">Eksileri:</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {review.cons.map((con, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <span className="text-red-500">•</span>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {review.images.map((image, index) => (
                        <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={image}
                            alt={`Review image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Like/Dislike */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(review.id, true)}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Yararlı ({review.isHelpful})
                    </button>
                    <button
                      onClick={() => handleLike(review.id, false)}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Yararsız
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  page === pageNum
                    ? 'bg-[#CBA135] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          productId={productId}
          productTitle={productTitle}
          onClose={() => setShowReviewForm(false)}
          onSuccess={() => {
            setShowReviewForm(false);
            fetchReviews();
          }}
        />
      )}
    </div>
  );
}
