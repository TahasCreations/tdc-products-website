import { createClient } from '@supabase/supabase-js'

// Environment variables'ları güvenli şekilde al
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Eğer environment variables yoksa placeholder değerler kullan
const finalSupabaseUrl = supabaseUrl || 'https://placeholder.supabase.co'
const finalSupabaseAnonKey = supabaseAnonKey || 'placeholder-key'

// Supabase client'ı oluştur
export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Environment variables kontrolü için helper function
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && 
         supabaseUrl !== 'https://placeholder.supabase.co' &&
         supabaseAnonKey !== 'placeholder-key' &&
         supabaseUrl.startsWith('https://') &&
         supabaseAnonKey.startsWith('eyJ')
}

// Supabase bağlantısını test et
export const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' }
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Types
export interface Product {
  id: string
  title: string
  slug: string
  price: number
  category: string
  stock: number
  image: string
  description: string
  status: string
  created_at: string
  updated_at: string
}

export interface NewProduct {
  title: string
  slug: string
  price: number
  category: string
  stock: number
  image: string
  description: string
  status?: string
}
