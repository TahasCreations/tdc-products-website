/**
 * PolicyGuard Middleware
 * Protects API routes with RBAC permissions and audit logging
 */

import { Request, Response, NextFunction } from 'express';
import { RBACService } from '../services/rbac.service';
import { RBACAdapter } from '@tdc/infra';
import { PrismaClient } from '@prisma/client';
import { RESOURCES, ACTIONS, AuditAction } from '../ports/services/rbac.port';

export interface PolicyGuardOptions {
  resource: string;
  action: string;
  scope?: 'own' | 'tenant' | 'global';
  requireAuth?: boolean;
  auditAction?: string;
  customCheck?: (req: Request, res: Response) => Promise<boolean>;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    tenantId: string;
    sellerId?: string;
    roles?: string[];
  };
  sessionId?: string;
  requestId?: string;
}

export class PolicyGuard {
  private rbacService: RBACService;

  constructor() {
    const prisma = new PrismaClient();
    const rbacAdapter = new RBACAdapter(prisma);
    this.rbacService = new RBACService(rbacAdapter);
  }

  /**
   * Create a policy guard middleware
   */
  static guard(options: PolicyGuardOptions) {
    const policyGuard = new PolicyGuard();
    return policyGuard.createMiddleware(options);
  }

  /**
   * Create middleware for a specific policy
   */
  createMiddleware(options: PolicyGuardOptions) {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        // Extract user information from request
        const userId = req.user?.id;
        const tenantId = req.user?.tenantId;
        const sellerId = req.user?.sellerId || this.extractSellerIdFromRequest(req);

        if (!userId || !tenantId) {
          return this.handleUnauthorized(req, res, 'User not authenticated');
        }

        // Check if custom check is provided
        if (options.customCheck) {
          const customResult = await options.customCheck(req, res);
          if (!customResult) {
            return this.handleForbidden(req, res, 'Custom check failed');
          }
        }

        // Check permission
        const hasPermission = await this.rbacService.hasPermission(
          userId,
          tenantId,
          options.resource,
          options.action,
          this.extractResourceId(req),
          sellerId
        );

        if (!hasPermission) {
          return this.handleForbidden(req, res, `Insufficient permissions for ${options.resource}:${options.action}`);
        }

        // Log audit event
        await this.logAuditEvent(req, res, {
          action: options.auditAction || `${options.action}_${options.resource}`,
          resource: options.resource,
          resourceId: this.extractResourceId(req),
          success: true,
        });

        next();
      } catch (error: any) {
        console.error('PolicyGuard error:', error);
        
        // Log failed audit event
        await this.logAuditEvent(req, res, {
          action: options.auditAction || `${options.action}_${options.resource}`,
          resource: options.resource,
          resourceId: this.extractResourceId(req),
          success: false,
          errorMessage: error.message,
        });

        return this.handleInternalError(req, res, error);
      }
    };
  }

  /**
   * Middleware for seller owner only access
   */
  static sellerOwnerOnly() {
    return PolicyGuard.guard({
      resource: RESOURCES.PRODUCTS,
      action: ACTIONS.MANAGE,
      scope: 'own',
      customCheck: async (req: AuthenticatedRequest) => {
        const rbacService = new RBACService(new RBACAdapter(new PrismaClient()));
        const userId = req.user?.id;
        const tenantId = req.user?.tenantId;
        const sellerId = req.user?.sellerId || PolicyGuard.extractSellerIdFromRequest(req);

        if (!userId || !tenantId || !sellerId) {
          return false;
        }

        return await rbacService.isSellerOwner(userId, tenantId, sellerId);
      },
    });
  }

  /**
   * Middleware for seller staff access
   */
  static sellerStaffOnly() {
    return PolicyGuard.guard({
      resource: RESOURCES.PRODUCTS,
      action: ACTIONS.CREATE,
      scope: 'own',
      customCheck: async (req: AuthenticatedRequest) => {
        const rbacService = new RBACService(new RBACAdapter(new PrismaClient()));
        const userId = req.user?.id;
        const tenantId = req.user?.tenantId;
        const sellerId = req.user?.sellerId || PolicyGuard.extractSellerIdFromRequest(req);

        if (!userId || !tenantId || !sellerId) {
          return false;
        }

        const isOwner = await rbacService.isSellerOwner(userId, tenantId, sellerId);
        const isStaff = await rbacService.isSellerStaff(userId, tenantId, sellerId);

        return isOwner || isStaff;
      },
    });
  }

  /**
   * Middleware for admin only access
   */
  static adminOnly() {
    return PolicyGuard.guard({
      resource: RESOURCES.USERS,
      action: ACTIONS.MANAGE,
      scope: 'tenant',
      customCheck: async (req: AuthenticatedRequest) => {
        const rbacService = new RBACService(new RBACAdapter(new PrismaClient()));
        const userId = req.user?.id;
        const tenantId = req.user?.tenantId;

        if (!userId || !tenantId) {
          return false;
        }

        return await rbacService.isAdmin(userId, tenantId);
      },
    });
  }

  /**
   * Middleware for moderation access
   */
  static moderationAccess() {
    return PolicyGuard.guard({
      resource: RESOURCES.MODERATION,
      action: ACTIONS.READ,
      scope: 'tenant',
      auditAction: 'moderation_access',
    });
  }

  /**
   * Middleware for analytics access
   */
  static analyticsAccess() {
    return PolicyGuard.guard({
      resource: RESOURCES.ANALYTICS,
      action: ACTIONS.READ,
      scope: 'own',
      auditAction: 'analytics_access',
    });
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  private static extractSellerIdFromRequest(req: Request): string | undefined {
    // Extract sellerId from various sources
    return req.params.sellerId || 
           req.query.sellerId as string || 
           req.body.sellerId ||
           req.headers['x-seller-id'] as string;
  }

  private extractSellerIdFromRequest(req: Request): string | undefined {
    return PolicyGuard.extractSellerIdFromRequest(req);
  }

  private extractResourceId(req: Request): string | undefined {
    // Extract resource ID from URL parameters
    const params = Object.keys(req.params);
    if (params.length > 0) {
      const firstParam = params[0];
      return req.params[firstParam];
    }
    return undefined;
  }

  private async logAuditEvent(req: AuthenticatedRequest, res: Response, data: {
    action: string;
    resource: string;
    resourceId?: string;
    success: boolean;
    errorMessage?: string;
  }): Promise<void> {
    try {
      await this.rbacService.logAuditEvent({
        tenantId: req.user?.tenantId || 'unknown',
        userId: req.user?.id,
        sessionId: req.sessionId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        requestId: req.requestId,
        endpoint: req.originalUrl,
        method: req.method,
        success: data.success,
        errorMessage: data.errorMessage,
        statusCode: res.statusCode,
        metadata: {
          userAgent: req.get('User-Agent'),
          referer: req.get('Referer'),
          origin: req.get('Origin'),
        },
      });
    } catch (error) {
      console.error('Error logging audit event:', error);
    }
  }

  private handleUnauthorized(req: AuthenticatedRequest, res: Response, message: string) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message,
      code: 'UNAUTHORIZED',
    });
  }

  private handleForbidden(req: AuthenticatedRequest, res: Response, message: string) {
    res.status(403).json({
      success: false,
      error: 'Forbidden',
      message,
      code: 'FORBIDDEN',
    });
  }

  private handleInternalError(req: AuthenticatedRequest, res: Response, error: any) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An error occurred while checking permissions',
      code: 'INTERNAL_ERROR',
    });
  }
}

// ===========================================
// CONVENIENCE MIDDLEWARE FUNCTIONS
// ===========================================

/**
 * Middleware for product management (create, read, update, delete)
 */
export const productGuard = {
  create: () => PolicyGuard.guard({
    resource: RESOURCES.PRODUCTS,
    action: ACTIONS.CREATE,
    scope: 'own',
    auditAction: 'product_create',
  }),
  
  read: () => PolicyGuard.guard({
    resource: RESOURCES.PRODUCTS,
    action: ACTIONS.READ,
    scope: 'own',
    auditAction: 'product_read',
  }),
  
  update: () => PolicyGuard.guard({
    resource: RESOURCES.PRODUCTS,
    action: ACTIONS.UPDATE,
    scope: 'own',
    auditAction: 'product_update',
  }),
  
  delete: () => PolicyGuard.guard({
    resource: RESOURCES.PRODUCTS,
    action: ACTIONS.DELETE,
    scope: 'own',
    auditAction: 'product_delete',
  }),
  
  manage: () => PolicyGuard.guard({
    resource: RESOURCES.PRODUCTS,
    action: ACTIONS.MANAGE,
    scope: 'tenant',
    auditAction: 'product_manage',
  }),
};

/**
 * Middleware for order management
 */
export const orderGuard = {
  create: () => PolicyGuard.guard({
    resource: RESOURCES.ORDERS,
    action: ACTIONS.CREATE,
    scope: 'own',
    auditAction: 'order_create',
  }),
  
  read: () => PolicyGuard.guard({
    resource: RESOURCES.ORDERS,
    action: ACTIONS.READ,
    scope: 'own',
    auditAction: 'order_read',
  }),
  
  update: () => PolicyGuard.guard({
    resource: RESOURCES.ORDERS,
    action: ACTIONS.UPDATE,
    scope: 'own',
    auditAction: 'order_update',
  }),
  
  manage: () => PolicyGuard.guard({
    resource: RESOURCES.ORDERS,
    action: ACTIONS.MANAGE,
    scope: 'tenant',
    auditAction: 'order_manage',
  }),
};

/**
 * Middleware for analytics access
 */
export const analyticsGuard = {
  read: () => PolicyGuard.guard({
    resource: RESOURCES.ANALYTICS,
    action: ACTIONS.READ,
    scope: 'own',
    auditAction: 'analytics_read',
  }),
  
  export: () => PolicyGuard.guard({
    resource: RESOURCES.ANALYTICS,
    action: ACTIONS.EXPORT,
    scope: 'own',
    auditAction: 'analytics_export',
  }),
  
  manage: () => PolicyGuard.guard({
    resource: RESOURCES.ANALYTICS,
    action: ACTIONS.MANAGE,
    scope: 'tenant',
    auditAction: 'analytics_manage',
  }),
};

/**
 * Middleware for moderation access
 */
export const moderationGuard = {
  read: () => PolicyGuard.guard({
    resource: RESOURCES.MODERATION,
    action: ACTIONS.READ,
    scope: 'tenant',
    auditAction: 'moderation_read',
  }),
  
  update: () => PolicyGuard.guard({
    resource: RESOURCES.MODERATION,
    action: ACTIONS.UPDATE,
    scope: 'tenant',
    auditAction: 'moderation_update',
  }),
  
  approve: () => PolicyGuard.guard({
    resource: RESOURCES.MODERATION,
    action: ACTIONS.APPROVE,
    scope: 'tenant',
    auditAction: 'moderation_approve',
  }),
  
  manage: () => PolicyGuard.guard({
    resource: RESOURCES.MODERATION,
    action: ACTIONS.MANAGE,
    scope: 'tenant',
    auditAction: 'moderation_manage',
  }),
};

/**
 * Middleware for user management
 */
export const userGuard = {
  read: () => PolicyGuard.guard({
    resource: RESOURCES.USERS,
    action: ACTIONS.READ,
    scope: 'tenant',
    auditAction: 'user_read',
  }),
  
  create: () => PolicyGuard.guard({
    resource: RESOURCES.USERS,
    action: ACTIONS.CREATE,
    scope: 'tenant',
    auditAction: 'user_create',
  }),
  
  update: () => PolicyGuard.guard({
    resource: RESOURCES.USERS,
    action: ACTIONS.UPDATE,
    scope: 'tenant',
    auditAction: 'user_update',
  }),
  
  delete: () => PolicyGuard.guard({
    resource: RESOURCES.USERS,
    action: ACTIONS.DELETE,
    scope: 'tenant',
    auditAction: 'user_delete',
  }),
  
  manage: () => PolicyGuard.guard({
    resource: RESOURCES.USERS,
    action: ACTIONS.MANAGE,
    scope: 'tenant',
    auditAction: 'user_manage',
  }),
};

/**
 * Middleware for role management
 */
export const roleGuard = {
  read: () => PolicyGuard.guard({
    resource: RESOURCES.ROLES,
    action: ACTIONS.READ,
    scope: 'tenant',
    auditAction: 'role_read',
  }),
  
  create: () => PolicyGuard.guard({
    resource: RESOURCES.ROLES,
    action: ACTIONS.CREATE,
    scope: 'tenant',
    auditAction: 'role_create',
  }),
  
  update: () => PolicyGuard.guard({
    resource: RESOURCES.ROLES,
    action: ACTIONS.UPDATE,
    scope: 'tenant',
    auditAction: 'role_update',
  }),
  
  delete: () => PolicyGuard.guard({
    resource: RESOURCES.ROLES,
    action: ACTIONS.DELETE,
    scope: 'tenant',
    auditAction: 'role_delete',
  }),
  
  assign: () => PolicyGuard.guard({
    resource: RESOURCES.ROLES,
    action: ACTIONS.ASSIGN,
    scope: 'tenant',
    auditAction: 'role_assign',
  }),
  
  revoke: () => PolicyGuard.guard({
    resource: RESOURCES.ROLES,
    action: ACTIONS.REVOKE,
    scope: 'tenant',
    auditAction: 'role_revoke',
  }),
};

/**
 * Middleware for audit log access
 */
export const auditGuard = {
  read: () => PolicyGuard.guard({
    resource: RESOURCES.AUDIT_LOGS,
    action: ACTIONS.READ,
    scope: 'tenant',
    auditAction: 'audit_read',
  }),
  
  export: () => PolicyGuard.guard({
    resource: RESOURCES.AUDIT_LOGS,
    action: ACTIONS.EXPORT,
    scope: 'tenant',
    auditAction: 'audit_export',
  }),
};

