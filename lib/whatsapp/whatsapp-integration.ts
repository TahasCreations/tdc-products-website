/**
 * WhatsApp Business Integration
 * Order tracking, customer support, notifications
 */

export interface WhatsAppMessage {
  to: string; // Phone number with country code (e.g., +905551234567)
  message: string;
  type: 'text' | 'template' | 'media';
  templateName?: string;
  templateParams?: string[];
  mediaUrl?: string;
}

class WhatsAppIntegration {
  private apiUrl: string;
  private accessToken: string;
  private phoneNumberId: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  }

  /**
   * Send a text message
   */
  async sendTextMessage(to: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: this.formatPhoneNumber(to),
            type: 'text',
            text: { body: message },
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('WhatsApp send message error:', error);
      return false;
    }
  }

  /**
   * Send order confirmation
   */
  async sendOrderConfirmation(
    phoneNumber: string,
    orderNumber: string,
    totalAmount: number,
    items: string[]
  ): Promise<boolean> {
    const message = `
🎉 *Siparişiniz Alındı!*

Sipariş No: *${orderNumber}*
Toplam: *${totalAmount.toLocaleString('tr-TR')} ₺*

📦 Ürünler:
${items.map((item, i) => `${i + 1}. ${item}`).join('\n')}

Siparişinizi en kısa sürede hazırlayıp kargoya vereceğiz.

Takip için: ${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderNumber}
    `.trim();

    return this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Send shipping notification
   */
  async sendShippingNotification(
    phoneNumber: string,
    orderNumber: string,
    trackingNumber: string,
    carrier: string
  ): Promise<boolean> {
    const message = `
📦 *Kargoya Verildi!*

Sipariş No: *${orderNumber}*
Kargo Firması: *${carrier}*
Takip No: *${trackingNumber}*

Kargonuzu takip etmek için:
${process.env.NEXT_PUBLIC_APP_URL}/shipping/track?tracking=${trackingNumber}

Kargonuz 2-3 iş günü içinde adresinizde olacak.
    `.trim();

    return this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Send delivery notification
   */
  async sendDeliveryNotification(
    phoneNumber: string,
    orderNumber: string
  ): Promise<boolean> {
    const message = `
✅ *Teslim Edildi!*

Sipariş No: *${orderNumber}*

Ürününüz teslim edildi. Alışverişiniz için teşekkür ederiz! 🎉

Deneyiminizi değerlendirmek ister misiniz?
${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderNumber}/review
    `.trim();

    return this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Send support message
   */
  async sendSupportMessage(
    phoneNumber: string,
    message: string,
    ticketNumber?: string
  ): Promise<boolean> {
    const fullMessage = ticketNumber
      ? `🎧 *Destek Mesajı* (Talep #${ticketNumber})\n\n${message}`
      : `🎧 *Destek Mesajı*\n\n${message}`;

    return this.sendTextMessage(phoneNumber, fullMessage);
  }

  /**
   * Send promotional message
   */
  async sendPromotionalMessage(
    phoneNumber: string,
    title: string,
    description: string,
    couponCode?: string
  ): Promise<boolean> {
    let message = `
🎁 *${title}*

${description}
    `.trim();

    if (couponCode) {
      message += `\n\nKupon Kodunuz: *${couponCode}*`;
    }

    message += `\n\nHemen alışverişe başla: ${process.env.NEXT_PUBLIC_APP_URL}`;

    return this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Send stock alert
   */
  async sendStockAlert(
    phoneNumber: string,
    productName: string,
    productUrl: string
  ): Promise<boolean> {
    const message = `
🔔 *Stokta!*

Beklediğiniz ürün tekrar stokta:
*${productName}*

Hemen satın al: ${productUrl}

⚡ Stoklar tükenebilir!
    `.trim();

    return this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Send price drop alert
   */
  async sendPriceDropAlert(
    phoneNumber: string,
    productName: string,
    oldPrice: number,
    newPrice: number,
    productUrl: string
  ): Promise<boolean> {
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

    const message = `
💰 *Fiyat Düştü!*

${productName}

Eski Fiyat: ~~${oldPrice.toLocaleString('tr-TR')} ₺~~
Yeni Fiyat: *${newPrice.toLocaleString('tr-TR')} ₺*

📉 %${discount} indirim!

Hemen satın al: ${productUrl}
    `.trim();

    return this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Format phone number to international format
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');

    // If starts with 0, remove it
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }

    // If doesn't start with country code, add Turkey code
    if (!cleaned.startsWith('90')) {
      cleaned = '90' + cleaned;
    }

    return '+' + cleaned;
  }

  /**
   * Generate WhatsApp chat link
   */
  generateChatLink(phoneNumber?: string, message?: string): string {
    const phone = phoneNumber || process.env.WHATSAPP_BUSINESS_NUMBER || '905551234567';
    const formattedPhone = this.formatPhoneNumber(phone).replace('+', '');
    
    let url = `https://wa.me/${formattedPhone}`;
    
    if (message) {
      url += `?text=${encodeURIComponent(message)}`;
    }
    
    return url;
  }
}

// Singleton instance
export const whatsappIntegration = new WhatsAppIntegration();

// React Hook
export function useWhatsApp() {
  const sendOrderConfirmation = (phoneNumber: string, orderNumber: string, totalAmount: number, items: string[]) => {
    return whatsappIntegration.sendOrderConfirmation(phoneNumber, orderNumber, totalAmount, items);
  };

  const sendShippingNotification = (phoneNumber: string, orderNumber: string, trackingNumber: string, carrier: string) => {
    return whatsappIntegration.sendShippingNotification(phoneNumber, orderNumber, trackingNumber, carrier);
  };

  const sendSupportMessage = (phoneNumber: string, message: string, ticketNumber?: string) => {
    return whatsappIntegration.sendSupportMessage(phoneNumber, message, ticketNumber);
  };

  const generateChatLink = (phoneNumber?: string, message?: string) => {
    return whatsappIntegration.generateChatLink(phoneNumber, message);
  };

  return {
    sendOrderConfirmation,
    sendShippingNotification,
    sendSupportMessage,
    generateChatLink
  };
}

