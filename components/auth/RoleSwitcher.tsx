'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getUserRoles, 
  hasMultipleRoles, 
  getDashboardUrl, 
  getRoleDisplayName, 
  getRoleIcon,
  getRoleColor,
  type UserRole 
} from '@/lib/utils/role-manager';

interface RoleSwitcherProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
    roles?: string | null;
  };
  currentRole?: UserRole;
}

export default function RoleSwitcher({ user, currentRole }: RoleSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  const userRoles = getUserRoles(user);
  const hasMultiple = hasMultipleRoles(user);
  
  // Multi-role yoksa gösterme
  if (!hasMultiple) {
    return null;
  }

  const activeRole = currentRole || user.role;

  const handleRoleSwitch = (role: UserRole) => {
    const dashboardUrl = getDashboardUrl(role);
    router.push(dashboardUrl);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
      >
        <span className="text-lg">{getRoleIcon(activeRole)}</span>
        <div className="text-left">
          <div className="text-xs text-gray-500">Aktif Role</div>
          <div className="font-semibold text-gray-900">{getRoleDisplayName(activeRole)}</div>
        </div>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 w-64 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50"
            >
              <div className="p-2">
                <div className="px-3 py-2 border-b border-gray-200 mb-2">
                  <p className="text-xs text-gray-500 font-medium">Role Değiştir</p>
                </div>

                {userRoles.map((role) => {
                  const colors = getRoleColor(role);
                  const isActive = role === activeRole;

                  return (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                        isActive 
                          ? `${colors.bg} ${colors.border} border-2` 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-10 h-10 bg-gradient-to-r ${colors.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-xl">{getRoleIcon(role)}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`font-semibold ${isActive ? colors.text : 'text-gray-900'}`}>
                          {getRoleDisplayName(role)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getDashboardUrl(role)}
                        </div>
                      </div>
                      {isActive && (
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Info */}
              <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  💡 <strong>İpucu:</strong> Roller arası kolayca geçiş yapabilirsiniz
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

