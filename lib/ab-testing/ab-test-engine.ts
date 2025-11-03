/**
 * A/B Testing Framework
 * Client-side and Server-side A/B testing with conversion tracking
 */

export interface ABTest {
  id: string;
  name: string;
  variants: ABVariant[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate: Date;
  endDate?: Date;
  targetMetric: string;
  trafficAllocation: number; // 0-100%
}

export interface ABVariant {
  id: string;
  name: string;
  weight: number; // 0-100%
  config: Record<string, any>;
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  conversions: number;
  visitors: number;
  conversionRate: number;
  revenue: number;
  confidence: number;
}

class ABTestEngine {
  private tests: Map<string, ABTest> = new Map();
  private userVariants: Map<string, Map<string, string>> = new Map(); // userId -> testId -> variantId

  /**
   * Register a new A/B test
   */
  registerTest(test: ABTest): void {
    this.tests.set(test.id, test);
  }

  /**
   * Get variant for a user
   * Uses consistent hashing for stable assignment
   */
  getVariant(testId: string, userId: string): ABVariant | null {
    const test = this.tests.get(testId);
    if (!test || test.status !== 'running') return null;

    // Check if user already has a variant
    if (!this.userVariants.has(userId)) {
      this.userVariants.set(userId, new Map());
    }

    const userTests = this.userVariants.get(userId)!;
    if (userTests.has(testId)) {
      const variantId = userTests.get(testId)!;
      return test.variants.find(v => v.id === variantId) || null;
    }

    // Assign new variant using weighted random
    const variant = this.assignVariant(test, userId);
    if (variant) {
      userTests.set(testId, variant.id);
      
      // Track assignment
      this.trackEvent('ab_test_assigned', {
        testId,
        variantId: variant.id,
        userId
      });
    }

    return variant;
  }

  /**
   * Assign variant using weighted random selection
   */
  private assignVariant(test: ABTest, userId: string): ABVariant | null {
    // Use deterministic hash for consistent assignment
    const hash = this.hashString(userId + test.id);
    const random = hash % 100;

    let cumulative = 0;
    for (const variant of test.variants) {
      cumulative += variant.weight;
      if (random < cumulative) {
        return variant;
      }
    }

    return test.variants[0] || null;
  }

  /**
   * Simple hash function for consistent assignment
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Track conversion event
   */
  trackConversion(testId: string, userId: string, value?: number): void {
    const variant = this.getVariant(testId, userId);
    if (!variant) return;

    this.trackEvent('ab_test_conversion', {
      testId,
      variantId: variant.id,
      userId,
      value
    });
  }

  /**
   * Track custom event
   */
  private trackEvent(eventName: string, data: any): void {
    // Send to analytics backend
    if (typeof window !== 'undefined') {
      // Client-side tracking
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventName, ...data })
      }).catch(console.error);
    }
  }

  /**
   * Get test results
   */
  async getTestResults(testId: string): Promise<ABTestResult[]> {
    try {
      const response = await fetch(`/api/ab-testing/${testId}/results`);
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Failed to fetch test results:', error);
      return [];
    }
  }

  /**
   * Calculate statistical significance
   */
  calculateSignificance(control: ABTestResult, variant: ABTestResult): number {
    // Z-test for proportions
    const p1 = control.conversionRate / 100;
    const p2 = variant.conversionRate / 100;
    const n1 = control.visitors;
    const n2 = variant.visitors;

    const pPooled = (control.conversions + variant.conversions) / (n1 + n2);
    const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / n1 + 1 / n2));
    
    if (se === 0) return 0;
    
    const z = (p2 - p1) / se;
    const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));
    
    return (1 - pValue) * 100; // Confidence percentage
  }

  /**
   * Normal cumulative distribution function
   */
  private normalCDF(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
  }
}

// Singleton instance
export const abTestEngine = new ABTestEngine();

// React Hook
export function useABTest(testId: string, userId: string) {
  const variant = abTestEngine.getVariant(testId, userId);

  const trackConversion = (value?: number) => {
    abTestEngine.trackConversion(testId, userId, value);
  };

  return {
    variant,
    config: variant?.config || {},
    trackConversion,
    isControl: variant?.id === 'control',
    isVariant: variant?.id !== 'control'
  };
}

