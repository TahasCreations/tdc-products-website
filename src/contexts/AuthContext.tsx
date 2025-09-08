'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User, Session } from '@supabase/supabase-js';

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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isMainAdmin: boolean;
  adminLoading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
  checkAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const client = createClientSupabaseClient();
    if (client) {
      setSupabase(client);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    
    // Mevcut session'ı al
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session get error:', error);
        }
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Session fetch error:', error);
        setLoading(false);
      }
    };

    getSession();
  }, [supabase]);

  const signUp = async (email: string, password: string, userData?: any) => {
    if (!supabase) {
      return { error: { message: 'Supabase client not initialized' } };
    }
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    // Başarılı kayıt durumunda hoş geldin e-postası gönder
    if (!error) {
      try {
        const userName = userData?.first_name || userData?.name || 'Değerli Müşteri';
        await fetch('/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
            template: 'welcome',
            data: userName
          }),
        });
      } catch (emailError) {
        console.error('Hoş geldin e-postası gönderilemedi:', emailError);
        // E-posta hatası kayıt işlemini etkilemesin
      }
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase client not initialized' } };
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      return { error: { message: 'Supabase client not initialized' } };
    }
    
    // Production URL'ini kullan
    const redirectUrl = process.env.NODE_ENV === 'production' 
      ? 'https://tdc-products-website-6fjm.vercel.app/auth/callback'
      : `${window.location.origin}/auth/callback`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signOut = async () => {
    if (!supabase) {
      return { error: { message: 'Supabase client not initialized' } };
    }
    
    try {
      // Önce local state'i temizle (instant feedback için)
      setUser(null);
      setSession(null);
      
      // Supabase'den çıkış yap
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // Hata durumunda state'i geri yükle
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: { message: 'Çıkış yapılırken bir hata oluştu' } };
    }
  };

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase client not initialized' } };
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  const checkAdminStatus = useCallback(async () => {
    if (!supabase || !user?.email) {
      setIsAdmin(false);
      setIsMainAdmin(false);
      return;
    }

    setAdminLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('is_main_admin, is_active')
        .eq('email', user.email)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setIsAdmin(false);
        setIsMainAdmin(false);
      } else {
        setIsAdmin(true);
        setIsMainAdmin(data.is_main_admin || false);
      }
    } catch (error) {
      console.error('Admin status check error:', error);
      setIsAdmin(false);
      setIsMainAdmin(false);
    } finally {
      setAdminLoading(false);
    }
  }, [supabase, user?.email]);

  // Auth state değişikliklerini dinle
  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Çıkış durumunda local storage'ı temizle ve admin durumunu sıfırla
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('supabase.auth.token');
          setIsAdmin(false);
          setIsMainAdmin(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Giriş yapıldığında admin durumunu kontrol et
          setTimeout(() => checkAdminStatus(), 100);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, checkAdminStatus]);

  const updateProfile = async (updates: any) => {
    if (!supabase) {
      return { error: { message: 'Supabase client not initialized' } };
    }
    
    const { error } = await supabase.auth.updateUser(updates);
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    isMainAdmin,
    adminLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    checkAdminStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
