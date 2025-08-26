import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

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
