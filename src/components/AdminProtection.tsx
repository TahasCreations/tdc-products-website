'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AIChatbot from './AIChatbot';
import AdvancedAnalyticsDashboard from './AdvancedAnalyticsDashboard';
import BackButton from './admin/BackButton';

interface AdminProtectionProps {
  children: React.ReactNode;
  requireMainAdmin?: boolean;
}

export default function AdminProtection({ children, requireMainAdmin = false }: AdminProtectionProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Optimized auth check with useCallback
  const checkAdminAuth = useCallback(() => {
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      if (storedAdmin) {
        const admin = JSON.parse(storedAdmin);
        setAdminUser(admin);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Admin auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  // Optimized logout with immediate UI update
  const handleLogout = useCallback(() => {
    // Immediate UI update
    setIsAuthenticated(false);
    setAdminUser(null);
    
    // Clear localStorage
    localStorage.removeItem('admin_user');
    
    // Fast redirect
    router.replace('/admin/login');
  }, [router]);

  // Enhanced scroll position aware back navigation
  const handleBackNavigation = useCallback(() => {
    // Store current scroll position with timestamp
    const currentScrollY = window.scrollY;
    const scrollData = {
      position: currentScrollY,
      timestamp: Date.now(),
      url: window.location.pathname
    };
    sessionStorage.setItem('admin_scroll_data', JSON.stringify(scrollData));
    
    // Navigate back
    router.back();
  }, [router]);

  // Enhanced scroll position restoration
  useEffect(() => {
    const savedScrollData = sessionStorage.getItem('admin_scroll_data');
    if (savedScrollData) {
      try {
        const scrollData = JSON.parse(savedScrollData);
        const { position, timestamp, url } = scrollData;
        
        // Check if data is recent (within 30 seconds) and from different page
        const isRecent = Date.now() - timestamp < 30000;
        const isDifferentPage = url !== window.location.pathname;
        
        if (isRecent && isDifferentPage) {
          // Multiple attempts to ensure scroll restoration
          const restoreScroll = () => {
            window.scrollTo(0, position);
          };
          
          // Immediate restoration
          restoreScroll();
          
          // Delayed restoration for dynamic content
          setTimeout(restoreScroll, 100);
          setTimeout(restoreScroll, 300);
          setTimeout(restoreScroll, 500);
          
          // Clean up after successful restoration
          setTimeout(() => {
            sessionStorage.removeItem('admin_scroll_data');
          }, 1000);
        } else {
          // Clean up old data
          sessionStorage.removeItem('admin_scroll_data');
        }
      } catch (error) {
        console.error('Scroll restoration error:', error);
        sessionStorage.removeItem('admin_scroll_data');
      }
    }
  }, []);

  // Memoized admin info for better performance
  const adminInfo = useMemo(() => ({
    name: adminUser?.name || adminUser?.email || 'Admin',
    isMainAdmin: adminUser?.is_main_admin || false
  }), [adminUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yetki kontrolü yapılıyor...</p>
        </div>
      </div>
    );
  }

         if (!isAuthenticated) {
           return (
             <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
               <div className="text-center">
                 <h1 className="text-2xl font-bold text-red-600 mb-4">Erişim Reddedildi</h1>
                 <p className="text-gray-600 mb-6">
                   Bu sayfaya erişmek için admin girişi yapmanız gerekiyor.
                 </p>
                 <div className="space-x-4">
                   <Link
                     href="/admin/login"
                     className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                   >
                     Admin Girişi
                   </Link>
                   <Link
                     href="/"
                     className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                   >
                     Ana Sayfaya Dön
                   </Link>
                 </div>
               </div>
             </div>
           );
         }

         // Main admin kontrolü
         if (requireMainAdmin && !adminInfo.isMainAdmin) {
           return (
             <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
               <div className="text-center">
                 <h1 className="text-2xl font-bold text-red-600 mb-4">Erişim Reddedildi</h1>
                 <p className="text-gray-600 mb-6">
                   Bu sayfaya erişmek için ana admin yetkisi gerekiyor.
                 </p>
                 <div className="space-x-4">
                   <Link
                     href="/admin"
                     className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                   >
                     Admin Paneli
                   </Link>
                   <Link
                     href="/"
                     className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                   >
                     Ana Sayfaya Dön
                   </Link>
                 </div>
               </div>
             </div>
           );
         }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BackButton className="mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Admin Paneli</h1>
              {adminInfo.isMainAdmin && (
                <span className="ml-3 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Ana Admin
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hoş geldin, {adminInfo.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-150 hover:bg-red-50 px-3 py-1 rounded-md border border-red-200 hover:border-red-300"
                title="Hızlı çıkış"
              >
                <i className="ri-logout-box-line mr-1"></i>
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
        
        {/* Advanced Analytics Dashboard */}
        <div className="mt-8">
          <AdvancedAnalyticsDashboard />
        </div>
      </main>
      
      {/* AI Chatbot for Admin */}
      <AIChatbot context={{ userType: 'admin' }} />
    </div>
  );
}