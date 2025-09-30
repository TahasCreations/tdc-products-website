/**
 * RBAC Domain Port
 * Interface for role-based access control and audit logging
 */

export interface Role {
  id: string;
  tenantId: string;
  name: string;
  displayName: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
  parentRoleId?: string;
  parentRole?: Role;
  childRoles?: Role[];
  permissions?: RolePermission[];
  userRoles?: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  tenantId: string;
  resource: string;
  action: string;
  scope: PermissionScope;
  description?: string;
  isActive: boolean;
  rolePermissions?: RolePermission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  isGranted: boolean;
  conditions?: Record<string, any>;
  role?: Role;
  permission?: Permission;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  tenantId: string;
  sellerId?: string;
  isActive: boolean;
  assignedBy?: string;
  assignedAt: Date;
  expiresAt?: Date;
  user?: User;
  role?: Role;
  tenant?: Tenant;
  assignedByUser?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId?: string;
  sessionId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  success: boolean;
  errorMessage?: string;
  statusCode?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  role: string;
  accounts?: any[];
  sessions?: any[];
  userRoles?: UserRole[];
  assignedRoles?: UserRole[];
  auditLogs?: AuditLog[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  settings?: Record<string, any>;
  roles?: Role[];
  permissions?: Permission[];
  userRoles?: UserRole[];
  auditLogs?: AuditLog[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PermissionCheck {
  userId: string;
  tenantId: string;
  resource: string;
  action: string;
  resourceId?: string;
  sellerId?: string;
  context?: Record<string, any>;
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
  conditions?: Record<string, any>;
  rolePermissions?: RolePermission[];
}

export interface UserPermissions {
  userId: string;
  tenantId: string;
  roles: Role[];
  permissions: Permission[];
  effectivePermissions: {
    resource: string;
    action: string;
    scope: PermissionScope;
    allowed: boolean;
    conditions?: Record<string, any>;
  }[];
}

export interface AuditLogRequest {
  tenantId: string;
  userId?: string;
  sessionId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  success?: boolean;
  errorMessage?: string;
  statusCode?: number;
  metadata?: Record<string, any>;
}

export interface RBACPort {
  // Role management
  createRole(role: Partial<Role>): Promise<Role>;
  updateRole(roleId: string, updates: Partial<Role>): Promise<Role>;
  deleteRole(roleId: string): Promise<boolean>;
  getRole(roleId: string): Promise<Role | null>;
  getRoles(tenantId: string, filters?: {
    isSystem?: boolean;
    isActive?: boolean;
    name?: string;
  }): Promise<Role[]>;

  // Permission management
  createPermission(permission: Partial<Permission>): Promise<Permission>;
  updatePermission(permissionId: string, updates: Partial<Permission>): Promise<Permission>;
  deletePermission(permissionId: string): Promise<boolean>;
  getPermission(permissionId: string): Promise<Permission | null>;
  getPermissions(tenantId: string, filters?: {
    resource?: string;
    action?: string;
    scope?: PermissionScope;
    isActive?: boolean;
  }): Promise<Permission[]>;

  // Role-Permission management
  assignPermissionToRole(roleId: string, permissionId: string, isGranted?: boolean, conditions?: Record<string, any>): Promise<RolePermission>;
  revokePermissionFromRole(roleId: string, permissionId: string): Promise<boolean>;
  getRolePermissions(roleId: string): Promise<RolePermission[]>;

  // User-Role management
  assignRoleToUser(userId: string, roleId: string, tenantId: string, sellerId?: string, assignedBy?: string, expiresAt?: Date): Promise<UserRole>;
  revokeRoleFromUser(userId: string, roleId: string, tenantId: string, sellerId?: string): Promise<boolean>;
  getUserRoles(userId: string, tenantId: string): Promise<UserRole[]>;
  getUserPermissions(userId: string, tenantId: string): Promise<UserPermissions>;

  // Permission checking
  checkPermission(check: PermissionCheck): Promise<PermissionResult>;
  hasPermission(userId: string, tenantId: string, resource: string, action: string, resourceId?: string, sellerId?: string): Promise<boolean>;
  canAccessResource(userId: string, tenantId: string, resource: string, resourceId?: string, sellerId?: string): Promise<boolean>;

  // Audit logging
  logAuditEvent(request: AuditLogRequest): Promise<AuditLog>;
  getAuditLogs(tenantId: string, filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    success?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{
    logs: AuditLog[];
    total: number;
  }>;

  // System initialization
  initializeSystemRoles(tenantId: string): Promise<void>;
  initializeSystemPermissions(tenantId: string): Promise<void>;
  seedDefaultRolesAndPermissions(tenantId: string): Promise<void>;

  // Health check
  healthCheck(): Promise<boolean>;
}

// Enums
export enum PermissionScope {
  OWN = 'OWN',
  TENANT = 'TENANT',
  GLOBAL = 'GLOBAL',
}

export enum RoleType {
  SYSTEM = 'SYSTEM',
  TENANT = 'TENANT',
  SELLER = 'SELLER',
  CUSTOM = 'CUSTOM',
}

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  ROLE_ASSIGNED = 'ROLE_ASSIGNED',
  ROLE_REVOKED = 'ROLE_REVOKED',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
}

// Predefined roles and permissions
export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  SELLER_OWNER: 'seller_owner',
  SELLER_STAFF: 'seller_staff',
  CUSTOMER: 'customer',
} as const;

export const RESOURCES = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  ANALYTICS: 'analytics',
  MODERATION: 'moderation',
  USERS: 'users',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  AUDIT_LOGS: 'audit_logs',
  SETTINGS: 'settings',
  REPORTS: 'reports',
} as const;

export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  EXPORT: 'export',
  IMPORT: 'import',
  APPROVE: 'approve',
  REJECT: 'reject',
  ASSIGN: 'assign',
  REVOKE: 'revoke',
} as const;

