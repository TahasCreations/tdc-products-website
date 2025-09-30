/**
 * Seller RBAC Service - Specialized service for seller role management
 * Handles seller_owner and seller_staff role distinctions
 */

import { RBACService } from './rbac.service';
import { RBACPort, UserRole, PermissionScope, SYSTEM_ROLES, RESOURCES, ACTIONS } from '../ports/services/rbac.port';

export class SellerRBACService {
  constructor(private rbacService: RBACService) {}

  // ===========================================
  // SELLER ROLE MANAGEMENT
  // ===========================================

  /**
   * Assign seller owner role to user
   */
  async assignSellerOwnerRole(userId: string, tenantId: string, sellerId: string, assignedBy?: string): Promise<UserRole> {
    try {
      // Get seller_owner role
      const roles = await this.rbacService.getRoles(tenantId, { name: SYSTEM_ROLES.SELLER_OWNER });
      const sellerOwnerRole = roles.find(r => r.name === SYSTEM_ROLES.SELLER_OWNER);

      if (!sellerOwnerRole) {
        throw new Error('Seller owner role not found');
      }

      // Revoke any existing seller roles for this seller
      await this.revokeAllSellerRoles(userId, tenantId, sellerId);

      // Assign seller owner role
      const userRole = await this.rbacService.assignRoleToUser(
        userId,
        sellerOwnerRole.id,
        tenantId,
        sellerId,
        assignedBy
      );

      return userRole;
    } catch (error: any) {
      console.error('Error assigning seller owner role:', error);
      throw error;
    }
  }

  /**
   * Assign seller staff role to user
   */
  async assignSellerStaffRole(userId: string, tenantId: string, sellerId: string, assignedBy?: string, expiresAt?: Date): Promise<UserRole> {
    try {
      // Get seller_staff role
      const roles = await this.rbacService.getRoles(tenantId, { name: SYSTEM_ROLES.SELLER_STAFF });
      const sellerStaffRole = roles.find(r => r.name === SYSTEM_ROLES.SELLER_STAFF);

      if (!sellerStaffRole) {
        throw new Error('Seller staff role not found');
      }

      // Check if user already has seller owner role for this seller
      const isOwner = await this.rbacService.isSellerOwner(userId, tenantId, sellerId);
      if (isOwner) {
        throw new Error('User already has seller owner role for this seller');
      }

      // Assign seller staff role
      const userRole = await this.rbacService.assignRoleToUser(
        userId,
        sellerStaffRole.id,
        tenantId,
        sellerId,
        assignedBy,
        expiresAt
      );

      return userRole;
    } catch (error: any) {
      console.error('Error assigning seller staff role:', error);
      throw error;
    }
  }

  /**
   * Revoke all seller roles from user for specific seller
   */
  async revokeAllSellerRoles(userId: string, tenantId: string, sellerId: string): Promise<boolean> {
    try {
      const userRoles = await this.rbacService.getUserRoles(userId, tenantId);
      const sellerRoles = userRoles.filter(ur => 
        ur.sellerId === sellerId && 
        (ur.role?.name === SYSTEM_ROLES.SELLER_OWNER || ur.role?.name === SYSTEM_ROLES.SELLER_STAFF)
      );

      let allRevoked = true;
      for (const userRole of sellerRoles) {
        const success = await this.rbacService.revokeRoleFromUser(
          userId,
          userRole.roleId,
          tenantId,
          sellerId
        );
        if (!success) allRevoked = false;
      }

      return allRevoked;
    } catch (error: any) {
      console.error('Error revoking seller roles:', error);
      return false;
    }
  }

  /**
   * Get seller team members
   */
  async getSellerTeamMembers(tenantId: string, sellerId: string): Promise<{
    owner: UserRole | null;
    staff: UserRole[];
  }> {
    try {
      const roles = await this.rbacService.getRoles(tenantId, { 
        name: SYSTEM_ROLES.SELLER_OWNER 
      });
      const sellerOwnerRole = roles.find(r => r.name === SYSTEM_ROLES.SELLER_OWNER);

      if (!sellerOwnerRole) {
        return { owner: null, staff: [] };
      }

      // Get all users with seller roles for this seller
      const allUserRoles = await this.rbacService.getUserRoles('', tenantId); // Empty userId to get all
      const sellerUserRoles = allUserRoles.filter(ur => 
        ur.sellerId === sellerId && 
        (ur.role?.name === SYSTEM_ROLES.SELLER_OWNER || ur.role?.name === SYSTEM_ROLES.SELLER_STAFF) &&
        ur.isActive
      );

      const owner = sellerUserRoles.find(ur => ur.role?.name === SYSTEM_ROLES.SELLER_OWNER) || null;
      const staff = sellerUserRoles.filter(ur => ur.role?.name === SYSTEM_ROLES.SELLER_STAFF);

      return { owner, staff };
    } catch (error: any) {
      console.error('Error getting seller team members:', error);
      return { owner: null, staff: [] };
    }
  }

  // ===========================================
  // SELLER PERMISSION CHECKS
  // ===========================================

  /**
   * Check if user can manage seller account
   */
  async canManageSellerAccount(userId: string, tenantId: string, sellerId: string): Promise<boolean> {
    try {
      const isOwner = await this.rbacService.isSellerOwner(userId, tenantId, sellerId);
      const isAdmin = await this.rbacService.isAdmin(userId, tenantId);
      
      return isOwner || isAdmin;
    } catch (error: any) {
      console.error('Error checking seller account management permission:', error);
      return false;
    }
  }

  /**
   * Check if user can manage seller products
   */
  async canManageSellerProducts(userId: string, tenantId: string, sellerId: string): Promise<boolean> {
    try {
      const isOwner = await this.rbacService.isSellerOwner(userId, tenantId, sellerId);
      const isStaff = await this.rbacService.isSellerStaff(userId, tenantId, sellerId);
      const isAdmin = await this.rbacService.isAdmin(userId, tenantId);
      
      return isOwner || isStaff || isAdmin;
    } catch (error: any) {
      console.error('Error checking seller products management permission:', error);
      return false;
    }
  }

  /**
   * Check if user can view seller analytics
   */
  async canViewSellerAnalytics(userId: string, tenantId: string, sellerId: string): Promise<boolean> {
    try {
      const isOwner = await this.rbacService.isSellerOwner(userId, tenantId, sellerId);
      const isStaff = await this.rbacService.isSellerStaff(userId, tenantId, sellerId);
      const isAdmin = await this.rbacService.isAdmin(userId, tenantId);
      
      return isOwner || isStaff || isAdmin;
    } catch (error: any) {
      console.error('Error checking seller analytics permission:', error);
      return false;
    }
  }

  /**
   * Check if user can manage seller orders
   */
  async canManageSellerOrders(userId: string, tenantId: string, sellerId: string): Promise<boolean> {
    try {
      const isOwner = await this.rbacService.isSellerOwner(userId, tenantId, sellerId);
      const isAdmin = await this.rbacService.isAdmin(userId, tenantId);
      
      return isOwner || isAdmin;
    } catch (error: any) {
      console.error('Error checking seller orders management permission:', error);
      return false;
    }
  }

  /**
   * Check if user can invite staff to seller account
   */
  async canInviteSellerStaff(userId: string, tenantId: string, sellerId: string): Promise<boolean> {
    try {
      const isOwner = await this.rbacService.isSellerOwner(userId, tenantId, sellerId);
      const isAdmin = await this.rbacService.isAdmin(userId, tenantId);
      
      return isOwner || isAdmin;
    } catch (error: any) {
      console.error('Error checking seller staff invitation permission:', error);
      return false;
    }
  }

  /**
   * Check if user can remove staff from seller account
   */
  async canRemoveSellerStaff(userId: string, tenantId: string, sellerId: string, targetUserId: string): Promise<boolean> {
    try {
      const isOwner = await this.rbacService.isSellerOwner(userId, tenantId, sellerId);
      const isAdmin = await this.rbacService.isAdmin(userId, tenantId);
      
      // Owner can remove staff, admin can remove anyone
      if (isAdmin) return true;
      if (isOwner) {
        // Check if target user is staff (not owner)
        const isTargetOwner = await this.rbacService.isSellerOwner(targetUserId, tenantId, sellerId);
        return !isTargetOwner; // Can remove staff but not other owners
      }
      
      return false;
    } catch (error: any) {
      console.error('Error checking seller staff removal permission:', error);
      return false;
    }
  }

  // ===========================================
  // SELLER ROLE VALIDATION
  // ===========================================

  /**
   * Validate seller role assignment
   */
  async validateSellerRoleAssignment(
    userId: string, 
    tenantId: string, 
    sellerId: string, 
    roleName: string, 
    assignedBy?: string
  ): Promise<{
    valid: boolean;
    reason?: string;
    warnings?: string[];
  }> {
    try {
      const warnings: string[] = [];

      // Check if user already has a role for this seller
      const existingRoles = await this.rbacService.getUserRoles(userId, tenantId);
      const existingSellerRole = existingRoles.find(ur => 
        ur.sellerId === sellerId && 
        (ur.role?.name === SYSTEM_ROLES.SELLER_OWNER || ur.role?.name === SYSTEM_ROLES.SELLER_STAFF) &&
        ur.isActive
      );

      if (existingSellerRole) {
        if (existingSellerRole.role?.name === roleName) {
          return {
            valid: false,
            reason: `User already has ${roleName} role for this seller`,
          };
        }

        if (roleName === SYSTEM_ROLES.SELLER_STAFF && existingSellerRole.role?.name === SYSTEM_ROLES.SELLER_OWNER) {
          return {
            valid: false,
            reason: 'Cannot assign staff role to user who already has owner role',
          };
        }

        warnings.push(`User currently has ${existingSellerRole.role?.name} role, will be replaced with ${roleName}`);
      }

      // Check if assigning owner role
      if (roleName === SYSTEM_ROLES.SELLER_OWNER) {
        // Check if there's already an owner
        const { owner } = await this.getSellerTeamMembers(tenantId, sellerId);
        if (owner && owner.userId !== userId) {
          warnings.push('There is already a seller owner for this account');
        }
      }

      // Check if user has admin role (can assign any role)
      if (assignedBy) {
        const isAdmin = await this.rbacService.isAdmin(assignedBy, tenantId);
        if (!isAdmin) {
          // Check if assignedBy is the current owner
          const { owner } = await this.getSellerTeamMembers(tenantId, sellerId);
          if (!owner || owner.userId !== assignedBy) {
            return {
              valid: false,
              reason: 'Only admins or current seller owners can assign roles',
            };
          }
        }
      }

      return {
        valid: true,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } catch (error: any) {
      console.error('Error validating seller role assignment:', error);
      return {
        valid: false,
        reason: 'Validation failed due to system error',
      };
    }
  }

  // ===========================================
  // SELLER PERMISSION MAPPING
  // ===========================================

  /**
   * Get seller-specific permissions for a role
   */
  async getSellerPermissions(roleName: string): Promise<{
    resource: string;
    action: string;
    scope: PermissionScope;
    description: string;
  }[]> {
    const permissions: Array<{
      resource: string;
      action: string;
      scope: PermissionScope;
      description: string;
    }> = [];

    if (roleName === SYSTEM_ROLES.SELLER_OWNER) {
      permissions.push(
        // Product management
        { resource: RESOURCES.PRODUCTS, action: ACTIONS.CREATE, scope: PermissionScope.OWN, description: 'Create products' },
        { resource: RESOURCES.PRODUCTS, action: ACTIONS.READ, scope: PermissionScope.OWN, description: 'View own products' },
        { resource: RESOURCES.PRODUCTS, action: ACTIONS.UPDATE, scope: PermissionScope.OWN, description: 'Update own products' },
        { resource: RESOURCES.PRODUCTS, action: ACTIONS.DELETE, scope: PermissionScope.OWN, description: 'Delete own products' },
        { resource: RESOURCES.PRODUCTS, action: ACTIONS.MANAGE, scope: PermissionScope.OWN, description: 'Manage own products' },
        
        // Order management
        { resource: RESOURCES.ORDERS, action: ACTIONS.READ, scope: PermissionScope.OWN, description: 'View own orders' },
        { resource: RESOURCES.ORDERS, action: ACTIONS.UPDATE, scope: PermissionScope.OWN, description: 'Update own orders' },
        { resource: RESOURCES.ORDERS, action: ACTIONS.MANAGE, scope: PermissionScope.OWN, description: 'Manage own orders' },
        
        // Analytics
        { resource: RESOURCES.ANALYTICS, action: ACTIONS.READ, scope: PermissionScope.OWN, description: 'View own analytics' },
        { resource: RESOURCES.ANALYTICS, action: ACTIONS.EXPORT, scope: PermissionScope.OWN, description: 'Export own analytics' },
        
        // User management (for seller team)
        { resource: RESOURCES.USERS, action: ACTIONS.CREATE, scope: PermissionScope.OWN, description: 'Invite staff members' },
        { resource: RESOURCES.USERS, action: ACTIONS.READ, scope: PermissionScope.OWN, description: 'View team members' },
        { resource: RESOURCES.USERS, action: ACTIONS.UPDATE, scope: PermissionScope.OWN, description: 'Update team members' },
        { resource: RESOURCES.USERS, action: ACTIONS.DELETE, scope: PermissionScope.OWN, description: 'Remove team members' },
        
        // Role management (for seller team)
        { resource: RESOURCES.ROLES, action: ACTIONS.ASSIGN, scope: PermissionScope.OWN, description: 'Assign roles to team members' },
        { resource: RESOURCES.ROLES, action: ACTIONS.REVOKE, scope: PermissionScope.OWN, description: 'Revoke roles from team members' },
      );
    } else if (roleName === SYSTEM_ROLES.SELLER_STAFF) {
      permissions.push(
        // Limited product management
        { resource: RESOURCES.PRODUCTS, action: ACTIONS.CREATE, scope: PermissionScope.OWN, description: 'Create products' },
        { resource: RESOURCES.PRODUCTS, action: ACTIONS.READ, scope: PermissionScope.OWN, description: 'View own products' },
        { resource: RESOURCES.PRODUCTS, action: ACTIONS.UPDATE, scope: PermissionScope.OWN, description: 'Update own products' },
        
        // Limited order management
        { resource: RESOURCES.ORDERS, action: ACTIONS.READ, scope: PermissionScope.OWN, description: 'View own orders' },
        
        // Limited analytics
        { resource: RESOURCES.ANALYTICS, action: ACTIONS.READ, scope: PermissionScope.OWN, description: 'View own analytics' },
      );
    }

    return permissions;
  }

  // ===========================================
  // SELLER ROLE STATISTICS
  // ===========================================

  /**
   * Get seller role statistics
   */
  async getSellerRoleStats(tenantId: string): Promise<{
    totalSellers: number;
    sellersWithOwners: number;
    sellersWithStaff: number;
    totalStaffMembers: number;
    roleDistribution: Record<string, number>;
  }> {
    try {
      // This would typically query the database for statistics
      // For now, return mock data
      return {
        totalSellers: 0,
        sellersWithOwners: 0,
        sellersWithStaff: 0,
        totalStaffMembers: 0,
        roleDistribution: {
          [SYSTEM_ROLES.SELLER_OWNER]: 0,
          [SYSTEM_ROLES.SELLER_STAFF]: 0,
        },
      };
    } catch (error: any) {
      console.error('Error getting seller role statistics:', error);
      return {
        totalSellers: 0,
        sellersWithOwners: 0,
        sellersWithStaff: 0,
        totalStaffMembers: 0,
        roleDistribution: {},
      };
    }
  }
}

