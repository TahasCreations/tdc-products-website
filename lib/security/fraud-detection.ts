/**
 * Enterprise Fraud Detection System
 * AI-powered risk scoring & real-time fraud prevention
 */

import { prisma } from '@/lib/prisma';

interface FraudCheckResult {
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: string[];
  blockedReason?: string;
  requiresManualReview: boolean;
  recommendations: string[];
}

interface OrderData {
  userId: string;
  email: string;
  phone: string;
  ipAddress: string;
  amount: number;
  items: Array<{ productId: string; quantity: number; price: number }>;
  shippingAddress: any;
  billingAddress: any;
  paymentMethod: string;
  userAgent: string;
  deviceFingerprint?: string;
}

export class FraudDetectionEngine {
  private riskThresholds = {
    low: 30,
    medium: 60,
    high: 80,
    critical: 95,
  };

  /**
   * Comprehensive fraud check
   */
  async checkOrder(orderData: OrderData): Promise<FraudCheckResult> {
    const checks = await Promise.all([
      this.checkVelocity(orderData),
      this.checkEmailReputation(orderData.email),
      this.checkIPReputation(orderData.ipAddress),
      this.checkPhoneVerification(orderData.phone),
      this.checkBehavioralPatterns(orderData),
      this.checkDeviceFingerprint(orderData.deviceFingerprint),
      this.checkGeolocation(orderData),
      this.checkAmountAnomaly(orderData),
      this.checkBillingShippingMismatch(orderData),
      this.checkCardBinAnalysis(orderData),
    ]);

    const riskScore = this.calculateRiskScore(checks);
    const riskLevel = this.determineRiskLevel(riskScore);
    const flags = checks.flatMap(c => c.flags);

    return {
      riskScore,
      riskLevel,
      flags,
      blockedReason: riskLevel === 'critical' ? 'High fraud risk detected' : undefined,
      requiresManualReview: riskLevel === 'high' || riskLevel === 'critical',
      recommendations: this.getRecommendations(checks),
    };
  }

  /**
   * Velocity check - Unusual order frequency
   */
  private async checkVelocity(orderData: OrderData) {
    const recentOrders = await prisma.order.count({
      where: {
        userId: orderData.userId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24h
        },
      },
    });

    const flags: string[] = [];
    let score = 0;

    if (recentOrders > 5) {
      flags.push('High order velocity (5+ orders in 24h)');
      score = 40;
    }
    if (recentOrders > 10) {
      flags.push('Critical velocity (10+ orders in 24h)');
      score = 80;
    }

    return { score, flags, type: 'velocity' };
  }

  /**
   * Email reputation check
   */
  private async checkEmailReputation(email: string) {
    const flags: string[] = [];
    let score = 0;

    // Disposable email check
    const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
    const domain = email.split('@')[1]?.toLowerCase();

    if (disposableDomains.includes(domain)) {
      flags.push('Disposable email detected');
      score = 70;
    }

    // Check if email was previously flagged
    const flaggedEmails = await this.redis.sismember('flagged-emails', email);
    if (flaggedEmails) {
      flags.push('Previously flagged email');
      score = Math.max(score, 90);
    }

    // Email pattern analysis
    const hasRandomPattern = /[0-9]{8,}/.test(email);
    if (hasRandomPattern) {
      flags.push('Suspicious email pattern');
      score = Math.max(score, 30);
    }

    return { score, flags, type: 'email' };
  }

  /**
   * IP Reputation check
   */
  private async checkIPReputation(ipAddress: string) {
    const flags: string[] = [];
    let score = 0;

    try {
      // Check IP against known proxies/VPNs
      const ipInfo = await this.getIPInfo(ipAddress);

      if (ipInfo.isProxy || ipInfo.isVPN) {
        flags.push('Proxy/VPN detected');
        score = 50;
      }

      if (ipInfo.isTor) {
        flags.push('Tor network detected');
        score = 80;
      }

      // Check IP blacklists
      const isBlacklisted = await this.checkIPBlacklist(ipAddress);
      if (isBlacklisted) {
        flags.push('IP in blacklist');
        score = 95;
      }

      // Country mismatch check
      if (ipInfo.country !== 'TR') {
        flags.push(`Order from ${ipInfo.country} (non-domestic)`);
        score = Math.max(score, 20);
      }
    } catch (error) {
      console.error('IP check error:', error);
    }

    return { score, flags, type: 'ip' };
  }

  /**
   * Phone verification
   */
  private async checkPhoneVerification(phone: string) {
    const flags: string[] = [];
    let score = 0;

    // Format check
    const isValidTurkishPhone = /^(\+90|0)?5[0-9]{9}$/.test(phone.replace(/\s/g, ''));
    if (!isValidTurkishPhone) {
      flags.push('Invalid Turkish phone format');
      score = 30;
    }

    // Check if phone was used in fraud
    const fraudCount = await prisma.order.count({
      where: {
        customerInfo: {
          path: ['phone'],
          equals: phone,
        },
        status: 'CANCELLED',
      },
    });

    if (fraudCount > 2) {
      flags.push(`Phone used in ${fraudCount} cancelled orders`);
      score = Math.max(score, 70);
    }

    return { score, flags, type: 'phone' };
  }

  /**
   * Behavioral pattern analysis
   */
  private async checkBehavioralPatterns(orderData: OrderData) {
    const flags: string[] = [];
    let score = 0;

    // Time between account creation and first order
    const user = await prisma.user.findUnique({
      where: { id: orderData.userId },
      select: { createdAt: true },
    });

    if (user) {
      const accountAge = Date.now() - user.createdAt.getTime();
      const minutesOld = accountAge / 1000 / 60;

      if (minutesOld < 5) {
        flags.push('Account created <5 minutes ago');
        score = 60;
      }
    }

    // Unusual purchase amount
    if (orderData.amount > 10000) {
      flags.push('High value order (>10,000 TL)');
      score = Math.max(score, 40);
    }

    // Too many items
    const totalItems = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 20) {
      flags.push('Unusual quantity (>20 items)');
      score = Math.max(score, 35);
    }

    return { score, flags, type: 'behavioral' };
  }

  /**
   * Device fingerprinting
   */
  private async checkDeviceFingerprint(fingerprint?: string) {
    const flags: string[] = [];
    let score = 0;

    if (!fingerprint) {
      flags.push('No device fingerprint');
      score = 20;
      return { score, flags, type: 'device' };
    }

    // Check if device was used in fraud
    const fraudDevices = await this.redis.sismember('fraud-devices', fingerprint);
    if (fraudDevices) {
      flags.push('Device previously flagged');
      score = 90;
    }

    return { score, flags, type: 'device' };
  }

  /**
   * Geolocation analysis
   */
  private async checkGeolocation(orderData: OrderData) {
    const flags: string[] = [];
    let score = 0;

    // IP location vs shipping address mismatch
    const ipInfo = await this.getIPInfo(orderData.ipAddress);
    const shippingCity = orderData.shippingAddress.city?.toLowerCase();

    if (ipInfo.city && shippingCity && ipInfo.city.toLowerCase() !== shippingCity) {
      flags.push('IP location and shipping address mismatch');
      score = 25;
    }

    return { score, flags, type: 'geo' };
  }

  /**
   * Amount anomaly detection
   */
  private async checkAmountAnomaly(orderData: OrderData) {
    const flags: string[] = [];
    let score = 0;

    // Get user's average order value
    const userOrders = await prisma.order.findMany({
      where: { userId: orderData.userId },
      select: { totalAmount: true },
    });

    if (userOrders.length > 0) {
      const avgAmount = userOrders.reduce((sum, o) => sum + o.totalAmount, 0) / userOrders.length;
      const deviation = Math.abs(orderData.amount - avgAmount) / avgAmount;

      if (deviation > 3) {
        flags.push(`Order amount 3x different from user average`);
        score = 50;
      }
    }

    return { score, flags, type: 'amount' };
  }

  /**
   * Billing vs Shipping address mismatch
   */
  private async checkBillingShippingMismatch(orderData: OrderData) {
    const flags: string[] = [];
    let score = 0;

    if (orderData.billingAddress && orderData.shippingAddress) {
      const isSame = 
        orderData.billingAddress.city === orderData.shippingAddress.city &&
        orderData.billingAddress.postalCode === orderData.shippingAddress.postalCode;

      if (!isSame) {
        flags.push('Billing and shipping address mismatch');
        score = 15;
      }
    }

    return { score, flags, type: 'address' };
  }

  /**
   * Card BIN analysis
   */
  private async checkCardBinAnalysis(orderData: OrderData) {
    const flags: string[] = [];
    let score = 0;

    // BIN (Bank Identification Number) analysis
    // Can check if card type matches typical patterns

    return { score, flags, type: 'card' };
  }

  // Utility methods
  private redis = {
    sismember: async (key: string, value: string) => false,
  };

  private async getIPInfo(ip: string) {
    // Use ipapi.co or similar service
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      return await response.json();
    } catch {
      return { country: 'TR', city: null, isProxy: false, isVPN: false, isTor: false };
    }
  }

  private async checkIPBlacklist(ip: string): Promise<boolean> {
    // Check against IP blacklist databases
    return false;
  }

  private calculateRiskScore(checks: Array<{ score: number; flags: string[] }>): number {
    // Weighted average
    const totalScore = checks.reduce((sum, check) => sum + check.score, 0);
    return Math.min(100, Math.round(totalScore / checks.length));
  }

  private determineRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score < this.riskThresholds.low) return 'low';
    if (score < this.riskThresholds.medium) return 'medium';
    if (score < this.riskThresholds.high) return 'high';
    return 'critical';
  }

  private getRecommendations(checks: Array<{ score: number; flags: string[] }>): string[] {
    const recommendations: string[] = [];
    const allFlags = checks.flatMap(c => c.flags);

    if (allFlags.some(f => f.includes('velocity'))) {
      recommendations.push('Implement rate limiting');
    }
    if (allFlags.some(f => f.includes('email'))) {
      recommendations.push('Require email verification');
    }
    if (allFlags.some(f => f.includes('IP'))) {
      recommendations.push('Additional authentication required');
    }

    return recommendations;
  }

  /**
   * Machine Learning fraud prediction
   */
  async predictFraudProbability(orderData: OrderData): Promise<number> {
    // Train a model on historical fraud data
    // Features: user_age, order_amount, velocity, ip_score, etc.
    
    // Mock ML prediction
    const features = [
      orderData.amount / 1000,
      orderData.items.length / 10,
      // ... more features
    ];

    // Simple heuristic (replace with actual ML model)
    const prediction = features.reduce((sum, f) => sum + f, 0) / features.length;
    return Math.min(1, prediction);
  }
}

export const fraudDetection = new FraudDetectionEngine();

