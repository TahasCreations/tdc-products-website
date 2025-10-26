export interface FraudRisk {
  userId: string;
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: FraudFlag[];
  recommendedAction: 'allow' | 'review' | 'block';
}

export interface FraudFlag {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  evidence: any;
}

export interface TransactionData {
  userId: string;
  amount: number;
  currency: string;
  ipAddress: string;
  device: string;
  billingAddress: string;
  shippingAddress: string;
  paymentMethod: string;
  cardFirst6?: string;
  cardLast4?: string;
  email?: string;
  phone?: string;
}

export class FraudDetectionSystem {
  /**
   * Detect fraud risk
   */
  static async detectFraud(data: TransactionData): Promise<FraudRisk> {
    const flags: FraudFlag[] = [];
    let riskScore = 0;

    // Check 1: Unusual amount
    if (data.amount > 10000) {
      flags.push({
        type: 'high_amount',
        severity: 'high',
        description: 'Unusually high transaction amount',
        evidence: { amount: data.amount },
      });
      riskScore += 30;
    }

    // Check 2: Different billing/shipping address
    if (data.billingAddress !== data.shippingAddress) {
      flags.push({
        type: 'address_mismatch',
        severity: 'medium',
        description: 'Billing and shipping addresses differ',
        evidence: { billing: data.billingAddress, shipping: data.shippingAddress },
      });
      riskScore += 15;
    }

    // Check 3: Suspicious IP
    if (await this.isSuspiciousIP(data.ipAddress)) {
      flags.push({
        type: 'suspicious_ip',
        severity: 'high',
        description: 'IP address flagged as suspicious',
        evidence: { ip: data.ipAddress },
      });
      riskScore += 25;
    }

    // Check 4: New device
    if (await this.isNewDevice(data.userId, data.device)) {
      flags.push({
        type: 'new_device',
        severity: 'medium',
        description: 'Unrecognized device',
        evidence: { device: data.device },
      });
      riskScore += 10;
    }

    // Check 5: Multiple rapid transactions
    if (await this.hasRapidTransactions(data.userId)) {
      flags.push({
        type: 'rapid_transactions',
        severity: 'high',
        description: 'Multiple transactions in short time',
        evidence: {},
      });
      riskScore += 20;
    }

    // Check 6: Email domain validation
    if (data.email && await this.isSuspiciousEmail(data.email)) {
      flags.push({
        type: 'suspicious_email',
        severity: 'low',
        description: 'Suspicious email domain',
        evidence: { email: data.email },
      });
      riskScore += 5;
    }

    const riskLevel = this.getRiskLevel(riskScore);
    const recommendedAction = this.getRecommendedAction(riskLevel);

    return {
      userId: data.userId,
      riskScore,
      riskLevel,
      flags,
      recommendedAction,
    };
  }

  /**
   * Check if IP is suspicious
   */
  private static async isSuspiciousIP(ip: string): Promise<boolean> {
    // Check known VPN/proxy IPs
    const suspiciousIPs = ['10.0.0.1']; // Mock list
    return suspiciousIPs.includes(ip);
  }

  /**
   * Check if device is new
   */
  private static async isNewDevice(userId: string, device: string): Promise<boolean> {
    // Check device history
    // return await prisma.device.findFirst({ where: { userId, deviceId: device } }) === null;
    return false;
  }

  /**
   * Check for rapid transactions
   */
  private static async hasRapidTransactions(userId: string): Promise<boolean> {
    // Check transaction history in last hour
    // const recent = await prisma.transaction.count({
    //   where: {
    //     userId,
    //     createdAt: { gte: new Date(Date.now() - 3600000) }
    //   }
    // });
    // return recent > 5;
    return false;
  }

  /**
   * Check if email is suspicious
   */
  private static async isSuspiciousEmail(email: string): Promise<boolean> {
    const suspiciousDomains = ['tempmail.com', 'throwaway.email'];
    const domain = email.split('@')[1];
    return suspiciousDomains.includes(domain);
  }

  /**
   * Get risk level
   */
  private static getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 70) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  }

  /**
   * Get recommended action
   */
  private static getRecommendedAction(riskLevel: string): 'allow' | 'review' | 'block' {
    if (riskLevel === 'critical') return 'block';
    if (riskLevel === 'high') return 'review';
    return 'allow';
  }

  /**
   * Check if user should be blacklisted
   */
  static async isBlacklisted(userId: string): Promise<boolean> {
    // Check blacklist
    // return await prisma.blacklist.findUnique({ where: { userId } }) !== null;
    return false;
  }
}

