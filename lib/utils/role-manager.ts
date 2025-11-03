/**
 * Multi-Role Management Utilities
 * Kullanıcılar artık birden fazla role sahip olabilir
 */

export type UserRole = 'BUYER' | 'SELLER' | 'INFLUENCER' | 'ADMIN';

export interface UserWithRoles {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole; // Ana role (legacy)
  roles?: string | null; // Multi-role JSON array
}

/**
 * Kullanıcının tüm rollerini al
 */
export function getUserRoles(user: UserWithRoles): UserRole[] {
  if (user.roles) {
    try {
      const rolesArray = JSON.parse(user.roles);
      if (Array.isArray(rolesArray)) {
        return rolesArray as UserRole[];
      }
    } catch (error) {
      console.error('Failed to parse user roles:', error);
    }
  }
  
  // Fallback: Ana role'ü kullan
  return [user.role];
}

/**
 * Kullanıcının belirli bir role sahip olup olmadığını kontrol et
 */
export function hasRole(user: UserWithRoles, role: UserRole): boolean {
  const roles = getUserRoles(user);
  return roles.includes(role);
}

/**
 * Kullanıcının birden fazla rolü var mı?
 */
export function hasMultipleRoles(user: UserWithRoles): boolean {
  const roles = getUserRoles(user);
  return roles.length > 1;
}

/**
 * Kullanıcıya role ekle
 */
export function addRole(user: UserWithRoles, newRole: UserRole): string {
  const currentRoles = getUserRoles(user);
  
  if (!currentRoles.includes(newRole)) {
    currentRoles.push(newRole);
  }
  
  return JSON.stringify(currentRoles);
}

/**
 * Kullanıcıdan role kaldır
 */
export function removeRole(user: UserWithRoles, roleToRemove: UserRole): string {
  const currentRoles = getUserRoles(user);
  const filteredRoles = currentRoles.filter(r => r !== roleToRemove);
  
  // En az bir role kalmalı
  if (filteredRoles.length === 0) {
    filteredRoles.push('BUYER');
  }
  
  return JSON.stringify(filteredRoles);
}

/**
 * Dashboard URL'ini role göre belirle
 */
export function getDashboardUrl(role: UserRole): string {
  switch (role) {
    case 'SELLER':
      return '/partner/seller/dashboard';
    case 'INFLUENCER':
      return '/partner/influencer/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/profile';
  }
}

/**
 * Role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'BUYER':
      return 'Müşteri';
    case 'SELLER':
      return 'Satıcı';
    case 'INFLUENCER':
      return 'Influencer';
    case 'ADMIN':
      return 'Admin';
    default:
      return 'Kullanıcı';
  }
}

/**
 * Role icon emoji
 */
export function getRoleIcon(role: UserRole): string {
  switch (role) {
    case 'BUYER':
      return '🛒';
    case 'SELLER':
      return '🏪';
    case 'INFLUENCER':
      return '⭐';
    case 'ADMIN':
      return '👑';
    default:
      return '👤';
  }
}

/**
 * Role color
 */
export function getRoleColor(role: UserRole): {
  bg: string;
  text: string;
  border: string;
  gradient: string;
} {
  switch (role) {
    case 'SELLER':
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        gradient: 'from-indigo-600 to-purple-600'
      };
    case 'INFLUENCER':
      return {
        bg: 'bg-pink-50',
        text: 'text-pink-700',
        border: 'border-pink-200',
        gradient: 'from-pink-600 to-rose-600'
      };
    case 'ADMIN':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        gradient: 'from-amber-600 to-orange-600'
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        gradient: 'from-gray-600 to-gray-700'
      };
  }
}

