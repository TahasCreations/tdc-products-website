// Build-time environment variable check
console.log('🔍 Environment Variables Check:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '⚠️ Missing (will use fallback)');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '⚠️ Missing (will use fallback)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('VERCEL:', process.env.VERCEL ? '✅ Vercel environment detected' : '⚠️ Local environment');

// Check if Supabase URL is valid (only if set)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl && (supabaseUrl.includes('your_supabase_project_url') || !supabaseUrl.startsWith('https://'))) {
  console.warn('⚠️ Invalid Supabase URL detected, but continuing build...');
}

// Check Node.js version
console.log('Node.js version:', process.version);

console.log('✅ Environment variables check completed!');
