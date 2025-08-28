import { createClient } from '@supabase/supabase-js'

// Ortak client (tarayıcı tarafı için)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Eğer environment variables yoksa placeholder değerleri sadece tarayıcı kullanımını kilitlememek adına kullanıyoruz
const finalSupabaseUrl = supabaseUrl || 'https://placeholder.supabase.co'
const finalSupabaseAnonKey = supabaseAnonKey || 'placeholder-key'

export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Environment kontrolü
export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.startsWith('eyJ')
  )
}

// Sunucu tarafında kullanılacak yardımcı: anon ve admin client döndürür
export const getServerSupabaseClients = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (!url || !anon || !url.startsWith('https://') || !anon.startsWith('eyJ')) {
    return { configured: false as const }
  }

  const serverClient = createClient(url, anon)
  const adminClient = service && service.startsWith('eyJ') ? createClient(url, service) : null

  return {
    configured: true as const,
    supabase: serverClient,
    supabaseAdmin: adminClient
  }
}

// Bağlantı testi (sunucu tarafı)
export const testSupabaseConnection = async () => {
  const clients = getServerSupabaseClients()
  if (!clients.configured) {
    return { success: false, error: 'Supabase not configured' }
  }
  try {
    const { error, count } = await clients.supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true, data: { count: count ?? 0 } }
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
