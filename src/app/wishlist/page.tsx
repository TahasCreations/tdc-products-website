'use client';

export const dynamic = 'force-dynamic';

import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import OptimizedLoader from '../../components/OptimizedLoader';
import WishlistButton from '../../components/WishlistButton';
import AddToCartButton from '../../components/AddToCartButton';
import SimpleRecommendationEngine from '../../components/ai/SimpleRecommendationEngine';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function WishlistPage() {
  const { user } = useAuth();
  const { wishlistItems, isLoading, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy');
    } catch {
      return 'Tarih belirtilmemiş';
    }
  };

  const handleAddAllToCart = async () => {
    for (const item of wishlistItems) {
      addItem({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        image: item.product.image
      }, 1);
    }
    alert('Tüm ürünler sepete eklendi!');
  };

  const handleClearWishlist = async () => {
    if (confirm('Wishlist\'inizi temizlemek istediğinizden emin misiniz?')) {
      await clearWishlist();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <i className="ri-heart-line text-4xl text-red-500 dark:text-red-400"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Favorilerim&apos;e Erişim
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Favori ürünlerinizi görüntülemek için giriş yapmanız gerekiyor.
          </p>
          <Link
            href="/auth"
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <i className="ri-login-box-line mr-2"></i>
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <OptimizedLoader message="Wishlist yükleniyor..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                <i className="ri-heart-line text-red-500 mr-2"></i>
                Favorilerim
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Favori ürünlerinizi kaydedin ve daha sonra kolayca erişin
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 px-4 py-2 rounded-full">
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  <i className="ri-heart-fill mr-1"></i>
                  {wishlistItems.length} ürün
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {wishlistItems.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAddAllToCart}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <i className="ri-shopping-cart-line"></i>
                  <span>Tümünü Sepete Ekle</span>
                </button>
                <button
                  onClick={handleClearWishlist}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <i className="ri-delete-bin-line"></i>
                  <span>Wishlist&apos;i Temizle</span>
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Son güncelleme: {formatDate(new Date().toISOString())}
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center transition-colors duration-300">
            <div className="w-32 h-32 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <i className="ri-heart-line text-4xl text-red-500 dark:text-red-400"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Favorilerim Boş
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Henüz favori ürününüz yok. Ürünleri keşfedin ve beğendiğiniz ürünleri 
              favorilerinize ekleyin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <i className="ri-store-line mr-2"></i>
                Ürünleri Keşfet
              </Link>
              <Link
                href="/"
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              >
                <i className="ri-home-line mr-2"></i>
                Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.product.image || '/placeholder-product.jpg'}
                    alt={item.product.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <WishlistButton
                      productId={item.product.id}
                      productTitle={item.product.title}
                      size="sm"
                      variant="icon"
                    />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {item.product.category}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                    {item.product.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      ₺{item.product.price.toLocaleString('tr-TR')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.product.stock > 10 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : item.product.stock > 0 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {item.product.stock > 10 
                        ? 'Stokta' 
                        : item.product.stock > 0 
                        ? `Son ${item.product.stock} adet`
                        : 'Stokta yok'
                      }
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                    <i className="ri-calendar-line mr-1"></i>
                    Eklenme tarihi: {formatDate(item.created_at)}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                                         <AddToCartButton
                       product={{
                         id: item.product.id,
                         title: item.product.title,
                         price: item.product.price,
                         image: item.product.image,
                         stock: item.product.stock
                       }}
                     />
                    
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Ürün Detayı
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State for Mobile */}
        {wishlistItems.length === 0 && (
          <div className="md:hidden bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-4">
              <i className="ri-heart-line text-6xl text-gray-300"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Wishlist&apos;iniz Boş</h3>
            <p className="text-gray-600 mb-6">
              Favori ürünlerinizi kaydetmek için ürünleri keşfedin.
            </p>
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        )}

        {/* AI Önerileri */}
        {wishlistItems.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  🤖 Size Özel Öneriler
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  İstek listenizdeki ürünlere benzer figürler ve kişiselleştirilmiş öneriler
                </p>
              </div>
              <SimpleRecommendationEngine
                context="wishlist"
                limit={6}
                
                
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

