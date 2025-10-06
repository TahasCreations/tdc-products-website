"use client";
import { useWishlist } from '@/contexts/WishlistContext';
import { motion } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, Eye, Star, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

export default function WishlistPage() {
  const { state, removeItem, clearWishlist, getItemCount } = useWishlist();
  const { addItem } = useCart();

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

        {/* Wishlist Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {state.items.map((item, index) => (
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
                
                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                >
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </button>

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

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Toplam {getItemCount()} ürün
              </h3>
              <p className="text-gray-600">
                Toplam değer: ₺{state.items.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/products"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Alışverişe Devam Et
              </Link>
              <button
                onClick={() => {
                  // Tüm ürünleri sepete ekle
                  state.items.forEach(item => handleAddToCart(item));
                }}
                className="px-6 py-2 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Tümünü Sepete Ekle
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
