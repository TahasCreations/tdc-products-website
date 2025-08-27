import { createClient } from '@supabase/supabase-js'

// Environment variables'ları güvenli şekilde al
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Eğer environment variables yoksa placeholder değerler kullan
const finalSupabaseUrl = supabaseUrl || 'https://placeholder.supabase.co'
const finalSupabaseAnonKey = supabaseAnonKey || 'placeholder-key'

export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey)

// Environment variables kontrolü için helper function
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && 
         supabaseUrl !== 'https://placeholder.supabase.co' &&
         supabaseAnonKey !== 'placeholder-key'
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
