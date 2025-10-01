// Authentication Middleware
import { NextRequest, NextResponse } from 'next/server';
import { Role, Permission, hasPermission } from '../rbac/permissions';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  storeId?: string;
}

export interface AuthContext {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
}

// Mock authentication - replace with real JWT/session logic
export function getAuthUser(request: NextRequest): AuthUser | null {
  // In production, extract from JWT token or session
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  // Mock user for development
  return {
    id: 'user_123',
    email: 'admin@tdcmarket.com',
    role: Role.ADMIN,
    storeId: 'store_123',
  };
}

export function createAuthContext(request: NextRequest): AuthContext {
  const user = getAuthUser(request);
  
  return {
    user,
    isAuthenticated: !!user,
    hasPermission: (permission: Permission) => 
      user ? hasPermission(user.role, permission) : false,
    hasRole: (role: Role) => user?.role === role,
  };
}

export function requireAuth(handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authContext = createAuthContext(request);
    
    if (!authContext.isAuthenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return handler(request, authContext);
  };
}

export function requirePermission(permission: Permission) {
  return function(handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const authContext = createAuthContext(request);
      
      if (!authContext.isAuthenticated) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (!authContext.hasPermission(permission)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      return handler(request, authContext);
    };
  };
}

export function requireRole(role: Role) {
  return function(handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const authContext = createAuthContext(request);
      
      if (!authContext.isAuthenticated) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (!authContext.hasRole(role)) {
        return NextResponse.json(
          { error: 'Insufficient role' },
          { status: 403 }
        );
      }

      return handler(request, authContext);
    };
  };
}
