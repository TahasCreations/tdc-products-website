/**
 * RBAC API Routes
 * Handles role-based access control and audit logging
 */

import { Router } from 'express';
import { z } from 'zod';
import { RBACService } from '@tdc/domain';
import { RBACAdapter } from '@tdc/infra';
import { PrismaClient } from '@prisma/client';
import { PolicyGuard, productGuard, orderGuard, analyticsGuard, moderationGuard, userGuard, roleGuard, auditGuard } from '@tdc/domain';

const router = Router();
const prisma = new PrismaClient();
const rbacAdapter = new RBACAdapter(prisma);
const rbacService = new RBACService(rbacAdapter);

// ===========================================
// VALIDATION SCHEMAS
// ===========================================

const CreateRoleSchema = z.object({
  name: z.string().min(1).max(50),
  displayName: z.string().min(1).max(100),
  description: z.string().optional(),
  isSystem: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  parentRoleId: z.string().optional(),
});

const UpdateRoleSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  parentRoleId: z.string().optional(),
});

const CreatePermissionSchema = z.object({
  resource: z.string().min(1).max(50),
  action: z.string().min(1).max(50),
  scope: z.enum(['OWN', 'TENANT', 'GLOBAL']).optional().default('OWN'),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

const UpdatePermissionSchema = z.object({
  resource: z.string().min(1).max(50).optional(),
  action: z.string().min(1).max(50).optional(),
  scope: z.enum(['OWN', 'TENANT', 'GLOBAL']).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

const AssignRoleSchema = z.object({
  userId: z.string(),
  roleId: z.string(),
  sellerId: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
});

const AssignPermissionSchema = z.object({
  roleId: z.string(),
  permissionId: z.string(),
  isGranted: z.boolean().optional().default(true),
  conditions: z.record(z.any()).optional(),
});

const CheckPermissionSchema = z.object({
  userId: z.string(),
  resource: z.string(),
  action: z.string(),
  resourceId: z.string().optional(),
  sellerId: z.string().optional(),
});

// ===========================================
// ROLE MANAGEMENT ENDPOINTS
// ===========================================

/**
 * POST /api/rbac/roles
 * Create a new role
 */
router.post('/roles', roleGuard.create(), async (req, res) => {
  try {
    const input = CreateRoleSchema.parse(req.body);
    const tenantId = req.user?.tenantId || 'default-tenant';
    
    const role = await rbacService.createRole({
      ...input,
      tenantId,
    });

    res.json({
      success: true,
      data: {
        id: role.id,
        name: role.name,
        displayName: role.displayName,
        description: role.description,
        isSystem: role.isSystem,
        isActive: role.isActive,
        createdAt: role.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error creating role:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/rbac/roles
 * Get all roles
 */
router.get('/roles', roleGuard.read(), async (req, res) => {
  try {
    const tenantId = req.user?.tenantId || 'default-tenant';
    const { isSystem, isActive, name } = req.query;
    
    const roles = await rbacService.getRoles(tenantId, {
      isSystem: isSystem ? isSystem === 'true' : undefined,
      isActive: isActive ? isActive === 'true' : undefined,
      name: name as string,
    });

    res.json({
      success: true,
      data: roles.map(role => ({
        id: role.id,
        name: role.name,
        displayName: role.displayName,
        description: role.description,
        isSystem: role.isSystem,
        isActive: role.isActive,
        parentRoleId: role.parentRoleId,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      })),
    });
  } catch (error: any) {
    console.error('Error getting roles:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/rbac/roles/:roleId
 * Get a specific role
 */
router.get('/roles/:roleId', roleGuard.read(), async (req, res) => {
  try {
    const { roleId } = req.params;
    
    const role = await rbacService.getRole(roleId);

    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    res.json({
      success: true,
      data: role,
    });
  } catch (error: any) {
    console.error('Error getting role:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/rbac/roles/:roleId
 * Update a role
 */
router.put('/roles/:roleId', roleGuard.update(), async (req, res) => {
  try {
    const { roleId } = req.params;
    const input = UpdateRoleSchema.parse(req.body);
    
    const role = await rbacService.updateRole(roleId, input);

    res.json({
      success: true,
      data: {
        id: role.id,
        name: role.name,
        displayName: role.displayName,
        description: role.description,
        isSystem: role.isSystem,
        isActive: role.isActive,
        updatedAt: role.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error updating role:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/rbac/roles/:roleId
 * Delete a role
 */
router.delete('/roles/:roleId', roleGuard.delete(), async (req, res) => {
  try {
    const { roleId } = req.params;
    
    const success = await rbacService.deleteRole(roleId);

    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to delete role',
      });
    }

    res.json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting role:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// PERMISSION MANAGEMENT ENDPOINTS
// ===========================================

/**
 * POST /api/rbac/permissions
 * Create a new permission
 */
router.post('/permissions', roleGuard.create(), async (req, res) => {
  try {
    const input = CreatePermissionSchema.parse(req.body);
    const tenantId = req.user?.tenantId || 'default-tenant';
    
    const permission = await rbacService.createPermission({
      ...input,
      tenantId,
    });

    res.json({
      success: true,
      data: {
        id: permission.id,
        resource: permission.resource,
        action: permission.action,
        scope: permission.scope,
        description: permission.description,
        isActive: permission.isActive,
        createdAt: permission.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error creating permission:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/rbac/permissions
 * Get all permissions
 */
router.get('/permissions', roleGuard.read(), async (req, res) => {
  try {
    const tenantId = req.user?.tenantId || 'default-tenant';
    const { resource, action, scope, isActive } = req.query;
    
    const permissions = await rbacService.getPermissions(tenantId, {
      resource: resource as string,
      action: action as string,
      scope: scope as any,
      isActive: isActive ? isActive === 'true' : undefined,
    });

    res.json({
      success: true,
      data: permissions.map(permission => ({
        id: permission.id,
        resource: permission.resource,
        action: permission.action,
        scope: permission.scope,
        description: permission.description,
        isActive: permission.isActive,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      })),
    });
  } catch (error: any) {
    console.error('Error getting permissions:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/rbac/permissions/:permissionId
 * Get a specific permission
 */
router.get('/permissions/:permissionId', roleGuard.read(), async (req, res) => {
  try {
    const { permissionId } = req.params;
    
    const permission = await rbacService.getPermission(permissionId);

    if (!permission) {
      return res.status(404).json({
        success: false,
        error: 'Permission not found',
      });
    }

    res.json({
      success: true,
      data: permission,
    });
  } catch (error: any) {
    console.error('Error getting permission:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/rbac/permissions/:permissionId
 * Update a permission
 */
router.put('/permissions/:permissionId', roleGuard.update(), async (req, res) => {
  try {
    const { permissionId } = req.params;
    const input = UpdatePermissionSchema.parse(req.body);
    
    const permission = await rbacService.updatePermission(permissionId, input);

    res.json({
      success: true,
      data: {
        id: permission.id,
        resource: permission.resource,
        action: permission.action,
        scope: permission.scope,
        description: permission.description,
        isActive: permission.isActive,
        updatedAt: permission.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error updating permission:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/rbac/permissions/:permissionId
 * Delete a permission
 */
router.delete('/permissions/:permissionId', roleGuard.delete(), async (req, res) => {
  try {
    const { permissionId } = req.params;
    
    const success = await rbacService.deletePermission(permissionId);

    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to delete permission',
      });
    }

    res.json({
      success: true,
      message: 'Permission deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting permission:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// ROLE-PERMISSION MANAGEMENT ENDPOINTS
// ===========================================

/**
 * POST /api/rbac/roles/:roleId/permissions
 * Assign permission to role
 */
router.post('/roles/:roleId/permissions', roleGuard.assign(), async (req, res) => {
  try {
    const { roleId } = req.params;
    const input = AssignPermissionSchema.parse(req.body);
    
    const rolePermission = await rbacService.assignPermissionToRole(
      roleId,
      input.permissionId,
      input.isGranted,
      input.conditions
    );

    res.json({
      success: true,
      data: {
        id: rolePermission.id,
        roleId: rolePermission.roleId,
        permissionId: rolePermission.permissionId,
        isGranted: rolePermission.isGranted,
        conditions: rolePermission.conditions,
        createdAt: rolePermission.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error assigning permission to role:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/rbac/roles/:roleId/permissions/:permissionId
 * Revoke permission from role
 */
router.delete('/roles/:roleId/permissions/:permissionId', roleGuard.revoke(), async (req, res) => {
  try {
    const { roleId, permissionId } = req.params;
    
    const success = await rbacService.revokePermissionFromRole(roleId, permissionId);

    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to revoke permission from role',
      });
    }

    res.json({
      success: true,
      message: 'Permission revoked from role successfully',
    });
  } catch (error: any) {
    console.error('Error revoking permission from role:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/rbac/roles/:roleId/permissions
 * Get role permissions
 */
router.get('/roles/:roleId/permissions', roleGuard.read(), async (req, res) => {
  try {
    const { roleId } = req.params;
    
    const rolePermissions = await rbacService.getRolePermissions(roleId);

    res.json({
      success: true,
      data: rolePermissions.map(rp => ({
        id: rp.id,
        roleId: rp.roleId,
        permissionId: rp.permissionId,
        isGranted: rp.isGranted,
        conditions: rp.conditions,
        permission: rp.permission ? {
          id: rp.permission.id,
          resource: rp.permission.resource,
          action: rp.permission.action,
          scope: rp.permission.scope,
          description: rp.permission.description,
        } : null,
        createdAt: rp.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Error getting role permissions:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// USER-ROLE MANAGEMENT ENDPOINTS
// ===========================================

/**
 * POST /api/rbac/users/:userId/roles
 * Assign role to user
 */
router.post('/users/:userId/roles', roleGuard.assign(), async (req, res) => {
  try {
    const { userId } = req.params;
    const input = AssignRoleSchema.parse(req.body);
    const tenantId = req.user?.tenantId || 'default-tenant';
    const assignedBy = req.user?.id;
    
    const expiresAt = input.expiresAt ? new Date(input.expiresAt) : undefined;
    
    const userRole = await rbacService.assignRoleToUser(
      userId,
      input.roleId,
      tenantId,
      input.sellerId,
      assignedBy,
      expiresAt
    );

    res.json({
      success: true,
      data: {
        id: userRole.id,
        userId: userRole.userId,
        roleId: userRole.roleId,
        sellerId: userRole.sellerId,
        isActive: userRole.isActive,
        assignedBy: userRole.assignedBy,
        assignedAt: userRole.assignedAt,
        expiresAt: userRole.expiresAt,
        createdAt: userRole.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error assigning role to user:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/rbac/users/:userId/roles/:roleId
 * Revoke role from user
 */
router.delete('/users/:userId/roles/:roleId', roleGuard.revoke(), async (req, res) => {
  try {
    const { userId, roleId } = req.params;
    const tenantId = req.user?.tenantId || 'default-tenant';
    const { sellerId } = req.query;
    
    const success = await rbacService.revokeRoleFromUser(
      userId,
      roleId,
      tenantId,
      sellerId as string
    );

    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to revoke role from user',
      });
    }

    res.json({
      success: true,
      message: 'Role revoked from user successfully',
    });
  } catch (error: any) {
    console.error('Error revoking role from user:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/rbac/users/:userId/roles
 * Get user roles
 */
router.get('/users/:userId/roles', roleGuard.read(), async (req, res) => {
  try {
    const { userId } = req.params;
    const tenantId = req.user?.tenantId || 'default-tenant';
    
    const userRoles = await rbacService.getUserRoles(userId, tenantId);

    res.json({
      success: true,
      data: userRoles.map(ur => ({
        id: ur.id,
        userId: ur.userId,
        roleId: ur.roleId,
        sellerId: ur.sellerId,
        isActive: ur.isActive,
        assignedBy: ur.assignedBy,
        assignedAt: ur.assignedAt,
        expiresAt: ur.expiresAt,
        role: ur.role ? {
          id: ur.role.id,
          name: ur.role.name,
          displayName: ur.role.displayName,
          description: ur.role.description,
          isSystem: ur.role.isSystem,
        } : null,
        createdAt: ur.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Error getting user roles:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/rbac/users/:userId/permissions
 * Get user permissions
 */
router.get('/users/:userId/permissions', roleGuard.read(), async (req, res) => {
  try {
    const { userId } = req.params;
    const tenantId = req.user?.tenantId || 'default-tenant';
    
    const userPermissions = await rbacService.getUserPermissions(userId, tenantId);

    res.json({
      success: true,
      data: {
        userId: userPermissions.userId,
        tenantId: userPermissions.tenantId,
        roles: userPermissions.roles.map(role => ({
          id: role.id,
          name: role.name,
          displayName: role.displayName,
          description: role.description,
          isSystem: role.isSystem,
        })),
        permissions: userPermissions.permissions.map(permission => ({
          id: permission.id,
          resource: permission.resource,
          action: permission.action,
          scope: permission.scope,
          description: permission.description,
        })),
        effectivePermissions: userPermissions.effectivePermissions,
      },
    });
  } catch (error: any) {
    console.error('Error getting user permissions:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// PERMISSION CHECKING ENDPOINTS
// ===========================================

/**
 * POST /api/rbac/check-permission
 * Check if user has permission
 */
router.post('/check-permission', async (req, res) => {
  try {
    const input = CheckPermissionSchema.parse(req.body);
    const tenantId = req.user?.tenantId || 'default-tenant';
    
    const result = await rbacService.checkPermission({
      ...input,
      tenantId,
    });

    res.json({
      success: true,
      data: {
        allowed: result.allowed,
        reason: result.reason,
        conditions: result.conditions,
      },
    });
  } catch (error: any) {
    console.error('Error checking permission:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/rbac/check-permission
 * Check if user has permission (GET version)
 */
router.get('/check-permission', async (req, res) => {
  try {
    const { userId, resource, action, resourceId, sellerId } = req.query;
    const tenantId = req.user?.tenantId || 'default-tenant';
    
    if (!userId || !resource || !action) {
      return res.status(400).json({
        success: false,
        error: 'userId, resource, and action are required',
      });
    }

    const hasPermission = await rbacService.hasPermission(
      userId as string,
      tenantId,
      resource as string,
      action as string,
      resourceId as string,
      sellerId as string
    );

    res.json({
      success: true,
      data: {
        hasPermission,
        userId,
        resource,
        action,
        resourceId,
        sellerId,
      },
    });
  } catch (error: any) {
    console.error('Error checking permission:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// AUDIT LOG ENDPOINTS
// ===========================================

/**
 * GET /api/rbac/audit-logs
 * Get audit logs
 */
router.get('/audit-logs', auditGuard.read(), async (req, res) => {
  try {
    const tenantId = req.user?.tenantId || 'default-tenant';
    const { 
      userId, 
      action, 
      resource, 
      startDate, 
      endDate, 
      success, 
      limit, 
      offset 
    } = req.query;
    
    const result = await rbacService.getAuditLogs(tenantId, {
      userId: userId as string,
      action: action as string,
      resource: resource as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      success: success ? success === 'true' : undefined,
      limit: limit ? parseInt(limit as string) : 100,
      offset: offset ? parseInt(offset as string) : 0,
    });

    res.json({
      success: true,
      data: {
        logs: result.logs.map(log => ({
          id: log.id,
          userId: log.userId,
          sessionId: log.sessionId,
          action: log.action,
          resource: log.resource,
          resourceId: log.resourceId,
          ipAddress: log.ipAddress,
          userAgent: log.userAgent,
          requestId: log.requestId,
          endpoint: log.endpoint,
          method: log.method,
          success: log.success,
          errorMessage: log.errorMessage,
          statusCode: log.statusCode,
          metadata: log.metadata,
          createdAt: log.createdAt,
        })),
        total: result.total,
      },
    });
  } catch (error: any) {
    console.error('Error getting audit logs:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// SYSTEM INITIALIZATION ENDPOINTS
// ===========================================

/**
 * POST /api/rbac/initialize
 * Initialize system roles and permissions
 */
router.post('/initialize', PolicyGuard.adminOnly(), async (req, res) => {
  try {
    const tenantId = req.user?.tenantId || 'default-tenant';
    
    await rbacService.seedDefaultRolesAndPermissions(tenantId);

    res.json({
      success: true,
      message: 'System roles and permissions initialized successfully',
    });
  } catch (error: any) {
    console.error('Error initializing system:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// HEALTH CHECK
// ===========================================

/**
 * GET /api/rbac/health
 * Health check for RBAC service
 */
router.get('/health', async (req, res) => {
  try {
    const isHealthy = await rbacService.healthCheck();
    
    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      data: {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'rbac',
      },
    });
  } catch (error: any) {
    res.status(503).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

