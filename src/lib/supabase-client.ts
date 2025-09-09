import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Global Supabase client instances with proper typing
let supabaseClient: SupabaseClient | null = null;
let serverSupabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    // Performance optimizations
    global: {
      headers: {
        'X-Client-Info': 'tdc-products-website'
      }
    }
  });
  
  return supabaseClient;
};

// Server-side Supabase client with caching
export const getServerSupabaseClient = (): SupabaseClient | null => {
  if (serverSupabaseClient) {
    return serverSupabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  serverSupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    // Performance optimizations
    global: {
      headers: {
        'X-Client-Info': 'tdc-products-website-server'
      }
    }
  });
  
  return serverSupabaseClient;
};
