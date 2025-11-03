/**
 * Auth Helper Functions
 * Multi-role authentication and authorization utilities
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserRoles, hasRole, type UserRole } from '@/lib/utils/role-manager';

/**
 * Get current user session with role support
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return null;
  }
  
  return session.user;
}

/**
 * Require authenticated user
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/giris');
  }
  
  return user;
}

/**
 * Require specific role(s)
 * Supports multi-role: User can have SELLER + INFLUENCER simultaneously
 */
export async function requireRole(...allowedRoles: UserRole[]) {
  const user = await requireAuth();
  
  // Check if user has multi-role support
  const userWithRoles = user as any;
  const userRoles = getUserRoles(userWithRoles);
  
  // Check if user has any of the allowed roles
  const hasPermission = allowedRoles.some(role => userRoles.includes(role));
  
  if (!hasPermission) {
    redirect('/403');
  }
  
  return user;
}

/**
 * Require seller role
 */
export async function requireSeller() {
  return requireRole('SELLER', 'ADMIN');
}

/**
 * Require influencer role
 */
export async function requireInfluencer() {
  return requireRole('INFLUENCER', 'ADMIN');
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return requireRole('ADMIN');
}

/**
 * Check if user has specific role (client-side)
 */
export function checkUserRole(user: any, role: UserRole): boolean {
  if (!user) return false;
  return hasRole(user, role);
}

