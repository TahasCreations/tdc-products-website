/**
 * Gamification Engine
 * Points, levels, achievements, challenges system
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'shopping' | 'social' | 'engagement' | 'loyalty';
  requirement: {
    type: 'order_count' | 'review_count' | 'referral_count' | 'wishlist_count' | 'login_streak' | 'total_spent';
    target: number;
  };
  isUnlocked: boolean;
  progress: number;
  unlockedAt?: Date;
}

export interface Level {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  benefits: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  reward: number;
  requirement: {
    type: string;
    target: number;
  };
  progress: number;
  isCompleted: boolean;
  expiresAt: Date;
}

export interface UserGamificationData {
  totalPoints: number;
  currentLevel: number;
  nextLevelPoints: number;
  achievements: Achievement[];
  completedChallenges: number;
  activeChallenges: Challenge[];
  loginStreak: number;
  lastLoginDate?: Date;
}

class GamificationEngine {
  private levels: Level[] = [
    { level: 1, name: 'Yeni Başlayan', minPoints: 0, maxPoints: 99, color: '#CD7F32', benefits: ['Hoş geldin bonusu'] },
    { level: 2, name: 'Bronz', minPoints: 100, maxPoints: 299, color: '#CD7F32', benefits: ['%5 ekstra puan'] },
    { level: 3, name: 'Gümüş', minPoints: 300, maxPoints: 599, color: '#C0C0C0', benefits: ['%10 ekstra puan', 'Bedava kargo (ayda 1)'] },
    { level: 4, name: 'Altın', minPoints: 600, maxPoints: 999, color: '#FFD700', benefits: ['%15 ekstra puan', 'Bedava kargo (ayda 2)', 'Özel indirimler'] },
    { level: 5, name: 'Platin', minPoints: 1000, maxPoints: 1999, color: '#E5E4E2', benefits: ['%20 ekstra puan', 'Sınırsız bedava kargo', 'VIP destek'] },
    { level: 6, name: 'Elmas', minPoints: 2000, maxPoints: Infinity, color: '#B9F2FF', benefits: ['%25 ekstra puan', 'Tüm avantajlar', 'Erken erişim', 'Özel hediyeler'] }
  ];

  private achievements: Omit<Achievement, 'isUnlocked' | 'progress' | 'unlockedAt'>[] = [
    {
      id: 'first_order',
      name: 'İlk Adım',
      description: 'İlk siparişini ver',
      icon: '🎉',
      points: 50,
      category: 'shopping',
      requirement: { type: 'order_count', target: 1 }
    },
    {
      id: 'five_orders',
      name: 'Sadık Müşteri',
      description: '5 sipariş tamamla',
      icon: '⭐',
      points: 100,
      category: 'shopping',
      requirement: { type: 'order_count', target: 5 }
    },
    {
      id: 'ten_orders',
      name: 'Alışveriş Tutkunu',
      description: '10 sipariş tamamla',
      icon: '🏆',
      points: 200,
      category: 'shopping',
      requirement: { type: 'order_count', target: 10 }
    },
    {
      id: 'first_review',
      name: 'İlk Yorum',
      description: 'İlk ürün yorumunu yaz',
      icon: '✍️',
      points: 25,
      category: 'social',
      requirement: { type: 'review_count', target: 1 }
    },
    {
      id: 'five_reviews',
      name: 'Yorum Uzmanı',
      description: '5 ürün yorumu yaz',
      icon: '📝',
      points: 75,
      category: 'social',
      requirement: { type: 'review_count', target: 5 }
    },
    {
      id: 'first_referral',
      name: 'Arkadaş Getiren',
      description: 'İlk arkadaşını davet et',
      icon: '🤝',
      points: 100,
      category: 'social',
      requirement: { type: 'referral_count', target: 1 }
    },
    {
      id: 'five_referrals',
      name: 'Influencer',
      description: '5 arkadaşını davet et',
      icon: '🌟',
      points: 300,
      category: 'social',
      requirement: { type: 'referral_count', target: 5 }
    },
    {
      id: 'wishlist_collector',
      name: 'Koleksiyoncu',
      description: '10 ürünü favorile',
      icon: '❤️',
      points: 30,
      category: 'engagement',
      requirement: { type: 'wishlist_count', target: 10 }
    },
    {
      id: 'week_streak',
      name: '7 Gün Serisi',
      description: '7 gün üst üste giriş yap',
      icon: '🔥',
      points: 50,
      category: 'engagement',
      requirement: { type: 'login_streak', target: 7 }
    },
    {
      id: 'big_spender',
      name: 'Cömert Alıcı',
      description: 'Toplam 1000₺ alışveriş yap',
      icon: '💰',
      points: 150,
      category: 'loyalty',
      requirement: { type: 'total_spent', target: 1000 }
    },
    {
      id: 'vip_spender',
      name: 'VIP Müşteri',
      description: 'Toplam 5000₺ alışveriş yap',
      icon: '👑',
      points: 500,
      category: 'loyalty',
      requirement: { type: 'total_spent', target: 5000 }
    }
  ];

  /**
   * Get user level based on points
   */
  getUserLevel(points: number): Level {
    return this.levels.find(level => 
      points >= level.minPoints && points <= level.maxPoints
    ) || this.levels[0];
  }

  /**
   * Get next level info
   */
  getNextLevel(currentPoints: number): { level: Level; pointsNeeded: number } | null {
    const currentLevel = this.getUserLevel(currentPoints);
    const nextLevel = this.levels.find(level => level.level === currentLevel.level + 1);
    
    if (!nextLevel) return null;
    
    return {
      level: nextLevel,
      pointsNeeded: nextLevel.minPoints - currentPoints
    };
  }

  /**
   * Award points
   */
  async awardPoints(userId: string, points: number, reason: string): Promise<number> {
    try {
      const response = await fetch('/api/gamification/award-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, points, reason })
      });

      if (response.ok) {
        const data = await response.json();
        return data.totalPoints;
      }
      return 0;
    } catch (error) {
      console.error('Award points error:', error);
      return 0;
    }
  }

  /**
   * Check and unlock achievements
   */
  checkAchievements(userData: {
    orderCount: number;
    reviewCount: number;
    referralCount: number;
    wishlistCount: number;
    loginStreak: number;
    totalSpent: number;
  }): Achievement[] {
    const unlocked: Achievement[] = [];

    for (const achievement of this.achievements) {
      const { type, target } = achievement.requirement;
      let progress = 0;
      let isUnlocked = false;

      switch (type) {
        case 'order_count':
          progress = (userData.orderCount / target) * 100;
          isUnlocked = userData.orderCount >= target;
          break;
        case 'review_count':
          progress = (userData.reviewCount / target) * 100;
          isUnlocked = userData.reviewCount >= target;
          break;
        case 'referral_count':
          progress = (userData.referralCount / target) * 100;
          isUnlocked = userData.referralCount >= target;
          break;
        case 'wishlist_count':
          progress = (userData.wishlistCount / target) * 100;
          isUnlocked = userData.wishlistCount >= target;
          break;
        case 'login_streak':
          progress = (userData.loginStreak / target) * 100;
          isUnlocked = userData.loginStreak >= target;
          break;
        case 'total_spent':
          progress = (userData.totalSpent / target) * 100;
          isUnlocked = userData.totalSpent >= target;
          break;
      }

      if (isUnlocked) {
        unlocked.push({
          ...achievement,
          isUnlocked: true,
          progress: 100,
          unlockedAt: new Date()
        });
      }
    }

    return unlocked;
  }

  /**
   * Generate daily challenges
   */
  generateDailyChallenges(): Challenge[] {
    const challenges: Challenge[] = [
      {
        id: 'daily_login',
        title: 'Günlük Giriş',
        description: 'Bugün siteye giriş yap',
        type: 'daily',
        reward: 5,
        requirement: { type: 'login', target: 1 },
        progress: 0,
        isCompleted: false,
        expiresAt: this.getEndOfDay()
      },
      {
        id: 'daily_browse',
        title: 'Ürün Keşfi',
        description: '5 ürünü incele',
        type: 'daily',
        reward: 10,
        requirement: { type: 'product_view', target: 5 },
        progress: 0,
        isCompleted: false,
        expiresAt: this.getEndOfDay()
      },
      {
        id: 'daily_wishlist',
        title: 'Favori Ekle',
        description: '3 ürünü favorilere ekle',
        type: 'daily',
        reward: 15,
        requirement: { type: 'wishlist_add', target: 3 },
        progress: 0,
        isCompleted: false,
        expiresAt: this.getEndOfDay()
      }
    ];

    return challenges;
  }

  /**
   * Generate weekly challenges
   */
  generateWeeklyChallenges(): Challenge[] {
    const challenges: Challenge[] = [
      {
        id: 'weekly_order',
        title: 'Haftalık Alışveriş',
        description: 'Bu hafta 1 sipariş ver',
        type: 'weekly',
        reward: 50,
        requirement: { type: 'order', target: 1 },
        progress: 0,
        isCompleted: false,
        expiresAt: this.getEndOfWeek()
      },
      {
        id: 'weekly_review',
        title: 'Yorum Yaz',
        description: 'Bu hafta 3 ürün yorumu yaz',
        type: 'weekly',
        reward: 75,
        requirement: { type: 'review', target: 3 },
        progress: 0,
        isCompleted: false,
        expiresAt: this.getEndOfWeek()
      },
      {
        id: 'weekly_referral',
        title: 'Arkadaş Davet Et',
        description: 'Bu hafta 1 arkadaşını davet et',
        type: 'weekly',
        reward: 100,
        requirement: { type: 'referral', target: 1 },
        progress: 0,
        isCompleted: false,
        expiresAt: this.getEndOfWeek()
      }
    ];

    return challenges;
  }

  /**
   * Helper: Get end of day
   */
  private getEndOfDay(): Date {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
  }

  /**
   * Helper: Get end of week
   */
  private getEndOfWeek(): Date {
    const date = new Date();
    const day = date.getDay();
    const diff = 7 - day;
    date.setDate(date.getDate() + diff);
    date.setHours(23, 59, 59, 999);
    return date;
  }

  /**
   * Get all levels
   */
  getAllLevels(): Level[] {
    return this.levels;
  }

  /**
   * Get all achievements
   */
  getAllAchievements(): Omit<Achievement, 'isUnlocked' | 'progress' | 'unlockedAt'>[] {
    return this.achievements;
  }
}

// Singleton instance
export const gamificationEngine = new GamificationEngine();

// React Hook
export function useGamification() {
  return {
    getUserLevel: gamificationEngine.getUserLevel.bind(gamificationEngine),
    getNextLevel: gamificationEngine.getNextLevel.bind(gamificationEngine),
    awardPoints: gamificationEngine.awardPoints.bind(gamificationEngine),
    checkAchievements: gamificationEngine.checkAchievements.bind(gamificationEngine),
    getAllLevels: gamificationEngine.getAllLevels.bind(gamificationEngine),
    getAllAchievements: gamificationEngine.getAllAchievements.bind(gamificationEngine),
    generateDailyChallenges: gamificationEngine.generateDailyChallenges.bind(gamificationEngine),
    generateWeeklyChallenges: gamificationEngine.generateWeeklyChallenges.bind(gamificationEngine)
  };
}

