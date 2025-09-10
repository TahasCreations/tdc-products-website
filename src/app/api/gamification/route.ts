import { NextRequest, NextResponse } from 'next/server';

interface User {
  id: string;
  email: string;
  name: string;
  level: number;
  experience: number;
  points: number;
  badges: string[];
  achievements: string[];
  streak: number;
  lastActivity: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'shopping' | 'social' | 'engagement' | 'loyalty';
  requirement: {
    type: string;
    value: number;
  };
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID gerekli'
      }, { status: 400 });
    }

    // Demo achievements and badges
    const achievements: Achievement[] = [
      {
        id: 'first_purchase',
        name: 'İlk Alışveriş',
        description: 'İlk figürünüzü satın aldınız!',
        icon: 'ri-shopping-bag-line',
        points: 100,
        category: 'shopping',
        requirement: { type: 'purchase_count', value: 1 }
      },
      {
        id: 'collector',
        name: 'Koleksiyoncu',
        description: '10 farklı figür satın aldınız!',
        icon: 'ri-collection-line',
        points: 500,
        category: 'shopping',
        requirement: { type: 'unique_products', value: 10 }
      },
      {
        id: 'reviewer',
        name: 'Değerlendirici',
        description: 'İlk yorumunuzu yazdınız!',
        icon: 'ri-star-line',
        points: 50,
        category: 'engagement',
        requirement: { type: 'review_count', value: 1 }
      },
      {
        id: 'social_butterfly',
        name: 'Sosyal Kelebek',
        description: '5 arkadaşınızı davet ettiniz!',
        icon: 'ri-user-add-line',
        points: 300,
        category: 'social',
        requirement: { type: 'referrals', value: 5 }
      },
      {
        id: 'loyal_customer',
        name: 'Sadık Müşteri',
        description: '30 gün üst üste aktif oldunuz!',
        icon: 'ri-heart-line',
        points: 200,
        category: 'loyalty',
        requirement: { type: 'streak_days', value: 30 }
      },
      {
        id: 'big_spender',
        name: 'Büyük Harcayıcı',
        description: '₺1000 değerinde alışveriş yaptınız!',
        icon: 'ri-money-dollar-circle-line',
        points: 1000,
        category: 'shopping',
        requirement: { type: 'total_spent', value: 1000 }
      }
    ];

    const badges: Badge[] = [
      {
        id: 'newbie',
        name: 'Acemi',
        description: 'Yeni başlayan koleksiyoncu',
        icon: 'ri-seedling-line',
        rarity: 'common',
        requirements: ['İlk giriş yapın']
      },
      {
        id: 'bronze_collector',
        name: 'Bronz Koleksiyoncu',
        description: 'Bronz seviye koleksiyoncu',
        icon: 'ri-medal-line',
        rarity: 'common',
        requirements: ['5 figür satın alın']
      },
      {
        id: 'silver_collector',
        name: 'Gümüş Koleksiyoncu',
        description: 'Gümüş seviye koleksiyoncu',
        icon: 'ri-medal-2-line',
        rarity: 'rare',
        requirements: ['15 figür satın alın', 'Seviye 5\'e ulaşın']
      },
      {
        id: 'gold_collector',
        name: 'Altın Koleksiyoncu',
        description: 'Altın seviye koleksiyoncu',
        icon: 'ri-medal-fill',
        rarity: 'epic',
        requirements: ['30 figür satın alın', 'Seviye 10\'a ulaşın']
      },
      {
        id: 'legendary_collector',
        name: 'Efsanevi Koleksiyoncu',
        description: 'Efsanevi seviye koleksiyoncu',
        icon: 'ri-crown-line',
        rarity: 'legendary',
        requirements: ['50 figür satın alın', 'Seviye 20\'ye ulaşın', '₺5000 harcayın']
      }
    ];

    // Demo user data
    const demoUser: User = {
      id: userId,
      email: 'demo@tdc.com',
      name: 'Demo Kullanıcı',
      level: 5,
      experience: 1250,
      points: 2500,
      badges: ['newbie', 'bronze_collector'],
      achievements: ['first_purchase', 'reviewer'],
      streak: 7,
      lastActivity: new Date().toISOString()
    };

    switch (action) {
      case 'get_user':
        return NextResponse.json({
          success: true,
          user: demoUser,
          achievements: achievements,
          badges: badges
        });

      case 'get_leaderboard':
        const leaderboard = [
          { ...demoUser, rank: 1, name: 'Demo Kullanıcı' },
          { ...demoUser, id: '2', rank: 2, name: 'Anime Fan', level: 8, points: 3200 },
          { ...demoUser, id: '3', rank: 3, name: 'Gaming Master', level: 6, points: 2800 },
          { ...demoUser, id: '4', rank: 4, name: 'Collector Pro', level: 4, points: 2100 },
          { ...demoUser, id: '5', rank: 5, name: 'Figür Lover', level: 3, points: 1800 }
        ];
        
        return NextResponse.json({
          success: true,
          leaderboard: leaderboard,
          userRank: 1
        });

      case 'get_achievements':
        return NextResponse.json({
          success: true,
          achievements: achievements,
          userAchievements: demoUser.achievements
        });

      case 'get_badges':
        return NextResponse.json({
          success: true,
          badges: badges,
          userBadges: demoUser.badges
        });

      default:
        return NextResponse.json({
          success: true,
          user: demoUser,
          achievements: achievements,
          badges: badges,
          leaderboard: [
            { ...demoUser, rank: 1, name: 'Demo Kullanıcı' },
            { ...demoUser, id: '2', rank: 2, name: 'Anime Fan', level: 8, points: 3200 },
            { ...demoUser, id: '3', rank: 3, name: 'Gaming Master', level: 6, points: 2800 }
          ]
        });
    }

  } catch (error) {
    console.error('Gamification API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Gamification verileri alınırken bir hata oluştu'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action, data } = await request.json();

    if (!userId || !action) {
      return NextResponse.json({
        success: false,
        error: 'User ID ve action gerekli'
      }, { status: 400 });
    }

    // Simulate different actions
    switch (action) {
      case 'earn_points':
        const points = data?.points || 10;
        return NextResponse.json({
          success: true,
          message: `${points} puan kazandınız!`,
          pointsEarned: points,
          newTotal: 2500 + points
        });

      case 'complete_achievement':
        const achievementId = data?.achievementId;
        return NextResponse.json({
          success: true,
          message: 'Başarı tamamlandı!',
          achievement: {
            id: achievementId,
            name: 'Yeni Başarı',
            points: 100
          }
        });

      case 'unlock_badge':
        const badgeId = data?.badgeId;
        return NextResponse.json({
          success: true,
          message: 'Yeni rozet kazandınız!',
          badge: {
            id: badgeId,
            name: 'Yeni Rozet',
            rarity: 'rare'
          }
        });

      case 'level_up':
        return NextResponse.json({
          success: true,
          message: 'Seviye atladınız!',
          newLevel: 6,
          rewards: {
            points: 200,
            badge: 'level_up_badge'
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Geçersiz action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Gamification POST Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'İşlem gerçekleştirilirken bir hata oluştu'
    }, { status: 500 });
  }
}
