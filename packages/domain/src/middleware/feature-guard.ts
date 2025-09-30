import { NextRequest, NextResponse } from 'next/server';
import { FeatureName } from '../types/subscription.types.js';

export interface FeatureGuardOptions {
  feature: FeatureName;
  requiredAmount?: number;
  redirectTo?: string;
  showUpgradeModal?: boolean;
  customMessage?: string;
}

export class FeatureGuard {
  private subscriptionService: any;

  constructor(subscriptionService: any) {
    this.subscriptionService = subscriptionService;
  }

  async checkFeatureAccess(
    tenantId: string, 
    feature: FeatureName, 
    requiredAmount?: number
  ): Promise<{
    hasAccess: boolean;
    reason?: string;
    currentUsage?: number;
    limit?: number;
    remaining?: number;
  }> {
    try {
      const hasFeature = await this.subscriptionService.hasFeature(tenantId, feature);
      
      if (!hasFeature) {
        return {
          hasAccess: false,
          reason: `Feature '${feature}' is not available in your current plan`
        };
      }

      const canUse = await this.subscriptionService.canUseFeature(tenantId, feature, requiredAmount);
      
      if (!canUse) {
        const usage = await this.subscriptionService.getFeatureUsage(tenantId, feature);
        return {
          hasAccess: false,
          reason: `Usage limit exceeded for feature '${feature}'`,
          currentUsage: usage.used,
          limit: usage.limit,
          remaining: usage.remaining
        };
      }

      return { hasAccess: true };
    } catch (error) {
      console.error('FeatureGuard error:', error);
      return {
        hasAccess: false,
        reason: 'Unable to verify feature access'
      };
    }
  }

  async middleware(
    request: NextRequest,
    options: FeatureGuardOptions
  ): Promise<NextResponse | null> {
    const tenantId = request.headers.get('x-tenant-id');
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID not found' },
        { status: 401 }
      );
    }

    const accessCheck = await this.checkFeatureAccess(
      tenantId,
      options.feature,
      options.requiredAmount
    );

    if (!accessCheck.hasAccess) {
      if (options.redirectTo) {
        return NextResponse.redirect(new URL(options.redirectTo, request.url));
      }

      if (options.showUpgradeModal) {
        return NextResponse.json({
          error: 'Feature not available',
          reason: accessCheck.reason,
          currentUsage: accessCheck.currentUsage,
          limit: accessCheck.limit,
          remaining: accessCheck.remaining,
          showUpgradeModal: true,
          feature: options.feature
        }, { status: 403 });
      }

      return NextResponse.json({
        error: options.customMessage || accessCheck.reason,
        currentUsage: accessCheck.currentUsage,
        limit: accessCheck.limit,
        remaining: accessCheck.remaining
      }, { status: 403 });
    }

    return null; // Allow request to continue
  }
}

// Specific feature guards
export class CustomDomainGuard extends FeatureGuard {
  async checkCustomDomainAccess(tenantId: string): Promise<{
    hasAccess: boolean;
    reason?: string;
    currentDomains?: number;
    limit?: number;
    remaining?: number;
  }> {
    return this.checkFeatureAccess(tenantId, FeatureName.CUSTOM_DOMAINS);
  }

  async middleware(request: NextRequest): Promise<NextResponse | null> {
    return this.middleware(request, {
      feature: FeatureName.CUSTOM_DOMAINS,
      redirectTo: '/admin/subscription',
      showUpgradeModal: true,
      customMessage: 'Custom domains require CustomDomainPro plan'
    });
  }
}

export class PageBuilderGuard extends FeatureGuard {
  async checkPageBuilderAccess(tenantId: string): Promise<{
    hasAccess: boolean;
    reason?: string;
  }> {
    return this.checkFeatureAccess(tenantId, FeatureName.PAGE_BUILDER);
  }

  async middleware(request: NextRequest): Promise<NextResponse | null> {
    return this.middleware(request, {
      feature: FeatureName.PAGE_BUILDER,
      redirectTo: '/admin/subscription',
      showUpgradeModal: true,
      customMessage: 'Page Builder requires CustomDomainPro plan'
    });
  }
}

export class AdvancedAnalyticsGuard extends FeatureGuard {
  async checkAdvancedAnalyticsAccess(tenantId: string): Promise<{
    hasAccess: boolean;
    reason?: string;
  }> {
    return this.checkFeatureAccess(tenantId, FeatureName.ADVANCED_ANALYTICS);
  }

  async middleware(request: NextRequest): Promise<NextResponse | null> {
    return this.middleware(request, {
      feature: FeatureName.ADVANCED_ANALYTICS,
      redirectTo: '/admin/subscription',
      showUpgradeModal: true,
      customMessage: 'Advanced Analytics requires CustomDomainPro plan'
    });
  }
}

export class APIAccessGuard extends FeatureGuard {
  async checkAPIAccess(tenantId: string): Promise<{
    hasAccess: boolean;
    reason?: string;
  }> {
    return this.checkFeatureAccess(tenantId, FeatureName.API_ACCESS);
  }

  async middleware(request: NextRequest): Promise<NextResponse | null> {
    return this.middleware(request, {
      feature: FeatureName.API_ACCESS,
      redirectTo: '/admin/subscription',
      showUpgradeModal: true,
      customMessage: 'API Access requires Basic plan or higher'
    });
  }
}

export class WebhookGuard extends FeatureGuard {
  async checkWebhookAccess(tenantId: string): Promise<{
    hasAccess: boolean;
    reason?: string;
  }> {
    return this.checkFeatureAccess(tenantId, FeatureName.WEBHOOKS);
  }

  async middleware(request: NextRequest): Promise<NextResponse | null> {
    return this.middleware(request, {
      feature: FeatureName.WEBHOOKS,
      redirectTo: '/admin/subscription',
      showUpgradeModal: true,
      customMessage: 'Webhooks require CustomDomainPro plan'
    });
  }
}

// Utility functions
export function createFeatureGuard(subscriptionService: any) {
  return {
    customDomain: new CustomDomainGuard(subscriptionService),
    pageBuilder: new PageBuilderGuard(subscriptionService),
    advancedAnalytics: new AdvancedAnalyticsGuard(subscriptionService),
    apiAccess: new APIAccessGuard(subscriptionService),
    webhook: new WebhookGuard(subscriptionService)
  };
}

export function withFeatureGuard(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: FeatureGuardOptions,
  subscriptionService: any
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const guard = new FeatureGuard(subscriptionService);
    const guardResponse = await guard.middleware(req, options);
    
    if (guardResponse) {
      return guardResponse;
    }
    
    return handler(req);
  };
}

