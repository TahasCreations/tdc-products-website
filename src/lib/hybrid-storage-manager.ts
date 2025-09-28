/**
 * Hybrid Storage Manager
 * Hem Vercel (Supabase) hem Local (File) storage'ı destekler
 * Otomatik senkronizasyon ve failover mekanizması
 */

import { fileStorageManager } from './file-storage-manager';
import { createClient } from '@supabase/supabase-js';

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
  isLocal?: boolean; // Local'de mi yaratıldı
  isCloud?: boolean; // Cloud'da mı yaratıldı
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
  isLocal?: boolean;
  isCloud?: boolean;
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
  isLocal?: boolean;
  isCloud?: boolean;
}

interface SyncStatus {
  lastSync: string;
  localCount: number;
  cloudCount: number;
  pendingSync: number;
  syncErrors: string[];
}

class HybridStorageManager {
  private supabase: any = null;
  private readonly SYNC_KEY = 'hybrid_sync_status';
  private syncStatus: SyncStatus = {
    lastSync: '',
    localCount: 0,
    cloudCount: 0,
    pendingSync: 0,
    syncErrors: []
  };

  constructor() {
    this.initializeSupabase();
    this.loadSyncStatus();
  }

  private initializeSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Check if environment variables are available and valid
    const isValidUrl = (url: string) => {
      try {
        new URL(url);
        return !url.includes('your_') && !url.includes('example');
      } catch {
        return false;
      }
    };

    if (supabaseUrl && supabaseKey && isValidUrl(supabaseUrl)) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
      console.log('🌐 Supabase connected for hybrid mode');
    } else {
      console.log('📁 Running in local-only mode (no Supabase)');
    }
  }

  private loadSyncStatus() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.SYNC_KEY);
      if (stored) {
        this.syncStatus = { ...this.syncStatus, ...JSON.parse(stored) };
      }
    }
  }

  private saveSyncStatus() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.SYNC_KEY, JSON.stringify(this.syncStatus));
    }
  }

  // PRODUCT METHODS
  async getProducts(): Promise<Product[]> {
    try {
      // Önce local'den al
      const localProducts = await fileStorageManager.getProducts();
      
      // Eğer Supabase varsa, cloud'dan da al ve merge et
      if (this.supabase) {
        const { data: cloudProducts, error } = await this.supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && cloudProducts) {
          // Merge logic: Local ve cloud verilerini birleştir
          const mergedProducts = this.mergeProducts(localProducts, cloudProducts);
          return mergedProducts;
        }
      }

      return localProducts;
    } catch (error) {
      console.error('Get products error:', error);
      // Fallback: sadece local
      return await fileStorageManager.getProducts();
    }
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'isLocal' | 'isCloud'>): Promise<Product> {
    const newProduct = await fileStorageManager.addProduct(product) as Product;
    newProduct.isLocal = true;

    // Cloud'a da gönder (eğer varsa)
    if (this.supabase) {
      try {
        await this.syncToCloud('products', newProduct, 'add');
      } catch (error) {
        console.error('Cloud sync error:', error);
        this.syncStatus.syncErrors.push(`Product add sync failed: ${error}`);
      }
    }

    this.updateSyncStatus();
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const updatedProduct = await fileStorageManager.updateProduct(id, updates) as Product;
    if (updatedProduct) {
      updatedProduct.isLocal = true;
    }

    if (updatedProduct && this.supabase) {
      try {
        await this.syncToCloud('products', updatedProduct, 'update');
      } catch (error) {
        console.error('Cloud sync error:', error);
        this.syncStatus.syncErrors.push(`Product update sync failed: ${error}`);
      }
    }

    this.updateSyncStatus();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const deleted = await fileStorageManager.deleteProduct(id);

    if (deleted && this.supabase) {
      try {
        await this.syncToCloud('products', { id }, 'delete');
      } catch (error) {
        console.error('Cloud sync error:', error);
        this.syncStatus.syncErrors.push(`Product delete sync failed: ${error}`);
      }
    }

    this.updateSyncStatus();
    return deleted;
  }

  // CATEGORY METHODS
  async getCategories(): Promise<Category[]> {
    try {
      const localCategories = await fileStorageManager.getCategories();
      
      if (this.supabase) {
        const { data: cloudCategories, error } = await this.supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && cloudCategories) {
          const mergedCategories = this.mergeCategories(localCategories, cloudCategories);
          return mergedCategories;
        }
      }

      return localCategories;
    } catch (error) {
      console.error('Get categories error:', error);
      return await fileStorageManager.getCategories();
    }
  }

  async addCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'isLocal' | 'isCloud'>): Promise<Category> {
    const newCategory = await fileStorageManager.addCategory(category) as Category;
    newCategory.isLocal = true;

    if (this.supabase) {
      try {
        await this.syncToCloud('categories', newCategory, 'add');
      } catch (error) {
        console.error('Cloud sync error:', error);
        this.syncStatus.syncErrors.push(`Category add sync failed: ${error}`);
      }
    }

    this.updateSyncStatus();
    return newCategory;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const updatedCategory = await fileStorageManager.updateCategory(id, updates) as Category;
    if (updatedCategory) {
      updatedCategory.isLocal = true;
    }

    if (updatedCategory && this.supabase) {
      try {
        await this.syncToCloud('categories', updatedCategory, 'update');
      } catch (error) {
        console.error('Cloud sync error:', error);
        this.syncStatus.syncErrors.push(`Category update sync failed: ${error}`);
      }
    }

    this.updateSyncStatus();
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const deleted = await fileStorageManager.deleteCategory(id);

    if (deleted && this.supabase) {
      try {
        await this.syncToCloud('categories', { id }, 'delete');
      } catch (error) {
        console.error('Cloud sync error:', error);
        this.syncStatus.syncErrors.push(`Category delete sync failed: ${error}`);
      }
    }

    this.updateSyncStatus();
    return deleted;
  }

  // ORDER METHODS
  async getOrders(): Promise<Order[]> {
    try {
      const localOrders = await fileStorageManager.getOrders();
      
      if (this.supabase) {
        const { data: cloudOrders, error } = await this.supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && cloudOrders) {
          const mergedOrders = this.mergeOrders(localOrders, cloudOrders);
          return mergedOrders;
        }
      }

      return localOrders;
    } catch (error) {
      console.error('Get orders error:', error);
      return await fileStorageManager.getOrders();
    }
  }

  async addOrder(order: Omit<Order, 'id' | 'createdAt' | 'isLocal' | 'isCloud'>): Promise<Order> {
    const newOrder = await fileStorageManager.addOrder(order) as Order;
    newOrder.isLocal = true;

    if (this.supabase) {
      try {
        await this.syncToCloud('orders', newOrder, 'add');
      } catch (error) {
        console.error('Cloud sync error:', error);
        this.syncStatus.syncErrors.push(`Order add sync failed: ${error}`);
      }
    }

    this.updateSyncStatus();
    return newOrder;
  }

  // SYNC METHODS
  private async syncToCloud(table: string, data: any, operation: 'add' | 'update' | 'delete') {
    if (!this.supabase) return;

    switch (operation) {
      case 'add':
        await this.supabase.from(table).insert([data]);
        break;
      case 'update':
        await this.supabase.from(table).update(data).eq('id', data.id);
        break;
      case 'delete':
        await this.supabase.from(table).delete().eq('id', data.id);
        break;
    }
  }

  private mergeProducts(local: Product[], cloud: Product[]): Product[] {
    const merged = [...local];
    const localIds = new Set(local.map(p => p.id));

    // Cloud'dan local'de olmayan ürünleri ekle
    cloud.forEach(cloudProduct => {
      if (!localIds.has(cloudProduct.id)) {
        merged.push({ ...cloudProduct, isCloud: true });
      }
    });

    return merged;
  }

  private mergeCategories(local: Category[], cloud: Category[]): Category[] {
    const merged = [...local];
    const localIds = new Set(local.map(c => c.id));

    cloud.forEach(cloudCategory => {
      if (!localIds.has(cloudCategory.id)) {
        merged.push({ ...cloudCategory, isCloud: true });
      }
    });

    return merged;
  }

  private mergeOrders(local: Order[], cloud: Order[]): Order[] {
    const merged = [...local];
    const localIds = new Set(local.map(o => o.id));

    cloud.forEach(cloudOrder => {
      if (!localIds.has(cloudOrder.id)) {
        merged.push({ ...cloudOrder, isCloud: true });
      }
    });

    return merged;
  }

  private updateSyncStatus() {
    this.syncStatus.lastSync = new Date().toISOString();
    this.syncStatus.localCount++;
    this.saveSyncStatus();
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
      topSellingCategory,
      syncStatus: this.syncStatus,
      isHybrid: !!this.supabase
    };
  }

  // SYNC MANAGEMENT
  async forceSync(): Promise<{ success: boolean; message: string }> {
    if (!this.supabase) {
      return { success: false, message: 'Supabase not configured' };
    }

    try {
      // Local'den cloud'a sync
      const localProducts = await fileStorageManager.getProducts();
      const localCategories = await fileStorageManager.getCategories();
      const localOrders = await fileStorageManager.getOrders();

      // Bulk sync to cloud
      if (localProducts.length > 0) {
        await this.supabase.from('products').upsert(localProducts);
      }
      if (localCategories.length > 0) {
        await this.supabase.from('categories').upsert(localCategories);
      }
      if (localOrders.length > 0) {
        await this.supabase.from('orders').upsert(localOrders);
      }

      this.syncStatus.lastSync = new Date().toISOString();
      this.syncStatus.syncErrors = [];
      this.saveSyncStatus();

      return { success: true, message: 'Sync completed successfully' };
    } catch (error) {
      console.error('Force sync error:', error);
      return { success: false, message: `Sync failed: ${error}` };
    }
  }

  getSyncStatus(): SyncStatus {
    return this.syncStatus;
  }

  // UTILITY METHODS
  async clearAllData(): Promise<void> {
    await fileStorageManager.clearAllData();
    
    if (this.supabase) {
      try {
        await this.supabase.from('products').delete().neq('id', '');
        await this.supabase.from('categories').delete().neq('id', '');
        await this.supabase.from('orders').delete().neq('id', '');
      } catch (error) {
        console.error('Cloud clear error:', error);
      }
    }
  }

  async exportData(): Promise<string> {
    return await fileStorageManager.exportData();
  }

  async importData(jsonData: string): Promise<boolean> {
    const result = await fileStorageManager.importData(jsonData);
    
    if (result && this.supabase) {
      // Import sonrası cloud'a da sync et
      setTimeout(() => this.forceSync(), 1000);
    }
    
    return result;
  }
}

// Singleton instance
export const hybridStorageManager = new HybridStorageManager();

// Type exports
export type { Product, Category, Order, SyncStatus };
