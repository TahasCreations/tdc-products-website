export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  maxProducts?: number;
  maxUsers?: number;
  maxStorage?: number; // in GB
  apiAccess?: boolean;
  prioritySupport?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  createdAt: Date;
}

export class SubscriptionManager {
  /**
   * Available plans
   */
  static getPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'free',
        name: 'Free',
        description: 'Başlangıç planı',
        price: 0,
        currency: 'USD',
        interval: 'month',
        features: [
          '50 ürün',
          '5 GB depolama',
          'Temel destek',
          'Ödemesiz kullanım'
        ],
        maxProducts: 50,
        maxStorage: 5,
      },
      {
        id: 'starter',
        name: 'Starter',
        description: 'Küçük işletmeler için',
        price: 29,
        currency: 'USD',
        interval: 'month',
        features: [
          '500 ürün',
          '50 GB depolama',
          'Email desteği',
          'Temel raporlar',
          'API erişimi'
        ],
        maxProducts: 500,
        maxStorage: 50,
        apiAccess: true,
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Büyüyen işletmeler için',
        price: 99,
        currency: 'USD',
        interval: 'month',
        features: [
          'Sınırsız ürün',
          '500 GB depolama',
          'Öncelikli destek',
          'Gelişmiş raporlar',
          'API erişimi',
          'Özel tema',
          'Çoklu dil'
        ],
        maxProducts: -1,
        maxStorage: 500,
        apiAccess: true,
        prioritySupport: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Kurumsal çözümler',
        price: 299,
        currency: 'USD',
        interval: 'month',
        features: [
          'Sınırsız her şey',
          '1 TB depolama',
          '7/24 öncelikli destek',
          'Özel raporlar',
          'API + Webhooks',
          'Özel tema',
          'Çoklu dil',
          'White-label',
          'Dedicated account manager'
        ],
        maxProducts: -1,
        maxStorage: 1000,
        apiAccess: true,
        prioritySupport: true,
      },
    ];
  }

  /**
   * Get plan by ID
   */
  static getPlan(planId: string): SubscriptionPlan | undefined {
    return this.getPlans().find(p => p.id === planId);
  }

  /**
   * Create subscription
   */
  static async create(userId: string, planId: string, paymentMethodId: string): Promise<Subscription> {
    const plan = this.getPlan(planId);
    if (!plan) throw new Error('Plan not found');

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    // Create subscription record
    // const subscription = await prisma.subscription.create({
    //   data: {
    //     userId,
    //     planId,
    //     status: 'active',
    //     currentPeriodStart: now,
    //     currentPeriodEnd: periodEnd,
    //     cancelAtPeriodEnd: false,
    //   }
    // });

    // Process payment via Stripe
    // await this.processPayment(userId, plan, paymentMethodId);

    return {
      id: 'sub_' + Date.now(),
      userId,
      planId,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      createdAt: now,
    };
  }

  /**
   * Cancel subscription
   */
  static async cancel(subscriptionId: string, immediately: boolean = false): Promise<void> {
    // if (immediately) {
    //   await prisma.subscription.update({
    //     where: { id: subscriptionId },
    //     data: { status: 'cancelled' }
    //   });
    // } else {
    //   await prisma.subscription.update({
    //     where: { id: subscriptionId },
    //     data: { cancelAtPeriodEnd: true }
    //   });
    // }
  }

  /**
   * Upgrade subscription
   */
  static async upgrade(subscriptionId: string, newPlanId: string): Promise<Subscription> {
    // Get current subscription
    // Get new plan
    // Calculate prorated amount
    // Update subscription
    // Process payment for difference
    
    return {} as Subscription;
  }

  /**
   * Downgrade subscription
   */
  static async downgrade(subscriptionId: string, newPlanId: string): Promise<Subscription> {
    // Similar to upgrade but implement downgrade logic
    return {} as Subscription;
  }

  /**
   * Get user subscription
   */
  static async getUserSubscription(userId: string): Promise<Subscription | null> {
    // return await prisma.subscription.findFirst({
    //   where: { userId, status: 'active' }
    // });
    return null;
  }

  /**
   * Check if user has feature access
   */
  static async hasFeature(userId: string, feature: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) return false;

    const plan = this.getPlan(subscription.planId);
    if (!plan) return false;

    // Check feature availability
    return plan.features.includes(feature);
  }

  /**
   * Process payment
   */
  static async processPayment(userId: string, plan: SubscriptionPlan, paymentMethodId: string): Promise<void> {
    // Integrate with Stripe
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // await stripe.subscriptions.create({
    //   customer: userId,
    //   items: [{ price: plan.id }],
    //   payment_method: paymentMethodId,
    // });
  }
}

