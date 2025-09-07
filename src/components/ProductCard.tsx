'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from './Toast';
import WishlistButton from './WishlistButton';
import ImageSkeleton from './ImageSkeleton';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  variations?: string[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { addItem } = useCart();
  const { addToast } = useToast();

  // Varyasyon yoksa varsayılan olarak boş string
  const hasVariations = product.variations && product.variations.length > 0;

  // Görsel URL'ini kontrol et - gerçek görsel varsa onu kullan
  const imageUrl = product.image && product.image.trim() !== '' ? product.image : null;

  return (
    <div className="group relative">
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-transparent">
        {/* Premium Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-3xl blur-xl scale-110 group-hover:scale-100"></div>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {/* Product Image */}
        <div className="relative overflow-hidden">
          {imageLoading && imageUrl && (
            <ImageSkeleton variant="card" className="absolute inset-0 z-10" />
          )}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              width={400}
              height={256}
              className={`w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 ease-out ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              quality={85}
              priority={false}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={(e) => {
                setImageError(true);
                setImageLoading(false);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
              onLoad={() => {
                setImageLoading(false);
              }}
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center">
                <i className="ri-image-line text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-500 text-sm">Görsel yok</p>
              </div>
            </div>
          )}
          
          {/* Elegant Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg backdrop-blur-sm">
              {product.category}
            </span>
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-4 right-4 z-20">
            <WishlistButton
              productId={product.id}
              productTitle={product.title}
              size="sm"
              variant="icon"
            />
          </div>
          
          {/* Price Badge */}
          <div className="absolute bottom-4 right-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            <span className="inline-flex px-3 py-1 text-sm font-bold rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-900 dark:text-white shadow-lg">
              ₺{product.price}
            </span>
          </div>

          {/* Stock Status */}
          <div className="absolute bottom-4 left-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              product.stock > 10 ? 'bg-green-500/90 text-white' : 
              product.stock > 0 ? 'bg-yellow-500/90 text-white' : 'bg-red-500/90 text-white'
            } backdrop-blur-sm`}>
              {product.stock > 10 ? 'Stokta' : product.stock > 0 ? 'Son ' + product.stock : 'Tükendi'}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 relative z-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {product.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Stok: {product.stock}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ₺{product.price}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-purple-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl transform h-12"
            >
              <i className="ri-eye-line mr-2"></i>
              Detaylar
            </Link>
            
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl transform h-12"
            >
              <i className="ri-flashlight-line mr-2"></i>
              Hızlı Al
            </button>
          </div>
        </div>

        {/* Premium Border Effect */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10"></div>
      </div>

      {/* Quick View / Fast Buy Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)}></div>
          <div className="relative w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:scale-110"
            >
              <i className="ri-close-line text-xl text-gray-600 dark:text-gray-300"></i>
            </button>

            <div className="grid lg:grid-cols-2">
              {/* Product Images Section */}
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <div className="relative h-96 lg:h-full">
                  {imageUrl ? (
                    <Image 
                      src={imageUrl} 
                      alt={product.title} 
                      width={800}
                      height={600}
                      className="absolute inset-0 w-full h-full object-cover"
                      quality={80}
                      priority={true}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={() => {
                        setImageError(true);
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <i className="ri-image-line text-4xl text-gray-400 mb-2"></i>
                        <p className="text-gray-500 text-sm">Görsel yok</p>
                      </div>
                    </div>
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                      {product.category}
                    </span>
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-6 right-6">
                    <span className="inline-flex px-4 py-2 text-lg font-bold rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-900 dark:text-white shadow-lg">
                      ₺{product.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="p-8 lg:p-10">
                {/* Product Title */}
                <div className="mb-6">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.title}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      ₺{product.price}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Stok: {product.stock} adet
                    </span>
                  </div>
                </div>

                {/* Product Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Ürün Açıklaması
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Product Features */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Özellikler
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-emerald-500 text-lg"></i>
                      <span className="text-gray-600 dark:text-gray-300">Yüksek Kalite</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-emerald-500 text-lg"></i>
                      <span className="text-gray-600 dark:text-gray-300">3D Baskı</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-emerald-500 text-lg"></i>
                      <span className="text-gray-600 dark:text-gray-300">Detaylı Tasarım</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line text-emerald-500 text-lg"></i>
                      <span className="text-gray-600 dark:text-gray-300">Koleksiyon</span>
                    </div>
                  </div>
                </div>

                {/* Size and Quantity Selection */}
                <div className="mb-8 space-y-6">
                  {/* Variation Selection */}
                  {hasVariations && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Varyasyon Seçimi
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.variations!.map(variation => (
                          <button
                            key={variation}
                            onClick={() => setSelectedVariation(variation)}
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300 ${
                              selectedVariation === variation 
                                ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg' 
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-600'
                            }`}
                          >
                            {variation}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Adet
                    </label>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 max-w-xs">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        className="w-10 h-10 rounded-md bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <i className="ri-subtract-line text-gray-600 dark:text-gray-300"></i>
                      </button>
                      <span className="flex-1 text-center text-lg font-semibold text-gray-900 dark:text-white px-4">
                        {quantity}
                      </span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)} 
                        className="w-10 h-10 rounded-md bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <i className="ri-add-line text-gray-600 dark:text-gray-300"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  {/* Add to Cart Button */}
                  <button
                    onClick={() => {
                      addItem({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.image,
                        slug: product.slug
                      }, quantity);
                      
                      addToast({
                        type: 'success',
                        title: 'Ürün sepete eklendi!',
                        message: `${product.title} (${quantity} adet${selectedVariation ? `, ${selectedVariation}` : ''}) başarıyla sepete eklendi.`,
                        duration: 3000
                      });
                      
                      setOpen(false);
                    }}
                    className="w-full inline-flex items-center justify-center px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <i className="ri-shopping-cart-line mr-3 text-xl"></i>
                    Sepete Ekle ({quantity} adet)
                  </button>

                  {/* View Full Details Button */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-lg font-semibold hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
                    onClick={() => setOpen(false)}
                  >
                    <i className="ri-eye-line mr-3"></i>
                    Tüm Detayları Görüntüle
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
