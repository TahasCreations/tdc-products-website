import { createClient } from '@supabase/supabase-js';
import { performanceMonitor } from '../src/lib/performance-monitor';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Using mock data.');
}

// Optimized Supabase client with performance monitoring
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Disable session persistence for better performance
      },
      realtime: {
        params: {
          eventsPerSecond: 10, // Limit realtime events
        },
      },
      global: {
        headers: {
          'x-application-name': 'tdc-products-website',
        },
      },
    })
  : null;

// Optimized helper functions with performance monitoring
export const getProducts = async () => {
  return performanceMonitor.wrapDatabaseQuery('getProducts', async () => {
    if (!supabase) {
      console.warn('Supabase not available, returning empty array');
      return [];
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  });
};

export const addProduct = async (product: any) => {
  return performanceMonitor.wrapDatabaseQuery('addProduct', async () => {
    if (!supabase) {
      throw new Error('Supabase not available');
    }

    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();

    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }

    return data?.[0];
  }, { productId: product.id });
};

export const updateProduct = async (id: string, updates: any) => {
  if (!supabase) {
    throw new Error('Supabase not available');
  }

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return data?.[0];
};

export const deleteProduct = async (id: string) => {
  if (!supabase) {
    throw new Error('Supabase not available');
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const getCategories = async () => {
  return performanceMonitor.wrapDatabaseQuery('getCategories', async () => {
    if (!supabase) {
      console.warn('Supabase not available, returning empty array');
      return [];
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  });
};

export const addCategory = async (category: any) => {
  if (!supabase) {
    throw new Error('Supabase not available');
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select();

  if (error) {
    console.error('Error adding category:', error);
    throw error;
  }

  return data?.[0];
};

export const updateCategory = async (id: string, updates: any) => {
  if (!supabase) {
    throw new Error('Supabase not available');
  }

  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating category:', error);
    throw error;
  }

  return data?.[0];
};

export const deleteCategory = async (id: string) => {
  if (!supabase) {
    throw new Error('Supabase not available');
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
