/**
 * RBAC Adapter - Concrete implementation of RBAC service
 * Handles role-based access control and audit logging
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
  AuditAction
} from '@tdc/domain';
import { PrismaClient } from '@prisma/client';

export class RBACAdapter implements RBACPort {
  constructor(private prisma: PrismaClient) {}

  // ===========================================
  // ROLE MANAGEMENT
  // ===========================================

  async createRole(role: Partial<Role>): Promise<Role> {
    try {
      const createdRole = await this.prisma.role.create({
        data: {
          tenantId: role.tenantId!,
          name: role.name!,
          displayName: role.displayName!,
          description: role.description,
          isSystem: role.isSystem || false,
          isActive: role.isActive !== undefined ? role.isActive : true,
          parentRoleId: role.parentRoleId,
        },
      });

      return this.mapPrismaToRole(createdRole);
    } catch (error: any) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  async updateRole(roleId: string, updates: Partial<Role>): Promise<Role> {
    try {
      const updatedRole = await this.prisma.role.update({
        where: { id: roleId },
        data: {
          ...(updates.name && { name: updates.name }),
          ...(updates.displayName && { displayName: updates.displayName }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.isSystem !== undefined && { isSystem: updates.isSystem }),
          ...(updates.isActive !== undefined && { isActive: updates.isActive }),
          ...(updates.parentRoleId !== undefined && { parentRoleId: updates.parentRoleId }),
        },
      });

      return this.mapPrismaToRole(updatedRole);
    } catch (error: any) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  async deleteRole(roleId: string): Promise<boolean> {
    try {
      // Check if role is system role
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
        select: { isSystem: true },
      });

      if (role?.isSystem) {
        throw new Error('Cannot delete system role');
      }

      await this.prisma.role.delete({
        where: { id: roleId },
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting role:', error);
      return false;
    }
  }

  async getRole(roleId: string): Promise<Role | null> {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
        include: {
          parentRole: true,
          childRoles: true,
          permissions: {
            include: {
              permission: true,
            },
          },
          userRoles: {
            include: {
              user: true,
            },
          },
        },
      });

      return role ? this.mapPrismaToRole(role) : null;
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
      const where: any = { tenantId };

      if (filters?.isSystem !== undefined) where.isSystem = filters.isSystem;
      if (filters?.isActive !== undefined) where.isActive = filters.isActive;
      if (filters?.name) where.name = { contains: filters.name, mode: 'insensitive' };

      const roles = await this.prisma.role.findMany({
        where,
        include: {
          parentRole: true,
          childRoles: true,
          permissions: {
            include: {
              permission: true,
            },
          },
          userRoles: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });

      return roles.map(role => this.mapPrismaToRole(role));
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
      const createdPermission = await this.prisma.permission.create({
        data: {
          tenantId: permission.tenantId!,
          resource: permission.resource!,
          action: permission.action!,
          scope: permission.scope || PermissionScope.OWN,
          description: permission.description,
          isActive: permission.isActive !== undefined ? permission.isActive : true,
        },
      });

      return this.mapPrismaToPermission(createdPermission);
    } catch (error: any) {
      console.error('Error creating permission:', error);
      throw error;
    }
  }

  async updatePermission(permissionId: string, updates: Partial<Permission>): Promise<Permission> {
    try {
      const updatedPermission = await this.prisma.permission.update({
        where: { id: permissionId },
        data: {
          ...(updates.resource && { resource: updates.resource }),
          ...(updates.action && { action: updates.action }),
          ...(updates.scope && { scope: updates.scope }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.isActive !== undefined && { isActive: updates.isActive }),
        },
      });

      return this.mapPrismaToPermission(updatedPermission);
    } catch (error: any) {
      console.error('Error updating permission:', error);
      throw error;
    }
  }

  async deletePermission(permissionId: string): Promise<boolean> {
    try {
      await this.prisma.permission.delete({
        where: { id: permissionId },
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting permission:', error);
      return false;
    }
  }

  async getPermission(permissionId: string): Promise<Permission | null> {
    try {
      const permission = await this.prisma.permission.findUnique({
        where: { id: permissionId },
        include: {
          rolePermissions: {
            include: {
              role: true,
            },
          },
        },
      });

      return permission ? this.mapPrismaToPermission(permission) : null;
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
      const where: any = { tenantId };

      if (filters?.resource) where.resource = filters.resource;
      if (filters?.action) where.action = filters.action;
      if (filters?.scope) where.scope = filters.scope;
      if (filters?.isActive !== undefined) where.isActive = filters.isActive;

      const permissions = await this.prisma.permission.findMany({
        where,
        include: {
          rolePermissions: {
            include: {
              role: true,
            },
          },
        },
        orderBy: [{ resource: 'asc' }, { action: 'asc' }],
      });

      return permissions.map(permission => this.mapPrismaToPermission(permission));
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
      const rolePermission = await this.prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
        update: {
          isGranted,
          conditions: conditions || null,
        },
        create: {
          roleId,
          permissionId,
          isGranted,
          conditions: conditions || null,
        },
        include: {
          role: true,
          permission: true,
        },
      });

      return this.mapPrismaToRolePermission(rolePermission);
    } catch (error: any) {
      console.error('Error assigning permission to role:', error);
      throw error;
    }
  }

  async revokePermissionFromRole(roleId: string, permissionId: string): Promise<boolean> {
    try {
      await this.prisma.rolePermission.delete({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
      });

      return true;
    } catch (error: any) {
      console.error('Error revoking permission from role:', error);
      return false;
    }
  }

  async getRolePermissions(roleId: string): Promise<RolePermission[]> {
    try {
      const rolePermissions = await this.prisma.rolePermission.findMany({
        where: { roleId },
        include: {
          role: true,
          permission: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      return rolePermissions.map(rp => this.mapPrismaToRolePermission(rp));
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
      const userRole = await this.prisma.userRole.create({
        data: {
          userId,
          roleId,
          tenantId,
          sellerId,
          isActive: true,
          assignedBy,
          assignedAt: new Date(),
          expiresAt,
        },
        include: {
          user: true,
          role: true,
          tenant: true,
          assignedByUser: true,
        },
      });

      return this.mapPrismaToUserRole(userRole);
    } catch (error: any) {
      console.error('Error assigning role to user:', error);
      throw error;
    }
  }

  async revokeRoleFromUser(userId: string, roleId: string, tenantId: string, sellerId?: string): Promise<boolean> {
    try {
      const where: any = {
        userId,
        roleId,
        tenantId,
      };

      if (sellerId) where.sellerId = sellerId;

      await this.prisma.userRole.updateMany({
        where,
        data: { isActive: false },
      });

      return true;
    } catch (error: any) {
      console.error('Error revoking role from user:', error);
      return false;
    }
  }

  async getUserRoles(userId: string, tenantId: string): Promise<UserRole[]> {
    try {
      const userRoles = await this.prisma.userRole.findMany({
        where: {
          userId,
          tenantId,
          isActive: true,
        },
        include: {
          user: true,
          role: true,
          tenant: true,
          assignedByUser: true,
        },
        orderBy: { assignedAt: 'desc' },
      });

      return userRoles.map(ur => this.mapPrismaToUserRole(ur));
    } catch (error: any) {
      console.error('Error getting user roles:', error);
      return [];
    }
  }

  async getUserPermissions(userId: string, tenantId: string): Promise<UserPermissions> {
    try {
      // Get user roles
      const userRoles = await this.getUserRoles(userId, tenantId);
      const roles = userRoles.map(ur => ur.role!).filter(Boolean);

      // Get all permissions for these roles
      const roleIds = roles.map(r => r.id);
      const rolePermissions = await this.prisma.rolePermission.findMany({
        where: {
          roleId: { in: roleIds },
          isGranted: true,
        },
        include: {
          role: true,
          permission: true,
        },
      });

      const permissions = rolePermissions.map(rp => rp.permission!).filter(Boolean);

      // Calculate effective permissions
      const effectivePermissions = rolePermissions.map(rp => ({
        resource: rp.permission!.resource,
        action: rp.permission!.action,
        scope: rp.permission!.scope,
        allowed: rp.isGranted,
        conditions: rp.conditions,
      }));

      return {
        userId,
        tenantId,
        roles,
        permissions,
        effectivePermissions,
      };
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
      const { userId, tenantId, resource, action, resourceId, sellerId, context } = check;

      // Get user permissions
      const userPermissions = await this.getUserPermissions(userId, tenantId);

      // Find matching permissions
      const matchingPermissions = userPermissions.effectivePermissions.filter(ep => 
        ep.resource === resource && 
        ep.action === action &&
        ep.allowed
      );

      if (matchingPermissions.length === 0) {
        return {
          allowed: false,
          reason: 'No matching permissions found',
        };
      }

      // Check scope and conditions
      for (const permission of matchingPermissions) {
        // Check scope
        if (permission.scope === PermissionScope.OWN) {
          // For own scope, check if user owns the resource
          if (sellerId && context?.sellerId && context.sellerId !== sellerId) {
            continue; // User doesn't own this resource
          }
        } else if (permission.scope === PermissionScope.TENANT) {
          // Tenant scope - check if user has tenant access
          if (context?.tenantId && context.tenantId !== tenantId) {
            continue; // User doesn't have access to this tenant
          }
        }

        // Check additional conditions
        if (permission.conditions) {
          const conditionsMet = this.evaluateConditions(permission.conditions, {
            userId,
            tenantId,
            resourceId,
            sellerId,
            ...context,
          });

          if (!conditionsMet) {
            continue; // Conditions not met
          }
        }

        return {
          allowed: true,
          conditions: permission.conditions,
          rolePermissions: matchingPermissions,
        };
      }

      return {
        allowed: false,
        reason: 'Permission conditions not met',
      };
    } catch (error: any) {
      console.error('Error checking permission:', error);
      return { allowed: false, reason: 'Permission check failed' };
    }
  }

  async hasPermission(userId: string, tenantId: string, resource: string, action: string, resourceId?: string, sellerId?: string): Promise<boolean> {
    try {
      const result = await this.checkPermission({
        userId,
        tenantId,
        resource,
        action,
        resourceId,
        sellerId,
      });

      return result.allowed;
    } catch (error: any) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  async canAccessResource(userId: string, tenantId: string, resource: string, resourceId?: string, sellerId?: string): Promise<boolean> {
    try {
      // Check if user has any permission for this resource
      const userPermissions = await this.getUserPermissions(userId, tenantId);
      
      const hasResourceAccess = userPermissions.effectivePermissions.some(ep => 
        ep.resource === resource && ep.allowed
      );

      return hasResourceAccess;
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
      const auditLog = await this.prisma.auditLog.create({
        data: {
          tenantId: request.tenantId,
          userId: request.userId,
          sessionId: request.sessionId,
          action: request.action,
          resource: request.resource,
          resourceId: request.resourceId,
          oldValues: request.oldValues || null,
          newValues: request.newValues || null,
          ipAddress: request.ipAddress,
          userAgent: request.userAgent,
          requestId: request.requestId,
          endpoint: request.endpoint,
          method: request.method,
          success: request.success !== undefined ? request.success : true,
          errorMessage: request.errorMessage,
          statusCode: request.statusCode,
          metadata: request.metadata || null,
        },
      });

      return this.mapPrismaToAuditLog(auditLog);
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
      const where: any = { tenantId };

      if (filters?.userId) where.userId = filters.userId;
      if (filters?.action) where.action = filters.action;
      if (filters?.resource) where.resource = filters.resource;
      if (filters?.success !== undefined) where.success = filters.success;
      if (filters?.startDate || filters?.endDate) {
        where.createdAt = {};
        if (filters.startDate) where.createdAt.gte = filters.startDate;
        if (filters.endDate) where.createdAt.lte = filters.endDate;
      }

      const [logs, total] = await Promise.all([
        this.prisma.auditLog.findMany({
          where,
          take: filters?.limit || 100,
          skip: filters?.offset || 0,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.auditLog.count({ where }),
      ]);

      return {
        logs: logs.map(log => this.mapPrismaToAuditLog(log)),
        total,
      };
    } catch (error: any) {
      console.error('Error getting audit logs:', error);
      return { logs: [], total: 0 };
    }
  }

  // ===========================================
  // SYSTEM INITIALIZATION
  // ===========================================

  async initializeSystemRoles(tenantId: string): Promise<void> {
    // This is handled by the service layer
    return Promise.resolve();
  }

  async initializeSystemPermissions(tenantId: string): Promise<void> {
    // This is handled by the service layer
    return Promise.resolve();
  }

  async seedDefaultRolesAndPermissions(tenantId: string): Promise<void> {
    // This is handled by the service layer
    return Promise.resolve();
  }

  // ===========================================
  // HEALTH CHECK
  // ===========================================

  async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  private evaluateConditions(conditions: Record<string, any>, context: Record<string, any>): boolean {
    try {
      // Simple condition evaluation
      // In a real implementation, this would use a more sophisticated rule engine
      for (const [key, value] of Object.entries(conditions)) {
        if (context[key] !== value) {
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error evaluating conditions:', error);
      return false;
    }
  }

  private mapPrismaToRole(prismaRole: any): Role {
    return {
      id: prismaRole.id,
      tenantId: prismaRole.tenantId,
      name: prismaRole.name,
      displayName: prismaRole.displayName,
      description: prismaRole.description,
      isSystem: prismaRole.isSystem,
      isActive: prismaRole.isActive,
      parentRoleId: prismaRole.parentRoleId,
      parentRole: prismaRole.parentRole ? this.mapPrismaToRole(prismaRole.parentRole) : undefined,
      childRoles: prismaRole.childRoles?.map((cr: any) => this.mapPrismaToRole(cr)),
      permissions: prismaRole.permissions?.map((rp: any) => this.mapPrismaToRolePermission(rp)),
      userRoles: prismaRole.userRoles?.map((ur: any) => this.mapPrismaToUserRole(ur)),
      createdAt: prismaRole.createdAt,
      updatedAt: prismaRole.updatedAt,
    };
  }

  private mapPrismaToPermission(prismaPermission: any): Permission {
    return {
      id: prismaPermission.id,
      tenantId: prismaPermission.tenantId,
      resource: prismaPermission.resource,
      action: prismaPermission.action,
      scope: prismaPermission.scope,
      description: prismaPermission.description,
      isActive: prismaPermission.isActive,
      rolePermissions: prismaPermission.rolePermissions?.map((rp: any) => this.mapPrismaToRolePermission(rp)),
      createdAt: prismaPermission.createdAt,
      updatedAt: prismaPermission.updatedAt,
    };
  }

  private mapPrismaToRolePermission(prismaRolePermission: any): RolePermission {
    return {
      id: prismaRolePermission.id,
      roleId: prismaRolePermission.roleId,
      permissionId: prismaRolePermission.permissionId,
      isGranted: prismaRolePermission.isGranted,
      conditions: prismaRolePermission.conditions,
      role: prismaRolePermission.role ? this.mapPrismaToRole(prismaRolePermission.role) : undefined,
      permission: prismaRolePermission.permission ? this.mapPrismaToPermission(prismaRolePermission.permission) : undefined,
      createdAt: prismaRolePermission.createdAt,
      updatedAt: prismaRolePermission.updatedAt,
    };
  }

  private mapPrismaToUserRole(prismaUserRole: any): UserRole {
    return {
      id: prismaUserRole.id,
      userId: prismaUserRole.userId,
      roleId: prismaUserRole.roleId,
      tenantId: prismaUserRole.tenantId,
      sellerId: prismaUserRole.sellerId,
      isActive: prismaUserRole.isActive,
      assignedBy: prismaUserRole.assignedBy,
      assignedAt: prismaUserRole.assignedAt,
      expiresAt: prismaUserRole.expiresAt,
      user: prismaUserRole.user ? this.mapPrismaToUser(prismaUserRole.user) : undefined,
      role: prismaUserRole.role ? this.mapPrismaToRole(prismaUserRole.role) : undefined,
      tenant: prismaUserRole.tenant ? this.mapPrismaToTenant(prismaUserRole.tenant) : undefined,
      assignedByUser: prismaUserRole.assignedByUser ? this.mapPrismaToUser(prismaUserRole.assignedByUser) : undefined,
      createdAt: prismaUserRole.createdAt,
      updatedAt: prismaUserRole.updatedAt,
    };
  }

  private mapPrismaToAuditLog(prismaAuditLog: any): AuditLog {
    return {
      id: prismaAuditLog.id,
      tenantId: prismaAuditLog.tenantId,
      userId: prismaAuditLog.userId,
      sessionId: prismaAuditLog.sessionId,
      action: prismaAuditLog.action,
      resource: prismaAuditLog.resource,
      resourceId: prismaAuditLog.resourceId,
      oldValues: prismaAuditLog.oldValues,
      newValues: prismaAuditLog.newValues,
      ipAddress: prismaAuditLog.ipAddress,
      userAgent: prismaAuditLog.userAgent,
      requestId: prismaAuditLog.requestId,
      endpoint: prismaAuditLog.endpoint,
      method: prismaAuditLog.method,
      success: prismaAuditLog.success,
      errorMessage: prismaAuditLog.errorMessage,
      statusCode: prismaAuditLog.statusCode,
      metadata: prismaAuditLog.metadata,
      createdAt: prismaAuditLog.createdAt,
    };
  }

  private mapPrismaToUser(prismaUser: any): User {
    return {
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      role: prismaUser.role,
      accounts: prismaUser.accounts,
      sessions: prismaUser.sessions,
      userRoles: prismaUser.userRoles?.map((ur: any) => this.mapPrismaToUserRole(ur)),
      assignedRoles: prismaUser.assignedRoles?.map((ur: any) => this.mapPrismaToUserRole(ur)),
      auditLogs: prismaUser.auditLogs?.map((al: any) => this.mapPrismaToAuditLog(al)),
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    };
  }

  private mapPrismaToTenant(prismaTenant: any): Tenant {
    return {
      id: prismaTenant.id,
      name: prismaTenant.name,
      domain: prismaTenant.domain,
      settings: prismaTenant.settings,
      roles: prismaTenant.roles?.map((r: any) => this.mapPrismaToRole(r)),
      permissions: prismaTenant.permissions?.map((p: any) => this.mapPrismaToPermission(p)),
      userRoles: prismaTenant.userRoles?.map((ur: any) => this.mapPrismaToUserRole(ur)),
      auditLogs: prismaTenant.auditLogs?.map((al: any) => this.mapPrismaToAuditLog(al)),
      createdAt: prismaTenant.createdAt,
      updatedAt: prismaTenant.updatedAt,
    };
  }
}

