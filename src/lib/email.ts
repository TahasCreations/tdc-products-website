import nodemailer from 'nodemailer';

// Email template types
interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  total: number;
  shippingAddress: string;
  trackingNumber?: string;
}

interface WelcomeEmailData {
  customerName: string;
  loginUrl: string;
}

interface PasswordResetData {
  customerName: string;
  resetUrl: string;
  expiresIn: string;
}

interface ReviewReminderData {
  customerName: string;
  productName: string;
  productImage: string;
  reviewUrl: string;
  orderNumber: string;
}

interface PriceDropData {
  customerName: string;
  productName: string;
  productImage: string;
  oldPrice: number;
  newPrice: number;
  productUrl: string;
}

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates as HTML strings
const getOrderConfirmationHTML = (data: OrderConfirmationData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sipariş Onayı - TDC Market</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #CBA135 0%, #F4D03F 100%);
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 30px 20px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer p {
      margin: 0;
      color: #6c757d;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #CBA135;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      margin: 10px 0;
    }
    .button:hover {
      background-color: #B8941F;
    }
    .order-summary {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #e9ecef;
    }
    .order-item:last-child {
      border-bottom: none;
    }
    .total {
      font-weight: bold;
      font-size: 18px;
      color: #CBA135;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 2px solid #CBA135;
    }
    .product-card {
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
      background-color: #f8f9fa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sipariş Onayı - TDC Market</h1>
    </div>
    
    <div class="content">
      <h2>Merhaba ${data.customerName},</h2>
      <p>Siparişiniz başarıyla alındı ve işleme konuldu!</p>
      
      <div class="order-summary">
        <h3>Sipariş Detayları</h3>
        <p><strong>Sipariş No:</strong> ${data.orderNumber}</p>
        
        <h4>Ürünler:</h4>
        ${data.items.map(item => `
          <div class="order-item">
            <div>
              <strong>${item.name}</strong><br>
              <span>Adet: ${item.quantity}</span>
            </div>
            <div>₺${(item.price * item.quantity).toLocaleString()}</div>
          </div>
        `).join('')}
        
        <div class="total">
          Toplam: ₺${data.total.toLocaleString()}
        </div>
      </div>

      <div class="product-card">
        <h4>Teslimat Adresi:</h4>
        <p>${data.shippingAddress}</p>
        ${data.trackingNumber ? `
          <h4>Kargo Takip Numarası:</h4>
          <p><strong>${data.trackingNumber}</strong></p>
        ` : ''}
      </div>

      <p>Siparişinizin durumunu takip etmek için 
        <a href="https://tdcmarket.com/orders" class="button">
          Siparişlerim
        </a> sayfasını ziyaret edebilirsiniz.
      </p>
      
      <p>Teşekkürler,<br />TDC Market Ekibi</p>
    </div>
    
    <div class="footer">
      <p>TDC Market - Türkiye'nin En Büyük Online Alışveriş Platformu</p>
      <p>
        <a href="https://tdcmarket.com">Web Sitesi</a> |
        <a href="https://tdcmarket.com/hakkimizda">Hakkımızda</a> |
        <a href="https://tdcmarket.com/iletisim">İletişim</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

const getWelcomeHTML = (data: WelcomeEmailData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TDC Market'e Hoş Geldiniz!</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #CBA135 0%, #F4D03F 100%);
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 30px 20px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer p {
      margin: 0;
      color: #6c757d;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #CBA135;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      margin: 10px 0;
    }
    .button:hover {
      background-color: #B8941F;
    }
    .product-card {
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
      background-color: #f8f9fa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>TDC Market'e Hoş Geldiniz!</h1>
    </div>
    
    <div class="content">
      <h2>Merhaba ${data.customerName},</h2>
      <p>TDC Market'e hoş geldiniz! Hesabınız başarıyla oluşturuldu.</p>
      
      <div class="product-card">
        <h3>Neler yapabilirsiniz?</h3>
        <ul>
          <li>Binlerce ürün arasından seçim yapın</li>
          <li>Favori ürünlerinizi kaydedin</li>
          <li>Hızlı ve güvenli ödeme yapın</li>
          <li>Ücretsiz kargo fırsatlarından yararlanın</li>
        </ul>
      </div>

      <p>
        <a href="${data.loginUrl}" class="button">
          Hesabıma Giriş Yap
        </a>
      </p>
      
      <p>Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.</p>
      
      <p>Teşekkürler,<br />TDC Market Ekibi</p>
    </div>
    
    <div class="footer">
      <p>TDC Market - Türkiye'nin En Büyük Online Alışveriş Platformu</p>
      <p>
        <a href="https://tdcmarket.com">Web Sitesi</a> |
        <a href="https://tdcmarket.com/hakkimizda">Hakkımızda</a> |
        <a href="https://tdcmarket.com/iletisim">İletişim</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

// Email sending functions
export const sendOrderConfirmation = async (to: string, data: OrderConfirmationData) => {
  const transporter = createTransporter();
  const html = getOrderConfirmationHTML(data);
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: `Sipariş Onayı - ${data.orderNumber}`,
    html,
  });
};

export const sendWelcomeEmail = async (to: string, data: WelcomeEmailData) => {
  const transporter = createTransporter();
  const html = getWelcomeHTML(data);
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: 'TDC Market\'e Hoş Geldiniz!',
    html,
  });
};

export const sendPasswordReset = async (to: string, data: PasswordResetData) => {
  const transporter = createTransporter();
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Şifre Sıfırlama - TDC Market</title>
    </head>
    <body>
      <h2>Merhaba ${data.customerName},</h2>
      <p>Hesabınız için şifre sıfırlama talebinde bulundunuz.</p>
      <p>
        <a href="${data.resetUrl}" style="background-color: #CBA135; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Şifremi Sıfırla
        </a>
      </p>
      <p><strong>Bu bağlantı ${data.expiresIn} sonra geçersiz olacaktır.</strong></p>
      <p>Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
      <p>Teşekkürler,<br />TDC Market Ekibi</p>
    </body>
    </html>
  `;
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Şifre Sıfırlama - TDC Market',
    html,
  });
};

export const sendReviewReminder = async (to: string, data: ReviewReminderData) => {
  const transporter = createTransporter();
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Ürün Değerlendirmesi - TDC Market</title>
    </head>
    <body>
      <h2>Merhaba ${data.customerName},</h2>
      <p>Siparişinizdeki ürünleri değerlendirmeyi unutmayın!</p>
      
      <div style="border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 15px 0;">
        <h3>Değerlendirme Bekleyen Ürün:</h3>
        <div style="display: flex; align-items: center; gap: 15px;">
          <img src="${data.productImage}" alt="${data.productName}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
          <div>
            <h4>${data.productName}</h4>
            <p>Sipariş No: ${data.orderNumber}</p>
          </div>
        </div>
      </div>

      <p>Deneyiminizi diğer müşterilerle paylaşarak onlara yardımcı olabilirsiniz.</p>
      
      <p>
        <a href="${data.reviewUrl}" style="background-color: #CBA135; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Ürünü Değerlendir
        </a>
      </p>
      
      <p>Teşekkürler,<br />TDC Market Ekibi</p>
    </body>
    </html>
  `;
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Ürün Değerlendirmesi - TDC Market',
    html,
  });
};

export const sendPriceDropAlert = async (to: string, data: PriceDropData) => {
  const transporter = createTransporter();
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Fiyat Düşüşü! - TDC Market</title>
    </head>
    <body>
      <h2>Merhaba ${data.customerName},</h2>
      <p>Favorilerinizdeki ürünün fiyatı düştü! 🎉</p>
      
      <div style="border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 15px 0;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <img src="${data.productImage}" alt="${data.productName}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
          <div>
            <h3>${data.productName}</h3>
            <div style="font-size: 18px; margin: 10px 0;">
              <span style="text-decoration: line-through; color: #999; margin-right: 10px;">
                ₺${data.oldPrice.toLocaleString()}
              </span>
              <span style="color: #CBA135; font-weight: bold; font-size: 24px;">
                ₺${data.newPrice.toLocaleString()}
              </span>
            </div>
            <p style="color: #28a745; font-weight: bold;">
              ₺${(data.oldPrice - data.newPrice).toLocaleString()} tasarruf!
            </p>
          </div>
        </div>
      </div>

      <p>Bu fırsatı kaçırmayın! Ürün stokta sınırlı olabilir.</p>
      
      <p>
        <a href="${data.productUrl}" style="background-color: #CBA135; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Hemen Satın Al
        </a>
      </p>
      
      <p>Teşekkürler,<br />TDC Market Ekibi</p>
    </body>
    </html>
  `;
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: `Fiyat Düşüşü! ${data.productName}`,
    html,
  });
};

// Bulk email functions
export const sendBulkEmails = async (emails: string[], subject: string, html: string) => {
  const transporter = createTransporter();
  
  const promises = emails.map(to => 
    transporter.sendMail({
      from: `"TDC Market" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    })
  );
  
  return Promise.allSettled(promises);
};

// Email queue functions (for background processing)
export const queueEmail = async (type: string, data: any, to: string, delay?: number) => {
  // TODO: Implement email queue system (Redis, Bull, etc.)
  console.log(`Email queued: ${type} to ${to}`, data);
  
  // For now, send immediately
  switch (type) {
    case 'order_confirmation':
      return sendOrderConfirmation(to, data);
    case 'welcome':
      return sendWelcomeEmail(to, data);
    case 'password_reset':
      return sendPasswordReset(to, data);
    case 'review_reminder':
      return sendReviewReminder(to, data);
    case 'price_drop':
      return sendPriceDropAlert(to, data);
    default:
      throw new Error(`Unknown email type: ${type}`);
  }
};