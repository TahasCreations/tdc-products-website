// RBAC Permissions System
export enum Permission {
  // User Management
  USER_READ = 'user:read',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  
  // Product Management
  PRODUCT_READ = 'product:read',
  PRODUCT_CREATE = 'product:create',
  PRODUCT_UPDATE = 'product:update',
  PRODUCT_DELETE = 'product:delete',
  
  // Order Management
  ORDER_READ = 'order:read',
  ORDER_CREATE = 'order:create',
  ORDER_UPDATE = 'order:update',
  ORDER_DELETE = 'order:delete',
  
  // Blog Management
  BLOG_READ = 'blog:read',
  BLOG_CREATE = 'blog:create',
  BLOG_UPDATE = 'blog:update',
  BLOG_DELETE = 'blog:delete',
  BLOG_MODERATE = 'blog:moderate',
  
  // Financial Management
  FINANCE_READ = 'finance:read',
  FINANCE_CREATE = 'finance:create',
  FINANCE_UPDATE = 'finance:update',
  FINANCE_DELETE = 'finance:delete',
  FINANCE_SETTLEMENT = 'finance:settlement',
  
  // Marketing
  MARKETING_READ = 'marketing:read',
  MARKETING_CREATE = 'marketing:create',
  MARKETING_UPDATE = 'marketing:update',
  MARKETING_DELETE = 'marketing:delete',
  MARKETING_ADS = 'marketing:ads',
  
  // AI & Analytics
  AI_READ = 'ai:read',
  AI_CREATE = 'ai:create',
  AI_ANALYTICS = 'ai:analytics',
  
  // Admin
  ADMIN_READ = 'admin:read',
  ADMIN_CREATE = 'admin:create',
  ADMIN_UPDATE = 'admin:update',
  ADMIN_DELETE = 'admin:delete',
  ADMIN_AUDIT = 'admin:audit',
}

export enum Role {
  ADMIN = 'admin',
  FINANCE = 'finance',
  OPS = 'ops',
  MARKETING = 'marketing',
  AI_ANALYST = 'ai_analyst',
  SELLER = 'seller',
  CUSTOMER = 'customer',
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),
  
  [Role.FINANCE]: [
    Permission.USER_READ,
    Permission.ORDER_READ,
    Permission.FINANCE_READ,
    Permission.FINANCE_CREATE,
    Permission.FINANCE_UPDATE,
    Permission.FINANCE_SETTLEMENT,
    Permission.ADMIN_AUDIT,
  ],
  
  [Role.OPS]: [
    Permission.USER_READ,
    Permission.PRODUCT_READ,
    Permission.PRODUCT_UPDATE,
    Permission.ORDER_READ,
    Permission.ORDER_UPDATE,
    Permission.BLOG_MODERATE,
  ],
  
  [Role.MARKETING]: [
    Permission.USER_READ,
    Permission.PRODUCT_READ,
    Permission.ORDER_READ,
    Permission.BLOG_READ,
    Permission.BLOG_CREATE,
    Permission.BLOG_UPDATE,
    Permission.MARKETING_READ,
    Permission.MARKETING_CREATE,
    Permission.MARKETING_UPDATE,
    Permission.MARKETING_ADS,
    Permission.AI_READ,
    Permission.AI_ANALYTICS,
  ],
  
  [Role.AI_ANALYST]: [
    Permission.USER_READ,
    Permission.PRODUCT_READ,
    Permission.ORDER_READ,
    Permission.BLOG_READ,
    Permission.AI_READ,
    Permission.AI_CREATE,
    Permission.AI_ANALYTICS,
  ],
  
  [Role.SELLER]: [
    Permission.PRODUCT_READ,
    Permission.PRODUCT_CREATE,
    Permission.PRODUCT_UPDATE,
    Permission.ORDER_READ,
    Permission.BLOG_READ,
    Permission.BLOG_CREATE,
    Permission.BLOG_UPDATE,
  ],
  
  [Role.CUSTOMER]: [
    Permission.PRODUCT_READ,
    Permission.ORDER_READ,
    Permission.ORDER_CREATE,
    Permission.BLOG_READ,
    Permission.BLOG_CREATE,
  ],
};

export function hasPermission(userRole: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}
