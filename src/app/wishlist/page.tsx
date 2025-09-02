'use client';

import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { PageLoader } from '../../components/LoadingSpinner';
import WishlistButton from '../../components/WishlistButton';
import AddToCartButton from '../../../AddToCartButton';
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
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: tr });
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <i className="ri-heart-line text-8xl text-gray-300"></i>
          </div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">Wishlist&apos;e Erişim</h1>
          <p className="text-lg text-gray-600 mb-8">
            Wishlist&apos;inizi görüntülemek için giriş yapmanız gerekiyor.
          </p>
          <Link
            href="/auth"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <PageLoader text="Wishlist yükleniyor..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Wishlist</h1>
              <p className="text-gray-600 mt-2">
                Favori ürünlerinizi kaydedin ve daha sonra kolayca erişin
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {wishlistItems.length} ürün
              </span>
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
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="mb-6">
              <i className="ri-heart-line text-8xl text-gray-300"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Wishlist&apos;iniz Boş</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Henüz favori ürününüz yok. Ürünleri keşfedin ve beğendiğiniz ürünleri 
              wishlist&apos;inize ekleyin.
            </p>
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.product.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      ₺{item.product.price.toLocaleString('tr-TR')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.product.stock > 10 
                        ? 'bg-green-100 text-green-800' 
                        : item.product.stock > 0 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.product.stock > 10 
                        ? 'Stokta' 
                        : item.product.stock > 0 
                        ? `Son ${item.product.stock} adet`
                        : 'Stokta yok'
                      }
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
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
      </div>
    </div>
  );
}

