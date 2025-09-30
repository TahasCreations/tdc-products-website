// TDC Market Seed Data
export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
  isTrending: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
  products: Product[];
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  category: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount: number;
  expiresAt: string;
  isActive: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
}

export interface SeedData {
  categories: Category[];
  collections: Collection[];
  stores: Store[];
  coupons: Coupon[];
  blogPosts: BlogPost[];
}

export const seedData: SeedData = {
  categories: [
    {
      id: "1",
      name: "3D Figürler",
      slug: "3d-figurler",
      image: "/images/categories/3d-figures.jpg",
      description: "En popüler karakter figürleri",
      productCount: 1247,
      isTrending: true
    },
    {
      id: "2", 
      name: "Masaüstü Aksesuarları",
      slug: "masaustu-aksesuarlari",
      image: "/images/categories/desktop-accessories.jpg",
      description: "Ofis ve ev için dekoratif objeler",
      productCount: 892,
      isTrending: false
    },
    {
      id: "3",
      name: "Hediye Ürünleri",
      slug: "hediye-urunleri", 
      image: "/images/categories/gift-items.jpg",
      description: "Özel günler için anlamlı hediyeler",
      productCount: 654,
      isTrending: true
    },
    {
      id: "4",
      name: "Koleksiyon Parçaları",
      slug: "koleksiyon-parcalari",
      image: "/images/categories/collectibles.jpg", 
      description: "Sınırlı sayıda üretilen özel parçalar",
      productCount: 423,
      isTrending: false
    },
    {
      id: "5",
      name: "Eğitici Oyuncaklar",
      slug: "egitici-oyuncaklar",
      image: "/images/categories/educational-toys.jpg",
      description: "Çocuklar için öğretici 3D oyuncaklar",
      productCount: 312,
      isTrending: true
    },
    {
      id: "6",
      name: "Dekoratif Objeler",
      slug: "dekoratif-objeler",
      image: "/images/categories/decorative-objects.jpg",
      description: "Ev dekorasyonu için şık objeler",
      productCount: 789,
      isTrending: false
    }
  ],
  collections: [
    {
      id: "1",
      title: "Haftanın Trendleri",
      description: "En çok satan ve popüler ürünler",
      image: "/images/collections/trending.jpg",
      products: [
        {
          id: "1",
          name: "Anime Karakter Figürü",
          price: 89.99,
          image: "/images/products/anime-figure.jpg",
          rating: 4.8,
          reviewCount: 124
        },
        {
          id: "2", 
          name: "Masa Lambası",
          price: 45.50,
          image: "/images/products/desk-lamp.jpg",
          rating: 4.6,
          reviewCount: 89
        },
        {
          id: "3",
          name: "Kedi Figürü",
          price: 32.99,
          image: "/images/products/cat-figure.jpg", 
          rating: 4.9,
          reviewCount: 156
        },
        {
          id: "4",
          name: "Bitki Saksısı",
          price: 28.75,
          image: "/images/products/plant-pot.jpg",
          rating: 4.7,
          reviewCount: 67
        }
      ]
    },
    {
      id: "2",
      title: "Yerel Tasarımcılar",
      description: "Türk tasarımcıların özel koleksiyonları",
      image: "/images/collections/local-designers.jpg",
      products: [
        {
          id: "5",
          name: "İstanbul Silüeti",
          price: 125.00,
          image: "/images/products/istanbul-silhouette.jpg",
          rating: 4.9,
          reviewCount: 45
        },
        {
          id: "6",
          name: "Geleneksel Motif Vazo",
          price: 78.50,
          image: "/images/products/traditional-vase.jpg",
          rating: 4.8,
          reviewCount: 32
        }
      ]
    },
    {
      id: "3", 
      title: "Limited Figürler",
      description: "Sınırlı sayıda üretilen özel figürler",
      image: "/images/collections/limited-figures.jpg",
      products: [
        {
          id: "7",
          name: "Altın Kaplama Ejder",
          price: 299.99,
          image: "/images/products/golden-dragon.jpg",
          rating: 5.0,
          reviewCount: 12
        },
        {
          id: "8",
          name: "Kristal Kale",
          price: 189.00,
          image: "/images/products/crystal-castle.jpg",
          rating: 4.9,
          reviewCount: 8
        }
      ]
    },
    {
      id: "4",
      title: "Hediye Rehberi", 
      description: "Herkes için mükemmel hediye önerileri",
      image: "/images/collections/gift-guide.jpg",
      products: [
        {
          id: "9",
          name: "Kişiselleştirilmiş Figür",
          price: 149.99,
          image: "/images/products/personalized-figure.jpg",
          rating: 4.8,
          reviewCount: 67
        },
        {
          id: "10",
          name: "Hediye Kutusu Seti",
          price: 65.00,
          image: "/images/products/gift-box-set.jpg",
          rating: 4.7,
          reviewCount: 23
        }
      ]
    }
  ],
  stores: [
    {
      id: "1",
      name: "ArtisanCraft Studio",
      slug: "artisancraft-studio",
      description: "El yapımı 3D figürler ve dekoratif objeler",
      logo: "/images/stores/artisan-craft.jpg",
      rating: 4.9,
      reviewCount: 1247,
      productCount: 89,
      isVerified: true,
      isFeatured: true,
      category: "Sanat & El Sanatları"
    },
    {
      id: "2",
      name: "TechGadgets 3D",
      slug: "techgadgets-3d", 
      description: "Teknoloji temalı 3D figürler ve aksesuarlar",
      logo: "/images/stores/tech-gadgets.jpg",
      rating: 4.7,
      reviewCount: 892,
      productCount: 156,
      isVerified: true,
      isFeatured: true,
      category: "Teknoloji"
    },
    {
      id: "3",
      name: "NatureCraft",
      slug: "naturecraft",
      description: "Doğa temalı dekoratif objeler ve bitki saksıları",
      logo: "/images/stores/nature-craft.jpg", 
      rating: 4.8,
      reviewCount: 654,
      productCount: 73,
      isVerified: true,
      isFeatured: false,
      category: "Doğa & Çevre"
    }
  ],
  coupons: [
    {
      id: "1",
      code: "TDCSEZON",
      description: "Tüm ürünlerde %20 indirim",
      discount: 20,
      type: "percentage" as const,
      minAmount: 100,
      expiresAt: "2024-12-31T23:59:59Z",
      isActive: true
    },
    {
      id: "2", 
      code: "YENI10",
      description: "İlk siparişinizde %10 indirim",
      discount: 10,
      type: "percentage" as const, 
      minAmount: 50,
      expiresAt: "2024-12-31T23:59:59Z",
      isActive: true
    }
  ],
  blogPosts: [
    {
      id: "1",
      title: "3D Yazıcı Teknolojisi ile Figür Üretimi",
      excerpt: "Modern 3D yazıcı teknolojileri ile nasıl detaylı ve kaliteli figürler üretildiğini keşfedin.",
      image: "/images/blog/3d-printing.jpg",
      author: "TDC Teknik Ekibi",
      publishedAt: "2024-01-15T10:00:00Z",
      readTime: "5 dk",
      category: "Teknoloji"
    },
    {
      id: "2",
      title: "Ev Dekorasyonunda 3D Figürlerin Yeri",
      excerpt: "Ev dekorasyonunuzu kişiselleştirmek için 3D figürlerin nasıl kullanılabileceğini öğrenin.",
      image: "/images/blog/home-decoration.jpg", 
      author: "İç Mimari Uzmanı",
      publishedAt: "2024-01-10T14:30:00Z",
      readTime: "7 dk",
      category: "Dekorasyon"
    },
    {
      id: "3",
      title: "Hediye Seçiminde 3D Figürler",
      excerpt: "Sevdikleriniz için anlamlı ve özel hediyeler seçerken 3D figürlerin avantajları.",
      image: "/images/blog/gift-selection.jpg",
      author: "Hediye Uzmanı",
      publishedAt: "2024-01-05T09:15:00Z", 
      readTime: "4 dk",
      category: "Hediye"
    }
  ]
};
