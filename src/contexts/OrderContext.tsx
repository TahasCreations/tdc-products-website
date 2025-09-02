'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

// Client-side Supabase client
const createClientSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

export interface OrderItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  shipping_address: ShippingAddress;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  createOrder: (orderData: Partial<Order>) => Promise<{ order: Order | null; error: any }>;
  getOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<{ error: any }>;
  getOrderById: (orderId: string) => Promise<{ order: Order | null; error: any }>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { state: cartState, clearCart } = useCart();

  const createOrder = async (orderData: Partial<Order>) => {
    if (!user) {
      return { order: null, error: { message: 'Kullanıcı girişi gerekli' } };
    }

    try {
      setLoading(true);

      const supabase = createClientSupabaseClient();
      if (!supabase) {
        return { order: null, error: { message: 'Supabase client not initialized' } };
      }

      const orderItems = cartState.items.map(item => ({
        product_id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        slug: item.slug || ''
      }));

      const newOrder = {
        order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        user_id: user.id,
        items: orderItems,
        total_amount: cartState.total,
        status: 'pending' as const,
        payment_status: 'pending' as const,
        payment_method: 'credit_card',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...orderData
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([newOrder])
        .select()
        .single();

      if (error) {
        return { order: null, error };
      }

      // Sepeti temizle
      clearCart();

      // Sipariş onayı e-postası gönder
      try {
        const customerName = `${orderData.shipping_address?.first_name || ''} ${orderData.shipping_address?.last_name || ''}`.trim();
        const orderNumber = data.id.slice(-8);
        
        await fetch('/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: orderData.shipping_address?.email || user.email,
            template: 'orderConfirmed',
            data: {
              orderNumber,
              customerName: customerName || 'Değerli Müşteri',
              totalAmount: cartState.total,
              items: orderItems
            }
          }),
        });
      } catch (emailError) {
        console.error('Sipariş onayı e-postası gönderilemedi:', emailError);
        // E-posta hatası sipariş işlemini etkilemesin
      }

      // Orders listesini güncelle
      setOrders(prev => [data, ...prev]);

      return { order: data, error: null };
    } catch (error) {
      return { order: null, error };
    } finally {
      setLoading(false);
    }
  };

  const getOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const supabase = createClientSupabaseClient();
      if (!supabase) {
        return;
      }
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const supabase = createClientSupabaseClient();
      if (!supabase) {
        return { error: { message: 'Supabase client not initialized' } };
      }
      const { error } = await supabase
        .from('orders')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId);

      if (error) {
        return { error };
      }

      // Local state'i güncelle
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status, updated_at: new Date().toISOString() }
            : order
        )
      );

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const getOrderById = async (orderId: string) => {
    try {
      const supabase = createClientSupabaseClient();
      if (!supabase) {
        return { order: null, error: { message: 'Supabase client not initialized' } };
      }
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      return { order: data, error };
    } catch (error) {
      return { order: null, error };
    }
  };

  const value = {
    orders,
    loading,
    createOrder,
    getOrders,
    updateOrderStatus,
    getOrderById
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
