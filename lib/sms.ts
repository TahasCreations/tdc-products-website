/**
 * SMS Notification Service
 * Twilio, Netgsm veya diğer SMS gateway'leri ile entegrasyon
 */

interface SMSTemplate {
  orderConfirmation: (orderNumber: string, total: number) => string;
  orderShipped: (orderNumber: string, trackingCode: string) => string;
  orderDelivered: (orderNumber: string) => string;
  priceAlert: (productName: string, oldPrice: number, newPrice: number) => string;
  campaign: (campaignName: string, discount: number) => string;
  otp: (code: string) => string;
}

export const SMS_TEMPLATES: SMSTemplate = {
  orderConfirmation: (orderNumber, total) =>
    `TDC Market: Siparişiniz ${orderNumber} alındı. Toplam: ${total}TL. Teşekkürler!`,
  
  orderShipped: (orderNumber, trackingCode) =>
    `TDC Market: ${orderNumber} numaralı siparişiniz kargoya verildi. Takip kodu: ${trackingCode}`,
  
  orderDelivered: (orderNumber) =>
    `TDC Market: ${orderNumber} numaralı siparişiniz teslim edildi. Keyifli alışverişler!`,
  
  priceAlert: (productName, oldPrice, newPrice) =>
    `TDC Market: ${productName} fiyatı düştü! ${oldPrice}TL -> ${newPrice}TL. Hemen al!`,
  
  campaign: (campaignName, discount) =>
    `TDC Market: ${campaignName} başladı! %${discount} indirim. Kaçırma!`,
  
  otp: (code) =>
    `TDC Market: Doğrulama kodunuz: ${code}. 5 dakika geçerlidir.`,
};

export async function sendSMS(
  phoneNumber: string,
  message: string,
  provider: 'twilio' | 'netgsm' | 'mock' = 'mock'
): Promise<boolean> {
  try {
    if (provider === 'mock') {
      // Development/test için mock implementation
      console.log(`📱 SMS to ${phoneNumber}: ${message}`);
      return true;
    }

    if (provider === 'twilio') {
      return await sendViaTwilio(phoneNumber, message);
    }

    if (provider === 'netgsm') {
      return await sendViaNetgsm(phoneNumber, message);
    }

    return false;
  } catch (error) {
    console.error('SMS send error:', error);
    return false;
  }
}

async function sendViaTwilio(phone: string, message: string): Promise<boolean> {
  // Twilio entegrasyonu
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.error('Twilio credentials missing');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phone,
          From: fromNumber,
          Body: message,
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Twilio error:', error);
    return false;
  }
}

async function sendViaNetgsm(phone: string, message: string): Promise<boolean> {
  // Netgsm entegrasyonu (Türkiye)
  const username = process.env.NETGSM_USERNAME;
  const password = process.env.NETGSM_PASSWORD;
  const header = process.env.NETGSM_HEADER || 'TDC MARKET';

  if (!username || !password) {
    console.error('Netgsm credentials missing');
    return false;
  }

  try {
    const response = await fetch('https://api.netgsm.com.tr/sms/send/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        usercode: username,
        password: password,
        gsmno: phone.replace(/\D/g, ''), // Sadece rakamlar
        message: message,
        msgheader: header,
      }),
    });

    const result = await response.text();
    return result.startsWith('00'); // Success code
  } catch (error) {
    console.error('Netgsm error:', error);
    return false;
  }
}

// Batch SMS gönderimi
export async function sendBulkSMS(
  recipients: Array<{ phone: string; message: string }>,
  provider: 'twilio' | 'netgsm' | 'mock' = 'mock'
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const success = await sendSMS(recipient.phone, recipient.message, provider);
    if (success) sent++;
    else failed++;
  }

  return { sent, failed };
}

// SMS kampanya oluşturma
export async function sendCampaignSMS(
  userPhones: string[],
  campaignName: string,
  discount: number
): Promise<void> {
  const message = SMS_TEMPLATES.campaign(campaignName, discount);
  const recipients = userPhones.map(phone => ({ phone, message }));
  
  const result = await sendBulkSMS(recipients);
  console.log(`Campaign SMS sent: ${result.sent} success, ${result.failed} failed`);
}

