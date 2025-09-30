/**
 * Seller RBAC API Routes
 * Handles seller-specific role management and permissions
 */

import { Router } from 'express';
import { z } from 'zod';
import { SellerRBACService } from '@tdc/domain';
import { RBACService } from '@tdc/domain';
import { RBACAdapter } from '@tdc/infra';
import { PrismaClient } from '@prisma/client';
import { PolicyGuard } from '@tdc/domain';

const router = Router();
const prisma = new PrismaClient();
const rbacAdapter = new RBACAdapter(prisma);
const rbacService = new RBACService(rbacAdapter);
const sellerRbacService = new SellerRBACService(rbacService);

// ===========================================
// VALIDATION SCHEMAS
// ===========================================

const AssignSellerRoleSchema = z.object({
  userId: z.string(),
  sellerId: z.string(),
  roleName: z.enum(['seller_owner', 'seller_staff']),
  expiresAt: z.string().datetime().optional(),
});

const SellerTeamQuerySchema = z.object({
  sellerId: z.string(),
});

const SellerPermissionCheckSchema = z.object({
  userId: z.string(),
  sellerId: z.string(),
  permission: z.enum(['manage_account', 'manage_products', 'view_analytics', 'manage_orders', 'invite_staff', 'remove_staff']),
});

// ===========================================
// SELLER ROLE MANAGEMENT ENDPOINTS
// ===========================================

/**
 * POST /api/seller-rbac/assign-role
 * Assign seller role to user
 */
router.post('/assign-role', PolicyGuard.adminOnly(), async (req, res) => {
  try {
    const input = AssignSellerRoleSchema.parse(req.body);
    const tenantId = req.user?.tenantId || 'default-tenant';
    const assignedBy = req.user?.id;

    // Validate role assignment
    const validation = await sellerRbacService.validateSellerRoleAssignment(
      input.userId,
      tenantId,
      input.sellerId,
      input.roleName,
      assignedBy
    );

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.reason,
        warnings: validation.warnings,
      });
    }

    let userRole;
    const expiresAt = input.expiresAt ? new Date(input.expiresAt) : undefined;

    if (input.roleName === 'seller_owner') {
      userRole = await sellerRbacService.assignSellerOwnerRole(
        input.userId,
        tenantId,
        input.sellerId,
        assignedBy
      );
    } else if (input.roleName === 'seller_staff') {
      userRole = await sellerRbacService.assignSellerStaffRole(
        input.userId,
        tenantId,
        input.sellerId,
        assignedBy,
        expiresAt
      );
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid role name',
      });
    }

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
        roleName: input.roleName,
        warnings: validation.warnings,
      },
    });
  } catch (error: any) {
    console.error('Error assigning seller role:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/seller-rbac/revoke-role
 * Revoke seller role from user
 */
router.delete('/revoke-role', PolicyGuard.adminOnly(), async (req, res) => {
  try {
    const { userId, sellerId } = req.query;
    const tenantId = req.user?.tenantId || 'default-tenant';

    if (!userId || !sellerId) {
      return res.status(400).json({
        success: false,
        error: 'userId and sellerId are required',
      });
    }

    const success = await sellerRbacService.revokeAllSellerRoles(
      userId as string,
      tenantId,
      sellerId as string
    );

    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to revoke seller roles',
      });
    }

    res.json({
      success: true,
      message: 'Seller roles revoked successfully',
    });
  } catch (error: any) {
    console.error('Error revoking seller role:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/seller-rbac/team/:sellerId
 * Get seller team members
 */
router.get('/team/:sellerId', PolicyGuard.adminOnly(), async (req, res) => {
  try {
    const { sellerId } = req.params;
    const tenantId = req.user?.tenantId || 'default-tenant';

    const teamMembers = await sellerRbacService.getSellerTeamMembers(tenantId, sellerId);

    res.json({
      success: true,
      data: {
        sellerId,
        owner: teamMembers.owner ? {
          id: teamMembers.owner.id,
          userId: teamMembers.owner.userId,
          roleId: teamMembers.owner.roleId,
          isActive: teamMembers.owner.isActive,
          assignedAt: teamMembers.owner.assignedAt,
          expiresAt: teamMembers.owner.expiresAt,
          user: teamMembers.owner.user ? {
            id: teamMembers.owner.user.id,
            name: teamMembers.owner.user.name,
            email: teamMembers.owner.user.email,
          } : null,
        } : null,
        staff: teamMembers.staff.map(staff => ({
          id: staff.id,
          userId: staff.userId,
          roleId: staff.roleId,
          isActive: staff.isActive,
          assignedAt: staff.assignedAt,
          expiresAt: staff.expiresAt,
          user: staff.user ? {
            id: staff.user.id,
            name: staff.user.name,
            email: staff.user.email,
          } : null,
        })),
        totalMembers: 1 + teamMembers.staff.length, // owner + staff
      },
    });
  } catch (error: any) {
    console.error('Error getting seller team members:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// SELLER PERMISSION CHECK ENDPOINTS
// ===========================================

/**
 * POST /api/seller-rbac/check-permission
 * Check seller-specific permission
 */
router.post('/check-permission', async (req, res) => {
  try {
    const input = SellerPermissionCheckSchema.parse(req.body);
    const tenantId = req.user?.tenantId || 'default-tenant';

    let hasPermission = false;
    let reason = '';

    switch (input.permission) {
      case 'manage_account':
        hasPermission = await sellerRbacService.canManageSellerAccount(
          input.userId,
          tenantId,
          input.sellerId
        );
        reason = hasPermission ? 'User can manage seller account' : 'User cannot manage seller account';
        break;

      case 'manage_products':
        hasPermission = await sellerRbacService.canManageSellerProducts(
          input.userId,
          tenantId,
          input.sellerId
        );
        reason = hasPermission ? 'User can manage seller products' : 'User cannot manage seller products';
        break;

      case 'view_analytics':
        hasPermission = await sellerRbacService.canViewSellerAnalytics(
          input.userId,
          tenantId,
          input.sellerId
        );
        reason = hasPermission ? 'User can view seller analytics' : 'User cannot view seller analytics';
        break;

      case 'manage_orders':
        hasPermission = await sellerRbacService.canManageSellerOrders(
          input.userId,
          tenantId,
          input.sellerId
        );
        reason = hasPermission ? 'User can manage seller orders' : 'User cannot manage seller orders';
        break;

      case 'invite_staff':
        hasPermission = await sellerRbacService.canInviteSellerStaff(
          input.userId,
          tenantId,
          input.sellerId
        );
        reason = hasPermission ? 'User can invite seller staff' : 'User cannot invite seller staff';
        break;

      case 'remove_staff':
        hasPermission = await sellerRbacService.canRemoveSellerStaff(
          input.userId,
          tenantId,
          input.sellerId,
          req.body.targetUserId || ''
        );
        reason = hasPermission ? 'User can remove seller staff' : 'User cannot remove seller staff';
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid permission type',
        });
    }

    res.json({
      success: true,
      data: {
        hasPermission,
        reason,
        userId: input.userId,
        sellerId: input.sellerId,
        permission: input.permission,
      },
    });
  } catch (error: any) {
    console.error('Error checking seller permission:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/seller-rbac/permissions/:roleName
 * Get seller role permissions
 */
router.get('/permissions/:roleName', PolicyGuard.adminOnly(), async (req, res) => {
  try {
    const { roleName } = req.params;

    if (!['seller_owner', 'seller_staff'].includes(roleName)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role name. Must be seller_owner or seller_staff',
      });
    }

    const permissions = await sellerRbacService.getSellerPermissions(roleName);

    res.json({
      success: true,
      data: {
        roleName,
        permissions,
        totalPermissions: permissions.length,
      },
    });
  } catch (error: any) {
    console.error('Error getting seller permissions:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// SELLER ROLE VALIDATION ENDPOINTS
// ===========================================

/**
 * POST /api/seller-rbac/validate-assignment
 * Validate seller role assignment
 */
router.post('/validate-assignment', PolicyGuard.adminOnly(), async (req, res) => {
  try {
    const input = AssignSellerRoleSchema.parse(req.body);
    const tenantId = req.user?.tenantId || 'default-tenant';
    const assignedBy = req.user?.id;

    const validation = await sellerRbacService.validateSellerRoleAssignment(
      input.userId,
      tenantId,
      input.sellerId,
      input.roleName,
      assignedBy
    );

    res.json({
      success: true,
      data: {
        valid: validation.valid,
        reason: validation.reason,
        warnings: validation.warnings,
        userId: input.userId,
        sellerId: input.sellerId,
        roleName: input.roleName,
      },
    });
  } catch (error: any) {
    console.error('Error validating seller role assignment:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// SELLER ROLE STATISTICS ENDPOINTS
// ===========================================

/**
 * GET /api/seller-rbac/stats
 * Get seller role statistics
 */
router.get('/stats', PolicyGuard.adminOnly(), async (req, res) => {
  try {
    const tenantId = req.user?.tenantId || 'default-tenant';

    const stats = await sellerRbacService.getSellerRoleStats(tenantId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Error getting seller role stats:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// SELLER ROLE COMPARISON ENDPOINTS
// ===========================================

/**
 * GET /api/seller-rbac/compare-roles
 * Compare seller owner vs staff permissions
 */
router.get('/compare-roles', PolicyGuard.adminOnly(), async (req, res) => {
  try {
    const [ownerPermissions, staffPermissions] = await Promise.all([
      sellerRbacService.getSellerPermissions('seller_owner'),
      sellerRbacService.getSellerPermissions('seller_staff'),
    ]);

    const comparison = {
      seller_owner: {
        permissions: ownerPermissions,
        totalPermissions: ownerPermissions.length,
        capabilities: [
          'Full product management (create, read, update, delete)',
          'Order management and processing',
          'Analytics access and export',
          'Team management (invite/remove staff)',
          'Role assignment and management',
          'Account settings and configuration',
        ],
      },
      seller_staff: {
        permissions: staffPermissions,
        totalPermissions: staffPermissions.length,
        capabilities: [
          'Limited product management (create, read, update)',
          'Order viewing only',
          'Analytics viewing only',
          'No team management',
          'No role assignment',
          'No account settings',
        ],
      },
      differences: {
        additionalOwnerPermissions: ownerPermissions.filter(
          ownerPerm => !staffPermissions.some(
            staffPerm => staffPerm.resource === ownerPerm.resource && 
                        staffPerm.action === ownerPerm.action
          )
        ),
        sharedPermissions: ownerPermissions.filter(
          ownerPerm => staffPermissions.some(
            staffPerm => staffPerm.resource === ownerPerm.resource && 
                        staffPerm.action === ownerPerm.action
          )
        ),
      },
    };

    res.json({
      success: true,
      data: comparison,
    });
  } catch (error: any) {
    console.error('Error comparing seller roles:', error);
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
 * GET /api/seller-rbac/health
 * Health check for seller RBAC service
 */
router.get('/health', async (req, res) => {
  try {
    const isHealthy = await rbacService.healthCheck();
    
    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      data: {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'seller-rbac',
        features: [
          'seller_owner_role_management',
          'seller_staff_role_management',
          'permission_validation',
          'team_management',
          'role_comparison',
        ],
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

