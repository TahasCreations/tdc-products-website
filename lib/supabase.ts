import { createClient } from '@supabase/supabase-js'

// Environment variables'ları güvenli şekilde al
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Eğer environment variables yoksa hata fırlat
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are not configured. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
