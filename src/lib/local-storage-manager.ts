/**
 * Local Storage Manager
 * Tüm e-ticaret verilerini local storage'da saklar
 * Supabase bağımlılığını azaltır
 */

interface Product {
  id: string;
  name: string;
  title: string;
  price: number;
  category: string;
  subcategory?: string;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  image: string;
  images?: string[];
  description?: string;
  slug?: string;
  sales?: number;
  rating?: number;
  createdAt: string;
  created_at?: string;
  updated_at?: string;
  isDemo?: boolean;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  color?: string;
  icon?: string;
  parent_id?: string | null;
  level?: number;
  created_at: string;
  updated_at: string;
  isDemo?: boolean;
}

interface Order {
  id: string;
  order_number?: string;
  customer: string;
  customer_name?: string;
  customer_email?: string;
  total: number;
  total_amount?: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status?: string;
  items: number;
  createdAt: string;
  created_at?: string;
  paymentMethod: string;
  payment_method?: string;
  isDemo?: boolean;
}

interface EcommerceData {
  products: Product[];
  categories: Category[];
  orders: Order[];
  lastUpdated: string;
}

class LocalStorageManager {
  private readonly STORAGE_KEY = 'tdc_ecommerce_data';
  private readonly DEMO_FLAG = 'DEMO_MODE';

  constructor() {
    // Server-side'da localStorage yok, sadece client-side'da başlat
    if (typeof window !== 'undefined') {
      this.initializeStorage();
    }
  }

  /**
   * Storage'ı başlat ve demo verilerini yükle
   */
  private initializeStorage() {
    if (typeof window === 'undefined') return;
    
    const existingData = localStorage.getItem(this.STORAGE_KEY);
    
    if (!existingData) {
      this.loadDemoData();
    }
  }

  /**
   * Demo verilerini yükle
   */
  private loadDemoData() {
    const demoData: EcommerceData = {
      products: [
        {
          id: 'demo-1',
          name: 'iPhone 15 Pro',
          title: 'iPhone 15 Pro',
          price: 45999,
          category: 'demo-elektronik',
          stock: 25,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
          description: 'En yeni iPhone modeli',
          slug: 'iphone-15-pro',
          sales: 15,
          rating: 4.8,
          createdAt: new Date().toISOString(),
          isDemo: true
        },
        {
          id: 'demo-2',
          name: 'Samsung Galaxy S24',
          title: 'Samsung Galaxy S24',
          price: 35999,
          category: 'demo-elektronik',
          stock: 30,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
          description: 'Samsung\'un en yeni modeli',
          slug: 'samsung-galaxy-s24',
          sales: 22,
          rating: 4.6,
          createdAt: new Date().toISOString(),
          isDemo: true
        },
        {
          id: 'demo-3',
          name: 'MacBook Pro M3',
          title: 'MacBook Pro M3',
          price: 89999,
          category: 'demo-bilgisayar',
          stock: 12,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
          description: 'Apple\'ın en güçlü dizüstü bilgisayarı',
          slug: 'macbook-pro-m3',
          sales: 8,
          rating: 4.9,
          createdAt: new Date().toISOString(),
          isDemo: true
        }
      ],
      categories: [
        {
          id: 'demo-elektronik',
          name: 'Elektronik',
          description: 'Elektronik ürünler',
          emoji: '📱',
          color: '#3b82f6',
          icon: 'ri-smartphone-line',
          parent_id: null,
          level: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          isDemo: true
        },
        {
          id: 'demo-bilgisayar',
          name: 'Bilgisayar',
          description: 'Bilgisayar ve aksesuarları',
          emoji: '💻',
          color: '#10b981',
          icon: 'ri-computer-line',
          parent_id: null,
          level: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          isDemo: true
        },
        {
          id: 'demo-telefon',
          name: 'Telefon',
          description: 'Telefon alt kategorisi',
          emoji: '📞',
          color: '#8b5cf6',
          icon: 'ri-phone-line',
          parent_id: 'demo-elektronik',
          level: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          isDemo: true
        }
      ],
      orders: [
        {
          id: 'order-1',
          order_number: 'ORD-2024-001',
          customer: 'Ahmet Yılmaz',
          customer_name: 'Ahmet Yılmaz',
          customer_email: 'ahmet@example.com',
          total: 45999,
          total_amount: 45999,
          status: 'delivered',
          payment_status: 'paid',
          items: 1,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: 'credit_card',
          payment_method: 'credit_card',
          isDemo: true
        },
        {
          id: 'order-2',
          order_number: 'ORD-2024-002',
          customer: 'Fatma Demir',
          customer_name: 'Fatma Demir',
          customer_email: 'fatma@example.com',
          total: 71998,
          total_amount: 71998,
          status: 'processing',
          payment_status: 'paid',
          items: 2,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: 'bank_transfer',
          payment_method: 'bank_transfer',
          isDemo: true
        }
      ],
      lastUpdated: new Date().toISOString()
    };

    this.saveData(demoData);
  }

  /**
   * Veriyi kaydet
   */
  private saveData(data: EcommerceData) {
    if (typeof window === 'undefined') return;
    
    const dataToSave = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
  }

  /**
   * Veriyi yükle
   */
  private loadData(): EcommerceData {
    if (typeof window === 'undefined') {
      // Server-side'da demo data döndür
      return this.getDemoData();
    }
    
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      this.loadDemoData();
      return this.loadData();
    }
    return JSON.parse(data);
  }

  /**
   * Demo verilerini döndür (server-side için)
   */
  private getDemoData(): EcommerceData {
    return {
      products: [
        {
          id: 'demo-1',
          name: 'iPhone 15 Pro',
          title: 'iPhone 15 Pro',
          price: 45999,
          category: 'demo-elektronik',
          stock: 25,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
          description: 'En yeni iPhone modeli',
          slug: 'iphone-15-pro',
          sales: 15,
          rating: 4.8,
          createdAt: new Date().toISOString(),
          isDemo: true
        }
      ],
      categories: [
        {
          id: 'demo-elektronik',
          name: 'Elektronik',
          description: 'Elektronik ürünler',
          emoji: '📱',
          color: '#3b82f6',
          icon: 'ri-smartphone-line',
          parent_id: null,
          level: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          isDemo: true
        }
      ],
      orders: [],
      lastUpdated: new Date().toISOString()
    };
  }

  // PRODUCT METHODS
  async getProducts(): Promise<Product[]> {
    const data = this.loadData();
    return data.products || [];
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const data = this.loadData();
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      isDemo: false
    };

    data.products.push(newProduct);
    this.saveData(data);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const data = this.loadData();
    const index = data.products.findIndex(p => p.id === id);
    
    if (index === -1) return null;

    data.products[index] = {
      ...data.products[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.saveData(data);
    return data.products[index];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const data = this.loadData();
    const index = data.products.findIndex(p => p.id === id);
    
    if (index === -1) return false;

    data.products.splice(index, 1);
    this.saveData(data);
    return true;
  }

  // CATEGORY METHODS
  async getCategories(): Promise<Category[]> {
    const data = this.loadData();
    return data.categories || [];
  }

  async addCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const data = this.loadData();
    const newCategory: Category = {
      ...category,
      id: `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isDemo: false
    };

    data.categories.push(newCategory);
    this.saveData(data);
    return newCategory;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const data = this.loadData();
    const index = data.categories.findIndex(c => c.id === id);
    
    if (index === -1) return null;

    data.categories[index] = {
      ...data.categories[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.saveData(data);
    return data.categories[index];
  }

  async deleteCategory(id: string): Promise<boolean> {
    const data = this.loadData();
    
    // Alt kategorileri kontrol et
    const hasSubcategories = data.categories.some(c => c.parent_id === id);
    if (hasSubcategories) {
      throw new Error('Bu kategorinin alt kategorileri bulunmaktadır. Önce alt kategorileri siliniz.');
    }

    // Kategoriyi kullanan ürünleri kontrol et
    const productsUsingCategory = data.products.some(p => p.category === id);
    if (productsUsingCategory) {
      throw new Error('Bu kategoriyi kullanan ürünler bulunmaktadır. Önce ürünleri başka kategoriye taşıyınız.');
    }

    const index = data.categories.findIndex(c => c.id === id);
    if (index === -1) return false;

    data.categories.splice(index, 1);
    this.saveData(data);
    return true;
  }

  // ORDER METHODS
  async getOrders(): Promise<Order[]> {
    const data = this.loadData();
    return data.orders || [];
  }

  async addOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const data = this.loadData();
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      isDemo: false
    };

    data.orders.push(newOrder);
    this.saveData(data);
    return newOrder;
  }

  // STATS METHODS
  async getStats() {
    const data = this.loadData();
    const products = data.products || [];
    const orders = data.orders || [];

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalCustomers = new Set(orders.map(o => o.customer)).size;

    const conversionRate = totalOrders > 0 ? (totalOrders / totalProducts) * 100 : 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // En çok satan kategori
    const categorySales = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + (product.sales || 0);
      return acc;
    }, {} as Record<string, number>);

    const topSellingCategory = Object.keys(categorySales).reduce((a, b) => 
      categorySales[a] > categorySales[b] ? a : b, 
      'Henüz kategori yok'
    );

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      conversionRate,
      averageOrderValue,
      monthlyGrowth: 15.2, // Mock data
      topSellingCategory
    };
  }

  // UTILITY METHODS
  async clearAllData(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
    this.loadDemoData();
  }

  async clearDemoData(): Promise<void> {
    const data = this.loadData();
    data.products = data.products.filter(p => !p.isDemo);
    data.categories = data.categories.filter(c => !c.isDemo);
    data.orders = data.orders.filter(o => !o.isDemo);
    this.saveData(data);
  }

  async exportData(): Promise<string> {
    const data = this.loadData();
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      this.saveData(data);
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }

  getLastUpdated(): string {
    const data = this.loadData();
    return data.lastUpdated;
  }
}

// Singleton instance
export const localStorageManager = new LocalStorageManager();

// Type exports
export type { Product, Category, Order, EcommerceData };
