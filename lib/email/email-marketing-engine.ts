/**
 * Smart Email Marketing Engine
 * Abandoned cart, re-engagement, personalized campaigns
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  trigger: 'abandoned_cart' | 'price_drop' | 'back_in_stock' | 'birthday' | 'win_back' | 'order_followup';
  timing: number; // Minutes after trigger
}

export interface EmailCampaign {
  id: string;
  name: string;
  segmentId: string;
  templateId: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  scheduledAt?: Date;
}

class EmailMarketingEngine {
  /**
   * Abandoned Cart Email Series (3 emails)
   */
  async sendAbandonedCartSeries(userId: string, cartData: any): Promise<void> {
    const emails = [
      {
        delay: 60, // 1 hour
        subject: 'Sepetinde unuttuğun ürünler var! 🛒',
        discount: 0
      },
      {
        delay: 1440, // 24 hours
        subject: 'Son şans! Sepetindeki ürünler için %10 indirim 🎁',
        discount: 10
      },
      {
        delay: 4320, // 3 days
        subject: 'Sepetindeki ürünler gidiyor... %15 indirim! ⏰',
        discount: 15
      }
    ];

    for (const email of emails) {
      setTimeout(async () => {
        await this.sendEmail({
          to: userId,
          subject: email.subject,
          template: 'abandoned_cart',
          data: { cartData, discount: email.discount }
        });
      }, email.delay * 60 * 1000);
    }
  }

  /**
   * Price Drop Alert
   */
  async sendPriceDropAlert(
    userId: string,
    product: { title: string; oldPrice: number; newPrice: number; url: string }
  ): Promise<void> {
    const discount = Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100);

    await this.sendEmail({
      to: userId,
      subject: `💰 Fiyat Düştü! ${product.title} (%${discount} indirim)`,
      template: 'price_drop',
      data: { product, discount }
    });
  }

  /**
   * Back in Stock Notification
   */
  async sendBackInStockNotification(
    userId: string,
    product: { title: string; price: number; url: string; image: string }
  ): Promise<void> {
    await this.sendEmail({
      to: userId,
      subject: `🔔 ${product.title} tekrar stokta!`,
      template: 'back_in_stock',
      data: { product }
    });
  }

  /**
   * Birthday Email (with special discount)
   */
  async sendBirthdayEmail(
    userId: string,
    userData: { name: string; birthDate: string }
  ): Promise<void> {
    const couponCode = `BIRTHDAY${new Date().getFullYear()}`;

    await this.sendEmail({
      to: userId,
      subject: `🎂 Doğum Günün Kutlu Olsun ${userData.name}! Sana Özel %20 İndirim`,
      template: 'birthday',
      data: { userData, couponCode, discount: 20 }
    });
  }

  /**
   * Win-back Email (inactive users)
   */
  async sendWinBackEmail(
    userId: string,
    userData: { name: string; lastOrderDate: string }
  ): Promise<void> {
    const daysSinceLastOrder = Math.floor(
      (Date.now() - new Date(userData.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    await this.sendEmail({
      to: userId,
      subject: `Seni özledik ${userData.name}! Geri dön, %25 indirim seni bekliyor 💝`,
      template: 'win_back',
      data: { userData, daysSinceLastOrder, discount: 25 }
    });
  }

  /**
   * Order Follow-up & Review Request
   */
  async sendOrderFollowup(
    userId: string,
    orderData: { orderNumber: string; items: any[]; deliveryDate: string }
  ): Promise<void> {
    // Wait 3 days after delivery
    setTimeout(async () => {
      await this.sendEmail({
        to: userId,
        subject: `Siparişin ${orderData.orderNumber} hakkında ne düşünüyorsun? 🌟`,
        template: 'order_followup',
        data: { orderData }
      });
    }, 3 * 24 * 60 * 60 * 1000);
  }

  /**
   * Personalized Product Recommendations
   */
  async sendPersonalizedRecommendations(
    userId: string,
    products: any[]
  ): Promise<void> {
    await this.sendEmail({
      to: userId,
      subject: 'Senin için özel seçtik! 🎯',
      template: 'personalized_recommendations',
      data: { products }
    });
  }

  /**
   * Send email (wrapper)
   */
  private async sendEmail(params: {
    to: string;
    subject: string;
    template: string;
    data: any;
  }): Promise<boolean> {
    try {
      const response = await fetch('/api/email/send-marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      return response.ok;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }

  /**
   * Create email campaign
   */
  async createCampaign(campaign: Omit<EmailCampaign, 'id' | 'sentCount' | 'openRate' | 'clickRate' | 'conversionRate'>): Promise<string> {
    try {
      const response = await fetch('/api/email/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign)
      });

      if (response.ok) {
        const data = await response.json();
        return data.campaignId;
      }
      return '';
    } catch (error) {
      console.error('Create campaign error:', error);
      return '';
    }
  }

  /**
   * Get campaign analytics
   */
  async getCampaignAnalytics(campaignId: string): Promise<EmailCampaign | null> {
    try {
      const response = await fetch(`/api/email/campaigns/${campaignId}/analytics`);
      if (response.ok) {
        const data = await response.json();
        return data.campaign;
      }
      return null;
    } catch (error) {
      console.error('Get campaign analytics error:', error);
      return null;
    }
  }
}

// Singleton instance
export const emailMarketing = new EmailMarketingEngine();

// React Hook
export function useEmailMarketing() {
  return {
    sendAbandonedCartSeries: emailMarketing.sendAbandonedCartSeries.bind(emailMarketing),
    sendPriceDropAlert: emailMarketing.sendPriceDropAlert.bind(emailMarketing),
    sendBackInStockNotification: emailMarketing.sendBackInStockNotification.bind(emailMarketing),
    sendBirthdayEmail: emailMarketing.sendBirthdayEmail.bind(emailMarketing),
    sendWinBackEmail: emailMarketing.sendWinBackEmail.bind(emailMarketing),
    sendOrderFollowup: emailMarketing.sendOrderFollowup.bind(emailMarketing),
    createCampaign: emailMarketing.createCampaign.bind(emailMarketing),
    getCampaignAnalytics: emailMarketing.getCampaignAnalytics.bind(emailMarketing)
  };
}

