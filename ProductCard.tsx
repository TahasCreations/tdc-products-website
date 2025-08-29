'use client';

import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import { useState } from 'react';
import { useCart } from './src/contexts/CartContext';
import { useToast } from './src/components/Toast';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState<number>(1);
  const { addItem } = useCart();
  const { addToast } = useToast();

  return (
    <div className="group relative">
      <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden glow-effect">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
              {product.category}
            </span>
          </div>
          
          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex px-3 py-1 text-sm font-bold rounded-full bg-white/90 backdrop-blur-sm text-gray-900 shadow-lg">
              ₺{product.price}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {product.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              Stok: {product.stock}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                ₺{product.price}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href={`/products/${product.slug}`}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <i className="ri-eye-line mr-2"></i>
              Detaylar
            </Link>
            
            <div className="flex-1">
              <AddToCartButton product={product} />
            </div>
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 rounded-full border text-sm font-medium hover:scale-105 transition-all"
            >
              Detayları Genişlet
            </button>
          </div>
        </div>

        {/* Glow Border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      </div>

      {/* Quick View / Fast Buy Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)}></div>
          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-full">
                <img src={product.image} alt={product.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="text-xs text-gray-500">{product.category}</div>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{product.title}</h3>
                <div className="text-2xl font-extrabold mt-2">₺{product.price}</div>
                <p className="text-sm text-gray-600 mt-3 line-clamp-4">{product.description}</p>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beden</label>
                    <div className="flex gap-2">
                      {['S','M','L','XL'].map(s => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-3 py-1 rounded-full border text-sm ${selectedSize===s ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adet</label>
                    <div className="flex items-center rounded-full border px-3">
                      <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="p-2">-</button>
                      <span className="px-3">{quantity}</span>
                      <button onClick={() => setQuantity(quantity+1)} className="p-2">+</button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-105 transition"
                    onClick={() => setOpen(false)}
                  >
                    Ürün Sayfasına Git
                  </Link>
                  <button
                    onClick={() => {
                      // Sepete ekle ve modal'ı kapat
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
                        message: `${product.title} (${quantity} adet) başarıyla sepete eklendi.`,
                        duration: 3000
                      });
                      
                      setOpen(false);
                    }}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all duration-300 hover:scale-105"
                  >
                    <i className="ri-shopping-cart-line mr-2"></i>
                    Sepete Ekle ({quantity})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
