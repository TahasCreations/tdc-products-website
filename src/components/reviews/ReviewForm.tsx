"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, X, Plus, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface ReviewFormProps {
  productId: string;
  productTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  rating: number;
  title: string;
  comment: string;
  images: string[];
  pros: string[];
  cons: string[];
}

export default function ReviewForm({ productId, productTitle, onClose, onSuccess }: ReviewFormProps) {
  const [formData, setFormData] = useState<FormData>({
    rating: 0,
    title: '',
    comment: '',
    images: [],
    pros: [],
    cons: []
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    setErrors(prev => ({ ...prev, rating: '' }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const addPro = () => {
    if (newPro.trim()) {
      setFormData(prev => ({ ...prev, pros: [...prev.pros, newPro.trim()] }));
      setNewPro('');
    }
  };

  const removePro = (index: number) => {
    setFormData(prev => ({ ...prev, pros: prev.pros.filter((_, i) => i !== index) }));
  };

  const addCon = () => {
    if (newCon.trim()) {
      setFormData(prev => ({ ...prev, cons: [...prev.cons, newCon.trim()] }));
      setNewCon('');
    }
  };

  const removeCon = (index: number) => {
    setFormData(prev => ({ ...prev, cons: prev.cons.filter((_, i) => i !== index) }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // TODO: Implement image upload to server
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.rating === 0) {
      newErrors.rating = 'Lütfen bir puan verin';
    }

    if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Yorum en az 10 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating: formData.rating,
          title: formData.title,
          comment: formData.comment,
          images: formData.images,
          pros: formData.pros,
          cons: formData.cons,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        setErrors({ submit: error.error || 'Değerlendirme gönderilirken hata oluştu' });
      }
    } catch (error) {
      setErrors({ submit: 'Beklenmeyen bir hata oluştu' });
    } finally {
      setLoading(false);
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit} className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Değerlendirme Yaz</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">
              <span className="font-medium">Ürün:</span> {productTitle}
            </p>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puanınız *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || formData.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
              {formData.rating > 0 && (
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {getRatingText(formData.rating)}
                </span>
              )}
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlık (Opsiyonel)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Değerlendirmenize kısa bir başlık ekleyin"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
            />
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yorumunuz *
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Ürün hakkındaki deneyiminizi paylaşın..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              En az 10 karakter (Şu anda: {formData.comment.length})
            </p>
            {errors.comment && (
              <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
            )}
          </div>

          {/* Pros */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Artıları
            </label>
            <div className="space-y-2">
              {formData.pros.map((pro, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="flex-1 text-sm text-gray-700">{pro}</span>
                  <button
                    type="button"
                    onClick={() => removePro(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPro}
                  onChange={(e) => setNewPro(e.target.value)}
                  placeholder="Artı ekleyin..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
                />
                <button
                  type="button"
                  onClick={addPro}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>

          {/* Cons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eksileri
            </label>
            <div className="space-y-2">
              {formData.cons.map((con, index) => (
                <div key={index} className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="flex-1 text-sm text-gray-700">{con}</span>
                  <button
                    type="button"
                    onClick={() => removeCon(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCon}
                  onChange={(e) => setNewCon(e.target.value)}
                  placeholder="Eksi ekleyin..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
                />
                <button
                  type="button"
                  onClick={addCon}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotoğraflar (Opsiyonel)
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={image}
                    alt={`Review image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#CBA135] transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500">
              En fazla 5 fotoğraf yükleyebilirsiniz (JPG, PNG, max 5MB)
            </p>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Gönderiliyor...
                </>
              ) : (
                'Değerlendirmeyi Gönder'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
