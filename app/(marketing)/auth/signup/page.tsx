'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * /auth/signup → /kayit redirect
 * Ana kayıt sayfası /kayit kullanılıyor
 */
export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/kayit');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-gray-600 text-sm">Yönlendiriliyor...</p>
      </div>
    </div>
  );
}
