"use client";

// Force dynamic rendering to avoid prerendering errors
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { motion } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, Eye, Star, Share2, Filter, SortAsc, Bell, BellRing } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import GlassCard from '@/components/ui/GlassCard';
import InteractiveButton, { IconButton } from '@/components/ui/InteractiveButton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useToast } from '@/components/ui/Toast';

export default function WishlistPage() {
  const { state, removeItem, clearWishlist, getItemCount } = useWishlist();
  const { addItem } = useCart();
  const toast = useToast();
  const [sortBy, setSortBy] = useState<'date' | 'price-low' | 'price-high' | 'name'>('date');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filtreleme ve sıralama
  const filteredAndSortedItems = state.items
    .filter(item => filterCategory === 'all' || item.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Kategorileri al
  const categories = ['all', ...Array.from(new Set(state.items.map(item => item.category)))];

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      sellerId: 'unknown',
      sellerName: 'Bilinmiyor',
      maxStock: 1
    });
    toast.success('Sepete Eklendi!', `${item.title} sepetinize eklendi.`);
  };

  const handleShareWishlist = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TDC Market - Favori Ürünlerim',
          text: 'Favori ürünlerime göz atın!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Paylaşım iptal edildi');
      }
    } else {
      // Fallback: URL'yi kopyala
      navigator.clipboard.writeText(window.location.href);
      alert('Wishlist linki kopyalandı!');
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
            <Heart className="w-full h-full" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Favori Ürünleriniz Boş</h2>
          <p className="text-gray-600 mb-8">
            Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Alışverişe Başla
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Favori Ürünlerim</h1>
              <p className="text-gray-600">{getItemCount()} ürün</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleShareWishlist}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Paylaş
              </button>
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Tümünü Temizle
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters and Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Kategori:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Tümü' : category.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Sırala:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                >
                  <option value="date">Eklenme Tarihi</option>
                  <option value="price-low">Fiyat (Düşük → Yüksek)</option>
                  <option value="price-high">Fiyat (Yüksek → Düşük)</option>
                  <option value="name">İsim (A → Z)</option>
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredAndSortedItems.length} ürün gösteriliyor
            </div>
          </div>
        </motion.div>

        {/* Wishlist Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredAndSortedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  {/* Price Alert Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // TODO: Fiyat bildirimi ekle
                      alert('Fiyat düşünce bildirim alacaksınız!');
                    }}
                    className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                    title="Fiyat düşünce bildirim al"
                  >
                    <Bell className="w-4 h-4 text-blue-500" />
                  </button>
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                    title="Favorilerden çıkar"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <Link
                    href={`/products/${item.slug}`}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Eye className="w-5 h-5 text-gray-700" />
                  </Link>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="p-2 bg-[#CBA135] text-white rounded-full hover:bg-[#B8941F] transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-[#CBA135] transition-colors">
                    {item.title}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= item.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({item.reviewCount})
                  </span>
                </div>

                {/* Category */}
                <p className="text-sm text-gray-500 mb-3 capitalize">
                  {item.category.replace('-', ' ')}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ₺{item.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(item.addedAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bulk Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8 bg-gradient-to-r from-[#CBA135]/10 to-[#F4D03F]/10 rounded-lg border border-[#CBA135]/20 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Toplu İşlemler</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                filteredAndSortedItems.forEach(item => handleAddToCart(item));
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Tümünü Sepete Ekle
            </button>
            
            <button
              onClick={() => {
                const selectedItems = filteredAndSortedItems.filter(item => 
                  item.category === filterCategory || filterCategory === 'all'
                );
                selectedItems.forEach(item => removeItem(item.id));
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Filtrelenmiş Ürünleri Sil
            </button>
            
            <button
              onClick={handleShareWishlist}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Wishlist'i Paylaş
            </button>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Toplam {getItemCount()} ürün
              </h3>
              <p className="text-gray-600">
                Toplam değer: ₺{filteredAndSortedItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
              </p>
            </div>
            <Link
              href="/products"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
