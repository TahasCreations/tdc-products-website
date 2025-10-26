export interface ChurnPrediction {
  userId: string;
  churnProbability: number; // 0-1
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  recommendedActions: string[];
  lastActive: Date;
  daysSinceLastOrder: number;
}

export interface UserBehavior {
  userId: string;
  orderFrequency: number; // orders per month
  averageOrderValue: number;
  lastOrderDate: Date;
  totalOrders: number;
  totalSpent: number;
  loginFrequency: number; // logins per week
  lastLoginDate: Date;
  supportTickets: number;
  returnRate: number;
  reviewRating: number;
}

export class ChurnPredictor {
  /**
   * Predict churn probability
   */
  static async predict(userBehavior: UserBehavior): Promise<ChurnPrediction> {
    const churnScore = this.calculateChurnScore(userBehavior);
    const riskLevel = this.getRiskLevel(churnScore);
    const reasons = this.identifyReasons(userBehavior);
    const actions = this.recommendActions(riskLevel, reasons);

    return {
      userId: userBehavior.userId,
      churnProbability: churnScore,
      riskLevel,
      reasons,
      recommendedActions: actions,
      lastActive: userBehavior.lastLoginDate,
      daysSinceLastOrder: this.daysSince(userBehavior.lastOrderDate),
    };
  }

  /**
   * Calculate churn score
   */
  private static calculateChurnScore(behavior: UserBehavior): number {
    let score = 0;

    // Days since last order (highest weight)
    const daysSinceOrder = this.daysSince(behavior.lastOrderDate);
    if (daysSinceOrder > 90) score += 0.4;
    else if (daysSinceOrder > 60) score += 0.3;
    else if (daysSinceOrder > 30) score += 0.2;

    // Low order frequency
    if (behavior.orderFrequency < 0.5) score += 0.2;

    // Low login frequency
    if (behavior.loginFrequency < 1) score += 0.15;

    // High support tickets
    if (behavior.supportTickets > 3) score += 0.1;

    // Low review rating
    if (behavior.reviewRating < 3) score += 0.1;

    // High return rate
    if (behavior.returnRate > 0.2) score += 0.05;

    return Math.min(score, 1);
  }

  /**
   * Get risk level
   */
  private static getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 0.75) return 'critical';
    if (score >= 0.5) return 'high';
    if (score >= 0.25) return 'medium';
    return 'low';
  }

  /**
   * Identify churn reasons
   */
  private static identifyReasons(behavior: UserBehavior): string[] {
    const reasons: string[] = [];

    if (this.daysSince(behavior.lastOrderDate) > 60) {
      reasons.push('No recent orders');
    }

    if (behavior.orderFrequency < 0.5) {
      reasons.push('Low purchase frequency');
    }

    if (behavior.loginFrequency < 1) {
      reasons.push('Low engagement');
    }

    if (behavior.supportTickets > 3) {
      reasons.push('Multiple support issues');
    }

    if (behavior.reviewRating < 3) {
      reasons.push('Low satisfaction rating');
    }

    return reasons;
  }

  /**
   * Recommend actions
   */
  private static recommendActions(
    riskLevel: string,
    reasons: string[]
  ): string[] {
    const actions: string[] = [];

    if (riskLevel === 'critical') {
      actions.push('Send personalized win-back email');
      actions.push('Offer 20% discount');
      actions.push('Assign dedicated account manager');
    } else if (riskLevel === 'high') {
      actions.push('Send re-engagement campaign');
      actions.push('Offer 15% discount');
      actions.push('Highlight new products');
    } else if (riskLevel === 'medium') {
      actions.push('Send newsletter');
      actions.push('Offer 10% discount');
    } else {
      actions.push('Maintain regular communication');
    }

    return actions;
  }

  /**
   * Days since date
   */
  private static daysSince(date: Date): number {
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Get users at risk
   */
  static async getAtRiskUsers(
    behaviors: UserBehavior[],
    threshold: number = 0.5
  ): Promise<ChurnPrediction[]> {
    const predictions = await Promise.all(
      behaviors.map(b => this.predict(b))
    );

    return predictions.filter(p => p.churnProbability >= threshold);
  }
}

