/**
 * File Storage Manager
 * Verileri dosya sisteminde saklar
 * Browser localStorage yerine gerçek dosya sistemi kullanır
 */

import fs from 'fs';
import path from 'path';

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

class FileStorageManager {
  private readonly DATA_DIR = path.join(process.cwd(), 'data');
  private readonly PRODUCTS_FILE = path.join(this.DATA_DIR, 'products.json');
  private readonly CATEGORIES_FILE = path.join(this.DATA_DIR, 'categories.json');
  private readonly ORDERS_FILE = path.join(this.DATA_DIR, 'orders.json');
  private readonly BACKUP_DIR = path.join(this.DATA_DIR, 'backups');

  constructor() {
    this.initializeStorage();
  }

  /**
   * Storage'ı başlat
   */
  private initializeStorage() {
    try {
      // Ana data klasörünü oluştur
      if (!fs.existsSync(this.DATA_DIR)) {
        fs.mkdirSync(this.DATA_DIR, { recursive: true });
        console.log(`📁 Data klasörü oluşturuldu: ${this.DATA_DIR}`);
      }

      // Backup klasörünü oluştur
      if (!fs.existsSync(this.BACKUP_DIR)) {
        fs.mkdirSync(this.BACKUP_DIR, { recursive: true });
        console.log(`💾 Backup klasörü oluşturuldu: ${this.BACKUP_DIR}`);
      }

      // Demo verileri yükle (eğer dosyalar yoksa)
      this.initializeFiles();
    } catch (error) {
      console.error('Storage initialization error:', error);
    }
  }

  /**
   * Dosyaları başlat ve demo verileri yükle
   */
  private initializeFiles() {
    // Products dosyası
    if (!fs.existsSync(this.PRODUCTS_FILE)) {
      this.saveProducts(this.getDemoProducts());
      console.log('📦 Demo ürünler yüklendi');
    }

    // Categories dosyası
    if (!fs.existsSync(this.CATEGORIES_FILE)) {
      this.saveCategories(this.getDemoCategories());
      console.log('📂 Demo kategoriler yüklendi');
    }

    // Orders dosyası
    if (!fs.existsSync(this.ORDERS_FILE)) {
      this.saveOrders([]);
      console.log('📋 Orders dosyası oluşturuldu');
    }
  }

  /**
   * Demo ürünleri
   */
  private getDemoProducts(): Product[] {
    return [
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
        created_at: new Date().toISOString(),
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
        created_at: new Date().toISOString(),
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
        created_at: new Date().toISOString(),
        isDemo: true
      }
    ];
  }

  /**
   * Demo kategorileri
   */
  private getDemoCategories(): Category[] {
    return [
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
    ];
  }

  // PRODUCT METHODS
  async getProducts(): Promise<Product[]> {
    try {
      const data = fs.readFileSync(this.PRODUCTS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Get products error:', error);
      return [];
    }
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const products = await this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      isDemo: false
    };

    products.push(newProduct);
    await this.saveProducts(products);
    
    // Backup oluştur
    await this.createBackup('products');
    
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    await this.saveProducts(products);
    
    // Backup oluştur
    await this.createBackup('products');
    
    return products[index];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) return false;

    products.splice(index, 1);
    await this.saveProducts(products);
    
    // Backup oluştur
    await this.createBackup('products');
    
    return true;
  }

  private async saveProducts(products: Product[]): Promise<void> {
    try {
      fs.writeFileSync(this.PRODUCTS_FILE, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error('Save products error:', error);
      throw error;
    }
  }

  // CATEGORY METHODS
  async getCategories(): Promise<Category[]> {
    try {
      const data = fs.readFileSync(this.CATEGORIES_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Get categories error:', error);
      return [];
    }
  }

  async addCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const categories = await this.getCategories();
    const newCategory: Category = {
      ...category,
      id: `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isDemo: false
    };

    categories.push(newCategory);
    await this.saveCategories(categories);
    
    // Backup oluştur
    await this.createBackup('categories');
    
    return newCategory;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const categories = await this.getCategories();
    const index = categories.findIndex(c => c.id === id);
    
    if (index === -1) return null;

    categories[index] = {
      ...categories[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    await this.saveCategories(categories);
    
    // Backup oluştur
    await this.createBackup('categories');
    
    return categories[index];
  }

  async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getCategories();
    
    // Alt kategorileri kontrol et
    const hasSubcategories = categories.some(c => c.parent_id === id);
    if (hasSubcategories) {
      throw new Error('Bu kategorinin alt kategorileri bulunmaktadır. Önce alt kategorileri siliniz.');
    }

    // Kategoriyi kullanan ürünleri kontrol et
    const products = await this.getProducts();
    const productsUsingCategory = products.some(p => p.category === id);
    if (productsUsingCategory) {
      throw new Error('Bu kategoriyi kullanan ürünler bulunmaktadır. Önce ürünleri başka kategoriye taşıyınız.');
    }

    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return false;

    categories.splice(index, 1);
    await this.saveCategories(categories);
    
    // Backup oluştur
    await this.createBackup('categories');
    
    return true;
  }

  private async saveCategories(categories: Category[]): Promise<void> {
    try {
      fs.writeFileSync(this.CATEGORIES_FILE, JSON.stringify(categories, null, 2));
    } catch (error) {
      console.error('Save categories error:', error);
      throw error;
    }
  }

  // ORDER METHODS
  async getOrders(): Promise<Order[]> {
    try {
      const data = fs.readFileSync(this.ORDERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Get orders error:', error);
      return [];
    }
  }

  async addOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const orders = await this.getOrders();
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      isDemo: false
    };

    orders.push(newOrder);
    await this.saveOrders(orders);
    
    // Backup oluştur
    await this.createBackup('orders');
    
    return newOrder;
  }

  private async saveOrders(orders: Order[]): Promise<void> {
    try {
      fs.writeFileSync(this.ORDERS_FILE, JSON.stringify(orders, null, 2));
    } catch (error) {
      console.error('Save orders error:', error);
      throw error;
    }
  }

  // STATS METHODS
  async getStats() {
    const products = await this.getProducts();
    const orders = await this.getOrders();

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
      monthlyGrowth: 15.2,
      topSellingCategory
    };
  }

  // BACKUP METHODS
  async createBackup(type: 'products' | 'categories' | 'orders' | 'all'): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      if (type === 'all' || type === 'products') {
        const products = await this.getProducts();
        const backupFile = path.join(this.BACKUP_DIR, `products-${timestamp}.json`);
        fs.writeFileSync(backupFile, JSON.stringify(products, null, 2));
      }
      
      if (type === 'all' || type === 'categories') {
        const categories = await this.getCategories();
        const backupFile = path.join(this.BACKUP_DIR, `categories-${timestamp}.json`);
        fs.writeFileSync(backupFile, JSON.stringify(categories, null, 2));
      }
      
      if (type === 'all' || type === 'orders') {
        const orders = await this.getOrders();
        const backupFile = path.join(this.BACKUP_DIR, `orders-${timestamp}.json`);
        fs.writeFileSync(backupFile, JSON.stringify(orders, null, 2));
      }
      
      console.log(`💾 Backup oluşturuldu: ${type} - ${timestamp}`);
    } catch (error) {
      console.error('Backup error:', error);
    }
  }

  async getBackups(): Promise<string[]> {
    try {
      const files = fs.readdirSync(this.BACKUP_DIR);
      return files.filter(file => file.endsWith('.json'));
    } catch (error) {
      console.error('Get backups error:', error);
      return [];
    }
  }

  // UTILITY METHODS
  async clearAllData(): Promise<void> {
    await this.saveProducts([]);
    await this.saveCategories([]);
    await this.saveOrders([]);
    console.log('🗑️ Tüm veriler temizlendi');
  }

  async clearDemoData(): Promise<void> {
    const products = await this.getProducts();
    const categories = await this.getCategories();
    const orders = await this.getOrders();

    await this.saveProducts(products.filter(p => !p.isDemo));
    await this.saveCategories(categories.filter(c => !c.isDemo));
    await this.saveOrders(orders.filter(o => !o.isDemo));
    
    console.log('🧹 Demo veriler temizlendi');
  }

  async exportData(): Promise<string> {
    const products = await this.getProducts();
    const categories = await this.getCategories();
    const orders = await this.getOrders();

    const data = {
      products,
      categories,
      orders,
      exportedAt: new Date().toISOString()
    };

    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.products) await this.saveProducts(data.products);
      if (data.categories) await this.saveCategories(data.categories);
      if (data.orders) await this.saveOrders(data.orders);
      
      console.log('📥 Veriler başarıyla içe aktarıldı');
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }

  getDataDirectory(): string {
    return this.DATA_DIR;
  }

  getBackupDirectory(): string {
    return this.BACKUP_DIR;
  }
}

// Singleton instance
export const fileStorageManager = new FileStorageManager();

// Type exports
export type { Product, Category, Order, EcommerceData };
