/**
 * RBAC Service - Business logic for role-based access control
 * Handles permissions, roles, and audit logging
 */

import { 
  RBACPort, 
  Role, 
  Permission, 
  RolePermission, 
  UserRole, 
  AuditLog, 
  User, 
  Tenant,
  PermissionCheck, 
  PermissionResult, 
  UserPermissions, 
  AuditLogRequest,
  PermissionScope,
  RoleType,
  AuditAction,
  SYSTEM_ROLES,
  RESOURCES,
  ACTIONS
} from '../ports/services/rbac.port';

export class RBACService {
  constructor(private rbacPort: RBACPort) {}

  // ===========================================
  // ROLE MANAGEMENT
  // ===========================================

  async createRole(role: Partial<Role>): Promise<Role> {
    try {
      return await this.rbacPort.createRole(role);
    } catch (error: any) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  async updateRole(roleId: string, updates: Partial<Role>): Promise<Role> {
    try {
      return await this.rbacPort.updateRole(roleId, updates);
    } catch (error: any) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  async deleteRole(roleId: string): Promise<boolean> {
    try {
      return await this.rbacPort.deleteRole(roleId);
    } catch (error: any) {
      console.error('Error deleting role:', error);
      return false;
    }
  }

  async getRole(roleId: string): Promise<Role | null> {
    try {
      return await this.rbacPort.getRole(roleId);
    } catch (error: any) {
      console.error('Error getting role:', error);
      return null;
    }
  }

  async getRoles(tenantId: string, filters?: {
    isSystem?: boolean;
    isActive?: boolean;
    name?: string;
  }): Promise<Role[]> {
    try {
      return await this.rbacPort.getRoles(tenantId, filters);
    } catch (error: any) {
      console.error('Error getting roles:', error);
      return [];
    }
  }

  // ===========================================
  // PERMISSION MANAGEMENT
  // ===========================================

  async createPermission(permission: Partial<Permission>): Promise<Permission> {
    try {
      return await this.rbacPort.createPermission(permission);
    } catch (error: any) {
      console.error('Error creating permission:', error);
      throw error;
    }
  }

  async updatePermission(permissionId: string, updates: Partial<Permission>): Promise<Permission> {
    try {
      return await this.rbacPort.updatePermission(permissionId, updates);
    } catch (error: any) {
      console.error('Error updating permission:', error);
      throw error;
    }
  }

  async deletePermission(permissionId: string): Promise<boolean> {
    try {
      return await this.rbacPort.deletePermission(permissionId);
    } catch (error: any) {
      console.error('Error deleting permission:', error);
      return false;
    }
  }

  async getPermission(permissionId: string): Promise<Permission | null> {
    try {
      return await this.rbacPort.getPermission(permissionId);
    } catch (error: any) {
      console.error('Error getting permission:', error);
      return null;
    }
  }

  async getPermissions(tenantId: string, filters?: {
    resource?: string;
    action?: string;
    scope?: PermissionScope;
    isActive?: boolean;
  }): Promise<Permission[]> {
    try {
      return await this.rbacPort.getPermissions(tenantId, filters);
    } catch (error: any) {
      console.error('Error getting permissions:', error);
      return [];
    }
  }

  // ===========================================
  // ROLE-PERMISSION MANAGEMENT
  // ===========================================

  async assignPermissionToRole(roleId: string, permissionId: string, isGranted: boolean = true, conditions?: Record<string, any>): Promise<RolePermission> {
    try {
      return await this.rbacPort.assignPermissionToRole(roleId, permissionId, isGranted, conditions);
    } catch (error: any) {
      console.error('Error assigning permission to role:', error);
      throw error;
    }
  }

  async revokePermissionFromRole(roleId: string, permissionId: string): Promise<boolean> {
    try {
      return await this.rbacPort.revokePermissionFromRole(roleId, permissionId);
    } catch (error: any) {
      console.error('Error revoking permission from role:', error);
      return false;
    }
  }

  async getRolePermissions(roleId: string): Promise<RolePermission[]> {
    try {
      return await this.rbacPort.getRolePermissions(roleId);
    } catch (error: any) {
      console.error('Error getting role permissions:', error);
      return [];
    }
  }

  // ===========================================
  // USER-ROLE MANAGEMENT
  // ===========================================

  async assignRoleToUser(userId: string, roleId: string, tenantId: string, sellerId?: string, assignedBy?: string, expiresAt?: Date): Promise<UserRole> {
    try {
      const userRole = await this.rbacPort.assignRoleToUser(userId, roleId, tenantId, sellerId, assignedBy, expiresAt);
      
      // Log the role assignment
      await this.logAuditEvent({
        tenantId,
        userId: assignedBy,
        action: AuditAction.ROLE_ASSIGNED,
        resource: RESOURCES.ROLES,
        resourceId: roleId,
        newValues: { userId, roleId, sellerId, expiresAt },
        metadata: { assignedBy, assignedTo: userId },
      });

      return userRole;
    } catch (error: any) {
      console.error('Error assigning role to user:', error);
      throw error;
    }
  }

  async revokeRoleFromUser(userId: string, roleId: string, tenantId: string, sellerId?: string): Promise<boolean> {
    try {
      const success = await this.rbacPort.revokeRoleFromUser(userId, roleId, tenantId, sellerId);
      
      if (success) {
        // Log the role revocation
        await this.logAuditEvent({
          tenantId,
          action: AuditAction.ROLE_REVOKED,
          resource: RESOURCES.ROLES,
          resourceId: roleId,
          oldValues: { userId, roleId, sellerId },
          metadata: { revokedFrom: userId },
        });
      }

      return success;
    } catch (error: any) {
      console.error('Error revoking role from user:', error);
      return false;
    }
  }

  async getUserRoles(userId: string, tenantId: string): Promise<UserRole[]> {
    try {
      return await this.rbacPort.getUserRoles(userId, tenantId);
    } catch (error: any) {
      console.error('Error getting user roles:', error);
      return [];
    }
  }

  async getUserPermissions(userId: string, tenantId: string): Promise<UserPermissions> {
    try {
      return await this.rbacPort.getUserPermissions(userId, tenantId);
    } catch (error: any) {
      console.error('Error getting user permissions:', error);
      throw error;
    }
  }

  // ===========================================
  // PERMISSION CHECKING
  // ===========================================

  async checkPermission(check: PermissionCheck): Promise<PermissionResult> {
    try {
      return await this.rbacPort.checkPermission(check);
    } catch (error: any) {
      console.error('Error checking permission:', error);
      return { allowed: false, reason: 'Permission check failed' };
    }
  }

  async hasPermission(userId: string, tenantId: string, resource: string, action: string, resourceId?: string, sellerId?: string): Promise<boolean> {
    try {
      return await this.rbacPort.hasPermission(userId, tenantId, resource, action, resourceId, sellerId);
    } catch (error: any) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  async canAccessResource(userId: string, tenantId: string, resource: string, resourceId?: string, sellerId?: string): Promise<boolean> {
    try {
      return await this.rbacPort.canAccessResource(userId, tenantId, resource, resourceId, sellerId);
    } catch (error: any) {
      console.error('Error checking resource access:', error);
      return false;
    }
  }

  // ===========================================
  // AUDIT LOGGING
  // ===========================================

  async logAuditEvent(request: AuditLogRequest): Promise<AuditLog> {
    try {
      return await this.rbacPort.logAuditEvent(request);
    } catch (error: any) {
      console.error('Error logging audit event:', error);
      throw error;
    }
  }

  async getAuditLogs(tenantId: string, filters?: {
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
  }> {
    try {
      return await this.rbacPort.getAuditLogs(tenantId, filters);
    } catch (error: any) {
      console.error('Error getting audit logs:', error);
      return { logs: [], total: 0 };
    }
  }

  // ===========================================
  // SYSTEM INITIALIZATION
  // ===========================================

  async initializeSystemRoles(tenantId: string): Promise<void> {
    try {
      const systemRoles = [
        {
          name: SYSTEM_ROLES.SUPER_ADMIN,
          displayName: 'Super Administrator',
          description: 'Full system access across all tenants',
          isSystem: true,
          isActive: true,
        },
        {
          name: SYSTEM_ROLES.ADMIN,
          displayName: 'Administrator',
          description: 'Full access within tenant',
          isSystem: true,
          isActive: true,
        },
        {
          name: SYSTEM_ROLES.MODERATOR,
          displayName: 'Moderator',
          description: 'Content moderation and review access',
          isSystem: true,
          isActive: true,
        },
        {
          name: SYSTEM_ROLES.SELLER_OWNER,
          displayName: 'Seller Owner',
          description: 'Full access to seller account and all products',
          isSystem: true,
          isActive: true,
        },
        {
          name: SYSTEM_ROLES.SELLER_STAFF,
          displayName: 'Seller Staff',
          description: 'Limited access to seller account and products',
          isSystem: true,
          isActive: true,
        },
        {
          name: SYSTEM_ROLES.CUSTOMER,
          displayName: 'Customer',
          description: 'Basic customer access',
          isSystem: true,
          isActive: true,
        },
      ];

      for (const roleData of systemRoles) {
        await this.createRole({
          ...roleData,
          tenantId,
        });
      }

      console.log(`✅ Initialized system roles for tenant ${tenantId}`);
    } catch (error: any) {
      console.error('Error initializing system roles:', error);
      throw error;
    }
  }

  async initializeSystemPermissions(tenantId: string): Promise<void> {
    try {
      const systemPermissions = [
        // Products permissions
        { resource: RESOURCES.PRODUCTS, action: ACTIONS.CREATE, scope: PermissionScope.OWN, description: 'Create products' },
        { resource: RESOURCES.PRODUCTS, action: ACTIONS.READ, scope: PermissionScope.OWN, description: 'View own products' },
        { resource: RESOURCES.PRODUCTS, action: ACTIONS.UPDATE, scope: PermissionScope.OWN, description: 'Update own products' },
        { resource: RESOURCES.PRODUCTS, action: ACTIONS.DELETE, scope: PermissionScope.OWN, description: 'Delete own products' },
        { resource: RESOURCES.PRODUCTS, action: ACTIONS.READ, scope: PermissionScope.TENANT, description: 'View all tenant products' },
        { resource: RESOURCES.PRODUCTS, action: ACTIONS.MANAGE, scope: PermissionScope.TENANT, description: 'Manage all tenant products' },

        // Orders permissions
        { resource: RESOURCES.ORDERS, action: ACTIONS.READ, scope: PermissionScope.OWN, description: 'View own orders' },
        { resource: RESOURCES.ORDERS, action: ACTIONS.UPDATE, scope: PermissionScope.OWN, description: 'Update own orders' },
        { resource: RESOURCES.ORDERS, action: ACTIONS.READ, scope: PermissionScope.TENANT, description: 'View all tenant orders' },
        { resource: RESOURCES.ORDERS, action: ACTIONS.MANAGE, scope: PermissionScope.TENANT, description: 'Manage all tenant orders' },

        // Analytics permissions
        { resource: RESOURCES.ANALYTICS, action: ACTIONS.READ, scope: PermissionScope.OWN, description: 'View own analytics' },
        { resource: RESOURCES.ANALYTICS, action: ACTIONS.READ, scope: PermissionScope.TENANT, description: 'View tenant analytics' },
        { resource: RESOURCES.ANALYTICS, action: ACTIONS.EXPORT, scope: PermissionScope.OWN, description: 'Export own analytics' },
        { resource: RESOURCES.ANALYTICS, action: ACTIONS.EXPORT, scope: PermissionScope.TENANT, description: 'Export tenant analytics' },

        // Moderation permissions
        { resource: RESOURCES.MODERATION, action: ACTIONS.READ, scope: PermissionScope.TENANT, description: 'View moderation cases' },
        { resource: RESOURCES.MODERATION, action: ACTIONS.UPDATE, scope: PermissionScope.TENANT, description: 'Update moderation cases' },
        { resource: RESOURCES.MODERATION, action: ACTIONS.APPROVE, scope: PermissionScope.TENANT, description: 'Approve/reject moderation cases' },
        { resource: RESOURCES.MODERATION, action: ACTIONS.MANAGE, scope: PermissionScope.TENANT, description: 'Manage moderation system' },

        // User management permissions
        { resource: RESOURCES.USERS, action: ACTIONS.READ, scope: PermissionScope.TENANT, description: 'View users' },
        { resource: RESOURCES.USERS, action: ACTIONS.CREATE, scope: PermissionScope.TENANT, description: 'Create users' },
        { resource: RESOURCES.USERS, action: ACTIONS.UPDATE, scope: PermissionScope.TENANT, description: 'Update users' },
        { resource: RESOURCES.USERS, action: ACTIONS.DELETE, scope: PermissionScope.TENANT, description: 'Delete users' },

        // Role management permissions
        { resource: RESOURCES.ROLES, action: ACTIONS.READ, scope: PermissionScope.TENANT, description: 'View roles' },
        { resource: RESOURCES.ROLES, action: ACTIONS.CREATE, scope: PermissionScope.TENANT, description: 'Create roles' },
        { resource: RESOURCES.ROLES, action: ACTIONS.UPDATE, scope: PermissionScope.TENANT, description: 'Update roles' },
        { resource: RESOURCES.ROLES, action: ACTIONS.DELETE, scope: PermissionScope.TENANT, description: 'Delete roles' },
        { resource: RESOURCES.ROLES, action: ACTIONS.ASSIGN, scope: PermissionScope.TENANT, description: 'Assign roles' },
        { resource: RESOURCES.ROLES, action: ACTIONS.REVOKE, scope: PermissionScope.TENANT, description: 'Revoke roles' },

        // Audit log permissions
        { resource: RESOURCES.AUDIT_LOGS, action: ACTIONS.READ, scope: PermissionScope.TENANT, description: 'View audit logs' },
        { resource: RESOURCES.AUDIT_LOGS, action: ACTIONS.EXPORT, scope: PermissionScope.TENANT, description: 'Export audit logs' },

        // Settings permissions
        { resource: RESOURCES.SETTINGS, action: ACTIONS.READ, scope: PermissionScope.TENANT, description: 'View settings' },
        { resource: RESOURCES.SETTINGS, action: ACTIONS.UPDATE, scope: PermissionScope.TENANT, description: 'Update settings' },
      ];

      for (const permissionData of systemPermissions) {
        await this.createPermission({
          ...permissionData,
          tenantId,
        });
      }

      console.log(`✅ Initialized system permissions for tenant ${tenantId}`);
    } catch (error: any) {
      console.error('Error initializing system permissions:', error);
      throw error;
    }
  }

  async seedDefaultRolesAndPermissions(tenantId: string): Promise<void> {
    try {
      // Initialize system roles and permissions
      await this.initializeSystemRoles(tenantId);
      await this.initializeSystemPermissions(tenantId);

      // Get created roles and permissions
      const roles = await this.getRoles(tenantId, { isSystem: true });
      const permissions = await this.getPermissions(tenantId, { isActive: true });

      // Create role-permission mappings
      const rolePermissionMappings = [
        // Super Admin - All permissions
        {
          roleName: SYSTEM_ROLES.SUPER_ADMIN,
          permissions: permissions.map(p => ({ permissionId: p.id, isGranted: true })),
        },
        // Admin - All tenant permissions
        {
          roleName: SYSTEM_ROLES.ADMIN,
          permissions: permissions
            .filter(p => p.scope !== PermissionScope.GLOBAL)
            .map(p => ({ permissionId: p.id, isGranted: true })),
        },
        // Moderator - Moderation and read permissions
        {
          roleName: SYSTEM_ROLES.MODERATOR,
          permissions: permissions
            .filter(p => 
              p.resource === RESOURCES.MODERATION || 
              (p.resource === RESOURCES.PRODUCTS && p.action === ACTIONS.READ) ||
              (p.resource === RESOURCES.USERS && p.action === ACTIONS.READ)
            )
            .map(p => ({ permissionId: p.id, isGranted: true })),
        },
        // Seller Owner - All seller permissions
        {
          roleName: SYSTEM_ROLES.SELLER_OWNER,
          permissions: permissions
            .filter(p => 
              (p.resource === RESOURCES.PRODUCTS && p.scope === PermissionScope.OWN) ||
              (p.resource === RESOURCES.ORDERS && p.scope === PermissionScope.OWN) ||
              (p.resource === RESOURCES.ANALYTICS && p.scope === PermissionScope.OWN)
            )
            .map(p => ({ permissionId: p.id, isGranted: true })),
        },
        // Seller Staff - Limited seller permissions
        {
          roleName: SYSTEM_ROLES.SELLER_STAFF,
          permissions: permissions
            .filter(p => 
              (p.resource === RESOURCES.PRODUCTS && p.action === ACTIONS.CREATE && p.scope === PermissionScope.OWN) ||
              (p.resource === RESOURCES.PRODUCTS && p.action === ACTIONS.READ && p.scope === PermissionScope.OWN) ||
              (p.resource === RESOURCES.PRODUCTS && p.action === ACTIONS.UPDATE && p.scope === PermissionScope.OWN) ||
              (p.resource === RESOURCES.ORDERS && p.action === ACTIONS.READ && p.scope === PermissionScope.OWN) ||
              (p.resource === RESOURCES.ANALYTICS && p.action === ACTIONS.READ && p.scope === PermissionScope.OWN)
            )
            .map(p => ({ permissionId: p.id, isGranted: true })),
        },
        // Customer - Basic read permissions
        {
          roleName: SYSTEM_ROLES.CUSTOMER,
          permissions: permissions
            .filter(p => 
              (p.resource === RESOURCES.PRODUCTS && p.action === ACTIONS.READ) ||
              (p.resource === RESOURCES.ORDERS && p.action === ACTIONS.READ && p.scope === PermissionScope.OWN)
            )
            .map(p => ({ permissionId: p.id, isGranted: true })),
        },
      ];

      // Assign permissions to roles
      for (const mapping of rolePermissionMappings) {
        const role = roles.find(r => r.name === mapping.roleName);
        if (role) {
          for (const rolePerm of mapping.permissions) {
            await this.assignPermissionToRole(role.id, rolePerm.permissionId, rolePerm.isGranted);
          }
        }
      }

      console.log(`✅ Seeded default roles and permissions for tenant ${tenantId}`);
    } catch (error: any) {
      console.error('Error seeding default roles and permissions:', error);
      throw error;
    }
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  async isSellerOwner(userId: string, tenantId: string, sellerId?: string): Promise<boolean> {
    try {
      const userRoles = await this.getUserRoles(userId, tenantId);
      return userRoles.some(ur => 
        ur.role?.name === SYSTEM_ROLES.SELLER_OWNER && 
        ur.isActive && 
        (!sellerId || ur.sellerId === sellerId)
      );
    } catch (error: any) {
      console.error('Error checking seller owner status:', error);
      return false;
    }
  }

  async isSellerStaff(userId: string, tenantId: string, sellerId?: string): Promise<boolean> {
    try {
      const userRoles = await this.getUserRoles(userId, tenantId);
      return userRoles.some(ur => 
        ur.role?.name === SYSTEM_ROLES.SELLER_STAFF && 
        ur.isActive && 
        (!sellerId || ur.sellerId === sellerId)
      );
    } catch (error: any) {
      console.error('Error checking seller staff status:', error);
      return false;
    }
  }

  async isAdmin(userId: string, tenantId: string): Promise<boolean> {
    try {
      const userRoles = await this.getUserRoles(userId, tenantId);
      return userRoles.some(ur => 
        (ur.role?.name === SYSTEM_ROLES.ADMIN || ur.role?.name === SYSTEM_ROLES.SUPER_ADMIN) && 
        ur.isActive
      );
    } catch (error: any) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // ===========================================
  // HEALTH CHECK
  // ===========================================

  async healthCheck(): Promise<boolean> {
    try {
      return await this.rbacPort.healthCheck();
    } catch (error) {
      console.error('RBAC service health check failed:', error);
      return false;
    }
  }
}

