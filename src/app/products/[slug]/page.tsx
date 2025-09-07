'use client';

import Image from "next/image";
import Link from "next/link";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "../../../components/AddToCartButton";
import { notFound, useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { PageLoader } from '../../../components/LoadingSpinner';
import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

// Server-side Supabase client
const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  // URL formatını kontrol et
  if (supabaseUrl.includes('your_supabase_project_url') || 
      supabaseUrl === 'your_supabase_project_url/' ||
      supabaseUrl === 'your_supabase_project_url' ||
      !supabaseUrl.startsWith('https://')) {
    console.error('Supabase URL is not configured properly:', supabaseUrl);
    return null;
  }
  
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
};

// Default ürünler
const getDefaultProducts = () => [
  {
    id: "1",
    slug: "naruto-uzumaki-figuru",
    title: "Naruto Uzumaki Figürü",
    price: 299.99,
    category: "Anime",
    stock: 15,
    image: "",
    images: [],
    description: "Naruto anime serisinin baş karakteri olan Naruto Uzumaki'nin detaylı 3D baskı figürü. Yüksek kaliteli malzemelerle üretilmiştir.",
    status: "active",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "2",
    slug: "goku-super-saiyan-figuru",
    title: "Goku Super Saiyan Figürü",
    price: 349.99,
    category: "Anime",
    stock: 8,
    image: "",
    images: [],
    description: "Dragon Ball serisinin efsanevi karakteri Goku'nun Super Saiyan formundaki detaylı figürü. Koleksiyon değeri yüksek.",
    status: "active",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "3",
    slug: "mario-bros-figuru",
    title: "Mario Bros Figürü",
    price: 199.99,
    category: "Gaming",
    stock: 25,
    image: "",
    images: [],
    description: "Nintendo'nun efsanevi karakteri Mario'nun 3D baskı figürü. Oyun dünyasının en sevilen karakteri.",
    status: "active",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "4",
    slug: "iron-man-mark-85-figuru",
    title: "Iron Man Mark 85 Figürü",
    price: 449.99,
    category: "Film",
    stock: 5,
    image: "",
    images: [],
    description: "Marvel Cinematic Universe'den Iron Man'in Mark 85 zırhının detaylı figürü. LED aydınlatmalı.",
    status: "active",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  }
];


export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!slug) {
          setError('Ürün bulunamadı');
          setLoading(false);
          return;
        }

        // Önce API'den dene
        try {
          const response = await fetch(`/api/products?slug=${slug}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.id) {
              setProduct(data);
              setLoading(false);
              return;
            }
          }
        } catch (apiError) {
          // API hatası, default ürünlerden aranıyor
        }

        // API başarısız olursa default ürünlerden bul
        const defaultProducts = getDefaultProducts();
        const foundProduct = defaultProducts.find(p => p.slug === slug);
        
        if (foundProduct) {
          setProduct(foundProduct);
          // Benzer ürünleri de ayarla
          const similar = defaultProducts.filter(p => p.category === foundProduct.category && p.slug !== slug).slice(0, 4);
          setSimilarProducts(similar);
        } else {
          setError('Ürün bulunamadı');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Ürün yüklenirken hata:', error);
        setError('Ürün yüklenirken hata oluştu');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return <PageLoader text="Ürün detayları yükleniyor..." />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
          <p className="text-gray-600 mb-8">Aradığınız ürün mevcut değil.</p>
          <Link 
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Ürünlere Dön
          </Link>
        </div>
      </div>
    );
  }

  // Stok durumunu belirle
  const getStockStatus = (stock: number) => {
    if (stock > 10) return { 
      status: 'Stokta', 
      color: 'text-green-600', 
      bg: 'bg-green-100',
      icon: 'ri-check-line'
    };
    if (stock > 0) return { 
      status: `Son ${stock} adet`, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100',
      icon: 'ri-time-line'
    };
    return { 
      status: 'Stokta yok', 
      color: 'text-red-600', 
      bg: 'bg-red-100',
      icon: 'ri-close-line'
    };
  };

  const stockInfo = getStockStatus(product.stock);

  return (
    <>
        
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          {/* Hero Section */}
          <section className="relative py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex items-center space-x-2 text-sm text-white/80 mb-8">
                <Link href="/" className="hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
                <i className="ri-arrow-right-s-line"></i>
                <Link href="/products" className="hover:text-white transition-colors">
                  Ürünler
                </Link>
                <i className="ri-arrow-right-s-line"></i>
                <span className="text-white font-medium">{product.title}</span>
              </nav>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Product Images */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                  <ProductGallery 
                    images={Array.isArray(product.images) && product.images.length > 0 ? product.images : (product.image ? [product.image] : [])} 
                    alt={product.title} 
                  />
                </div>
                
                {/* Product Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-medal-line text-white text-xl"></i>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Premium Kalite</h4>
                    <p className="text-sm text-gray-600">Yüksek kaliteli malzemeler</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-truck-line text-white text-xl"></i>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Hızlı Teslimat</h4>
                    <p className="text-sm text-gray-600">1-3 iş günü</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-shield-check-line text-white text-xl"></i>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Güvenli Ödeme</h4>
                    <p className="text-sm text-gray-600">SSL koruması</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-customer-service-2-line text-white text-xl"></i>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">7/24 Destek</h4>
                    <p className="text-sm text-gray-600">WhatsApp & Email</p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                {/* Category and Stock Badges */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                    <i className="ri-price-tag-3-line mr-2"></i>
                    {product.category}
                  </span>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${stockInfo.bg} ${stockInfo.color} shadow-lg`}>
                    <i className={`${stockInfo.icon} mr-2`}></i>
                    {stockInfo.status}
                  </span>
                </div>

                {/* Product Title */}
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                    {product.title}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      ₺{product.price.toLocaleString('tr-TR')}
                    </div>
                    {product.stock > 0 && (
                      <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                        <i className="ri-shipping-line mr-1"></i>
                        Ücretsiz kargo
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Description */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <i className="ri-file-text-line mr-2 text-blue-600"></i>
                    Ürün Açıklaması
                  </h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Product Specifications */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <i className="ri-settings-3-line mr-2 text-purple-600"></i>
                    Ürün Özellikleri
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Kategori:</span>
                      <span className="text-gray-900 font-semibold">{product.category}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Stok Durumu:</span>
                      <span className={`font-semibold ${stockInfo.color}`}>{stockInfo.status}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Ürün Kodu:</span>
                      <span className="text-gray-900 font-semibold">{product.id}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Durum:</span>
                      <span className="text-green-600 font-semibold capitalize">{product.status}</span>
                    </div>
                  </div>
                </div>

                {/* Variations */}
                {product.variations && product.variations.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Varyasyonlar</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.variations.map((variation: string, index: number) => (
                        <button
                          key={index}
                          className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                          {variation}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="h-14">
                      <AddToCartButton 
                        product={{
                          id: product.id,
                          title: product.title,
                          price: product.price,
                          image: product.image,
                          slug: product.slug,
                          category: product.category,
                          stock: product.stock
                        }}
                      />
                    </div>
                    
                    <button className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                      <i className="ri-flashlight-line text-xl"></i>
                      Hızlı Al
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link 
                      href="/products"
                      className="w-full h-12 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <i className="ri-arrow-left-line"></i>
                      Diğer Ürünler
                    </Link>
                    
                    <Link 
                      href="/contact"
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <i className="ri-customer-service-2-line"></i>
                      Destek
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Benzer Ürünler
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Bu ürünü beğendiyseniz, aşağıdaki benzer ürünler de ilginizi çekebilir
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((similarProduct) => (
                  <div key={similarProduct.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative h-48 bg-gray-100">
                      {similarProduct.image ? (
                        <Image
                          src={similarProduct.image}
                          alt={similarProduct.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <i className="ri-image-line text-4xl text-gray-400"></i>
                        </div>
                      )}
                      
                      {/* Stock Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          similarProduct.stock > 10 
                            ? 'bg-green-100 text-green-800' 
                            : similarProduct.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {similarProduct.stock > 10 
                            ? 'Stokta' 
                            : similarProduct.stock > 0 
                            ? `Son ${similarProduct.stock}` 
                            : 'Tükendi'
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {similarProduct.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i key={star} className="ri-star-fill text-yellow-400 text-sm"></i>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">(4.8)</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-blue-600">
                          ₺{similarProduct.price.toLocaleString('tr-TR')}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          href={`/products/${similarProduct.slug}`}
                          className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                        >
                          Detaylar
                        </Link>
                        <button className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          <i className="ri-heart-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Link
                  href={`/products?category=${product.category}`}
                  className="inline-flex items-center gap-2 py-3 px-6 bg-white text-gray-700 font-medium rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <span>Bu Kategorideki Tüm Ürünleri Gör</span>
                  <i className="ri-arrow-right-line"></i>
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    );
}
