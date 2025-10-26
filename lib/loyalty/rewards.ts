export interface PointTransaction {
  id: string;
  userId: string;
  points: number;
  type: 'earned' | 'redeemed' | 'expired';
  description: string;
  createdAt: Date;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  category: 'discount' | 'product' | 'cashback' | 'experience';
  value: number;
  isActive: boolean;
}

export interface UserTier {
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  name: string;
  minPoints: number;
  benefits: string[];
  discountMultiplier: number;
}

export class LoyaltyProgram {
  private static userTiers: UserTier[] = [
    {
      level: 'bronze',
      name: 'Bronze',
      minPoints: 0,
      benefits: ['Basic rewards', '5% discount'],
      discountMultiplier: 0.05,
    },
    {
      level: 'silver',
      name: 'Silver',
      minPoints: 1000,
      benefits: ['Enhanced rewards', '10% discount', 'Free shipping'],
      discountMultiplier: 0.10,
    },
    {
      level: 'gold',
      name: 'Gold',
      minPoints: 5000,
      benefits: ['Premium rewards', '15% discount', 'Free shipping', 'Early access'],
      discountMultiplier: 0.15,
    },
    {
      level: 'platinum',
      name: 'Platinum',
      minPoints: 10000,
      benefits: ['Exclusive rewards', '20% discount', 'Free shipping', 'Priority support', 'VIP events'],
      discountMultiplier: 0.20,
    },
  ];

  /**
   * Calculate points earned from purchase
   */
  static calculatePoints(amount: number, userTier: string = 'bronze'): number {
    const rates: Record<string, number> = {
      bronze: 1,
      silver: 1.5,
      gold: 2,
      platinum: 3,
    };

    const rate = rates[userTier] || 1;
    return Math.floor(amount * rate);
  }

  /**
   * Get user tier based on points
   */
  static getUserTier(totalPoints: number): UserTier {
    const tiers = [...this.userTiers].reverse();
    for (const tier of tiers) {
      if (totalPoints >= tier.minPoints) {
        return tier;
      }
    }
    return this.userTiers[0];
  }

  /**
   * Award points
   */
  static async awardPoints(
    userId: string,
    points: number,
    reason: string
  ): Promise<PointTransaction> {
    // await prisma.pointTransaction.create({
    //   data: {
    //     userId,
    //     points,
    //     type: 'earned',
    //     description: reason,
    //   }
    // });

    return {
      id: `pt_${Date.now()}`,
      userId,
      points,
      type: 'earned',
      description: reason,
      createdAt: new Date(),
    };
  }

  /**
   * Redeem points
   */
  static async redeemPoints(
    userId: string,
    points: number,
    rewardId: string
  ): Promise<PointTransaction> {
    // Check if user has enough points
    // const userPoints = await this.getUserPoints(userId);
    // if (userPoints < points) {
    //   throw new Error('Insufficient points');
    // }

    // await prisma.pointTransaction.create({
    //   data: {
    //     userId,
    //     points: -points,
    //     type: 'redeemed',
    //     description: `Redeemed reward: ${rewardId}`,
    //   }
    // });

    return {
      id: `pt_${Date.now()}`,
      userId,
      points: -points,
      type: 'redeemed',
      description: `Redeemed reward: ${rewardId}`,
      createdAt: new Date(),
    };
  }

  /**
   * Get user total points
   */
  static async getUserPoints(userId: string): Promise<number> {
    // const transactions = await prisma.pointTransaction.findMany({
    //   where: { userId }
    // });
    // return transactions.reduce((sum, t) => sum + t.points, 0);
    return 0;
  }

  /**
   * Generate referral code
   */
  static generateReferralCode(userId: string): string {
    return `REF${userId.substring(0, 8).toUpperCase()}`;
  }

  /**
   * Award referral bonus
   */
  static async awardReferralBonus(referrerId: string, referredId: string): Promise<void> {
    // Award points to referrer
    await this.awardPoints(referrerId, 500, 'Referral bonus');
    
    // Award points to referred user
    await this.awardPoints(referredId, 250, 'Welcome bonus from referral');
  }

  /**
   * Get birthday bonus
   */
  static async getBirthdayBonus(userId: string): Promise<number> {
    return 1000; // Fixed birthday bonus
  }

  /**
   * Check if birthday bonus available
   */
  static async isBirthdayBonusAvailable(userId: string, birthDate: Date): Promise<boolean> {
    const today = new Date();
    const birthday = new Date(birthDate);
    
    return today.getMonth() === birthday.getMonth() && 
           today.getDate() === birthday.getDate();
  }
}

