import nodemailer from 'nodemailer';

// Email template types
interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  items: Array<{
    name?: string;
    title?: string;
    price: number;
    quantity?: number;
    qty?: number;
    image?: string;
  }>;
  total: number;
  shippingAddress?: string;
  trackingNumber?: string;
  paymentMethod?: string;
  orderUrl?: string;
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

interface SellerApplicationApprovedData {
  sellerName: string;
  storeName: string;
  dashboardUrl: string;
}

interface SellerApplicationRejectedData {
  sellerName: string;
  reason?: string;
  contactUrl: string;
}

interface InfluencerApplicationApprovedData {
  influencerName: string;
  dashboardUrl: string;
}

interface InfluencerApplicationRejectedData {
  influencerName: string;
  reason?: string;
  contactUrl: string;
}

interface PaymentSuccessData {
  customerName: string;
  orderNumber: string;
  total: number;
  paymentMethod: string;
  orderUrl: string;
}

interface OrderShippedData {
  customerName: string;
  orderNumber: string;
  trackingCode: string;
  trackingCarrier: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
}

interface OrderDeliveredData {
  customerName: string;
  orderNumber: string;
  reviewUrl: string;
}

interface SellerNewOrderData {
  sellerName: string;
  items: Array<{
    title: string;
    qty: number;
  }>;
  orderCount: number;
}

interface BankTransferInstructionsData {
  customerName: string;
  orderNumber: string;
  amount: number;
  currency: string;
  reference: string;
  expiresAt: string;
  bankAccounts: Array<{
    bankName: string;
    accountName: string;
    iban: string;
    accountNumber: string;
    branchName: string;
  }>;
}

interface PaymentReminderData {
  customerName: string;
  orderNumber: string;
  amount: number;
  currency: string;
  reference: string;
  expiresAt: string;
  bankAccounts: Array<{
    bankName: string;
    accountName: string;
    iban: string;
    accountNumber: string;
    branchName: string;
  }>;
}

interface RefundNotificationData {
  customerName: string;
  orderNumber: string;
  refundAmount: number;
  refundMethod: string;
  returnRequestId: string;
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
        ${data.items.map(item => {
          const itemName = item.name || item.title || "Ürün";
          const itemQty = item.quantity || item.qty || 1;
          return `
          <div class="order-item">
            <div>
              <strong>${itemName}</strong><br>
              <span>Adet: ${itemQty}</span>
            </div>
            <div>₺${(item.price * itemQty).toLocaleString()}</div>
          </div>
        `;
        }).join('')}
        
        <div class="total">
          Toplam: ₺${data.total.toLocaleString()}
        </div>
        ${data.paymentMethod ? `
          <p style="margin-top: 10px;"><strong>Ödeme Yöntemi:</strong> ${data.paymentMethod}</p>
        ` : ''}
      </div>

      ${data.shippingAddress ? `
        <div class="product-card">
          <h4>Teslimat Adresi:</h4>
          <p>${data.shippingAddress}</p>
          ${data.trackingNumber ? `
            <h4>Kargo Takip Numarası:</h4>
            <p><strong>${data.trackingNumber}</strong></p>
          ` : ''}
        </div>
      ` : ''}

      <p>Siparişinizin durumunu takip etmek için 
        <a href="${data.orderUrl || 'https://tdcmarket.com/orders'}" class="button">
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

// Transactional email templates and functions

const getSellerApplicationApprovedHTML = (data: SellerApplicationApprovedData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Satıcı Başvurunuz Onaylandı - TDC Market</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; }
    .content { padding: 30px 20px; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; }
    .button { display: inline-block; padding: 12px 24px; background-color: #CBA135; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 10px 0; }
    .success-box { background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Başvurunuz Onaylandı!</h1>
    </div>
    <div class="content">
      <h2>Merhaba ${data.sellerName},</h2>
      <div class="success-box">
        <h3>Tebrikler! Satıcı başvurunuz onaylandı.</h3>
        <p><strong>Mağaza Adı:</strong> ${data.storeName}</p>
        <p>Artık TDC Market'te ürünlerinizi satmaya başlayabilirsiniz!</p>
      </div>
      <p>Satıcı panelinize giriş yaparak:</p>
      <ul>
        <li>Ürünlerinizi ekleyebilirsiniz</li>
        <li>Siparişlerinizi yönetebilirsiniz</li>
        <li>Gelir ve ödemelerinizi takip edebilirsiniz</li>
        <li>Mağazanızı özelleştirebilirsiniz</li>
      </ul>
      <p>
        <a href="${data.dashboardUrl}" class="button">Satıcı Paneline Git</a>
      </p>
      <p>Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.</p>
      <p>Teşekkürler,<br />TDC Market Ekibi</p>
    </div>
    <div class="footer">
      <p>TDC Market - Türkiye'nin En Büyük Online Alışveriş Platformu</p>
    </div>
  </div>
</body>
</html>
`;

const getSellerApplicationRejectedHTML = (data: SellerApplicationRejectedData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Satıcı Başvuru Sonucu - TDC Market</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; }
    .content { padding: 30px 20px; }
    .info-box { background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 24px; background-color: #CBA135; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Başvuru Sonucu</h1>
    </div>
    <div class="content">
      <h2>Merhaba ${data.sellerName},</h2>
      <p>Maalesef satıcı başvurunuz şu an için onaylanamadı.</p>
      ${data.reason ? `
      <div class="info-box">
        <h3>Gerekçe:</h3>
        <p>${data.reason}</p>
      </div>
      ` : ''}
      <p>Başvurunuzu yeniden gözden geçirip tekrar deneyebilir veya bizimle iletişime geçebilirsiniz.</p>
      <p>
        <a href="${data.contactUrl}" class="button">İletişime Geç</a>
      </p>
      <p>Teşekkürler,<br />TDC Market Ekibi</p>
    </div>
  </div>
</body>
</html>
`;

const getInfluencerApplicationApprovedHTML = (data: InfluencerApplicationApprovedData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Influencer Başvurunuz Onaylandı - TDC Market</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%); padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; }
    .content { padding: 30px 20px; }
    .success-box { background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 24px; background-color: #CBA135; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Başvurunuz Onaylandı!</h1>
    </div>
    <div class="content">
      <h2>Merhaba ${data.influencerName},</h2>
      <div class="success-box">
        <h3>Tebrikler! Influencer başvurunuz onaylandı.</h3>
        <p>Artık TDC Market'te markalarla işbirliği yapabilir ve kampanyalara katılabilirsiniz!</p>
      </div>
      <p>Influencer panelinize giriş yaparak:</p>
      <ul>
        <li>Kampanyalara başvurabilirsiniz</li>
        <li>İşbirliklerinizi yönetebilirsiniz</li>
        <li>Kazançlarınızı takip edebilirsiniz</li>
        <li>Profilinizi güncelleyebilirsiniz</li>
      </ul>
      <p>
        <a href="${data.dashboardUrl}" class="button">Influencer Paneline Git</a>
      </p>
      <p>Teşekkürler,<br />TDC Market Ekibi</p>
    </div>
  </div>
</body>
</html>
`;

const getInfluencerApplicationRejectedHTML = (data: InfluencerApplicationRejectedData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Influencer Başvuru Sonucu - TDC Market</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; }
    .content { padding: 30px 20px; }
    .info-box { background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 24px; background-color: #CBA135; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Başvuru Sonucu</h1>
    </div>
    <div class="content">
      <h2>Merhaba ${data.influencerName},</h2>
      <p>Maalesef influencer başvurunuz şu an için onaylanamadı.</p>
      ${data.reason ? `
      <div class="info-box">
        <h3>Gerekçe:</h3>
        <p>${data.reason}</p>
      </div>
      ` : ''}
      <p>Başvurunuzu yeniden gözden geçirip tekrar deneyebilir veya bizimle iletişime geçebilirsiniz.</p>
      <p>
        <a href="${data.contactUrl}" class="button">İletişime Geç</a>
      </p>
      <p>Teşekkürler,<br />TDC Market Ekibi</p>
    </div>
  </div>
</body>
</html>
`;

const getPaymentSuccessHTML = (data: PaymentSuccessData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ödeme Başarılı - TDC Market</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; }
    .content { padding: 30px 20px; }
    .success-box { background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 24px; background-color: #CBA135; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Ödeme Başarılı!</h1>
    </div>
    <div class="content">
      <h2>Merhaba ${data.customerName},</h2>
      <div class="success-box">
        <h3>Ödemeniz başarıyla alındı!</h3>
        <p><strong>Sipariş No:</strong> ${data.orderNumber}</p>
        <p><strong>Tutar:</strong> ₺${data.total.toLocaleString()}</p>
        <p><strong>Ödeme Yöntemi:</strong> ${data.paymentMethod}</p>
      </div>
      <p>Siparişiniz hazırlanmaya başlanacak. Sipariş durumunu takip etmek için:</p>
      <p>
        <a href="${data.orderUrl}" class="button">Siparişimi Görüntüle</a>
      </p>
      <p>Teşekkürler,<br />TDC Market Ekibi</p>
    </div>
  </div>
</body>
</html>
`;

const getOrderShippedHTML = (data: OrderShippedData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Siparişiniz Kargoya Verildi - TDC Market</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; }
    .content { padding: 30px 20px; }
    .info-box { background-color: #d1ecf1; border: 1px solid #bee5eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 24px; background-color: #CBA135; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Siparişiniz Kargoya Verildi!</h1>
    </div>
    <div class="content">
      <h2>Merhaba ${data.customerName},</h2>
      <p>Siparişiniz kargoya verildi ve yola çıktı!</p>
      <div class="info-box">
        <h3>Kargo Bilgileri:</h3>
        <p><strong>Sipariş No:</strong> ${data.orderNumber}</p>
        <p><strong>Kargo Firması:</strong> ${data.trackingCarrier}</p>
        <p><strong>Takip Numarası:</strong> <strong>${data.trackingCode}</strong></p>
        ${data.estimatedDelivery ? `<p><strong>Tahmini Teslimat:</strong> ${data.estimatedDelivery}</p>` : ''}
      </div>
      ${data.trackingUrl ? `
      <p>
        <a href="${data.trackingUrl}" class="button">Kargoyu Takip Et</a>
      </p>
      ` : ''}
      <p>Teşekkürler,<br />TDC Market Ekibi</p>
    </div>
  </div>
</body>
</html>
`;

const getOrderDeliveredHTML = (data: OrderDeliveredData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Siparişiniz Teslim Edildi - TDC Market</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; }
    .content { padding: 30px 20px; }
    .success-box { background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 24px; background-color: #CBA135; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Siparişiniz Teslim Edildi!</h1>
    </div>
    <div class="content">
      <h2>Merhaba ${data.customerName},</h2>
      <div class="success-box">
        <h3>Siparişiniz başarıyla teslim edildi!</h3>
        <p><strong>Sipariş No:</strong> ${data.orderNumber}</p>
      </div>
      <p>Ürünlerinizi beğendiyseniz, diğer müşterilere yardımcı olmak için değerlendirme yapabilirsiniz.</p>
      <p>
        <a href="${data.reviewUrl}" class="button">Ürünleri Değerlendir</a>
      </p>
      <p>Teşekkürler,<br />TDC Market Ekibi</p>
    </div>
  </div>
</body>
</html>
`;

// Transactional email sending functions
export const sendSellerApplicationApproved = async (to: string, data: SellerApplicationApprovedData) => {
  const transporter = createTransporter();
  const html = getSellerApplicationApprovedHTML(data);
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: '🎉 Satıcı Başvurunuz Onaylandı!',
    html,
  });
};

export const sendSellerApplicationRejected = async (to: string, data: SellerApplicationRejectedData) => {
  const transporter = createTransporter();
  const html = getSellerApplicationRejectedHTML(data);
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Satıcı Başvuru Sonucu - TDC Market',
    html,
  });
};

export const sendInfluencerApplicationApproved = async (to: string, data: InfluencerApplicationApprovedData) => {
  const transporter = createTransporter();
  const html = getInfluencerApplicationApprovedHTML(data);
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: '🎉 Influencer Başvurunuz Onaylandı!',
    html,
  });
};

export const sendInfluencerApplicationRejected = async (to: string, data: InfluencerApplicationRejectedData) => {
  const transporter = createTransporter();
  const html = getInfluencerApplicationRejectedHTML(data);
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Influencer Başvuru Sonucu - TDC Market',
    html,
  });
};

export const sendPaymentSuccess = async (to: string, data: PaymentSuccessData) => {
  const transporter = createTransporter();
  const html = getPaymentSuccessHTML(data);
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: `✅ Ödeme Başarılı - Sipariş ${data.orderNumber}`,
    html,
  });
};

export const sendOrderShipped = async (to: string, data: OrderShippedData) => {
  const transporter = createTransporter();
  const html = getOrderShippedHTML(data);
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: `📦 Siparişiniz Kargoya Verildi - ${data.orderNumber}`,
    html,
  });
};

export const sendOrderDelivered = async (to: string, data: OrderDeliveredData) => {
  const transporter = createTransporter();
  const html = getOrderDeliveredHTML(data);
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: `🎉 Siparişiniz Teslim Edildi - ${data.orderNumber}`,
    html,
  });
};

export const sendRefundNotification = async (to: string, data: RefundNotificationData) => {
  const transporter = createTransporter();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  const refundMethodText = {
    original: "Orijinal ödeme yönteminize",
    store_credit: "Mağaza kredisi olarak",
    bank_transfer: "Banka havalesi ile",
  }[data.refundMethod] || data.refundMethod;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>İade Onayı - TDC Market</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #CBA135;">İade Onaylandı ✅</h2>
        
        <p>Merhaba <strong>${data.customerName}</strong>,</p>
        
        <p>İade talebiniz onaylandı ve iade işlemi başlatıldı.</p>
        
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">İade Detayları:</h3>
          <p><strong>Sipariş No:</strong> ${data.orderNumber}</p>
          <p><strong>İade Tutarı:</strong> ₺${data.refundAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
          <p><strong>İade Yöntemi:</strong> ${refundMethodText}</p>
          <p><strong>İade Talebi No:</strong> ${data.returnRequestId}</p>
        </div>
        
        ${data.refundMethod === 'original' ? `
          <p style="color: #28a745; font-weight: bold;">
            İade tutarı orijinal ödeme yönteminize 3-5 iş günü içinde yansıyacaktır.
          </p>
        ` : ''}
        
        ${data.refundMethod === 'store_credit' ? `
          <p style="color: #28a745; font-weight: bold;">
            İade tutarı mağaza kredisi olarak hesabınıza eklendi. Bir sonraki alışverişinizde kullanabilirsiniz.
          </p>
        ` : ''}
        
        ${data.refundMethod === 'bank_transfer' ? `
          <p style="color: #28a745; font-weight: bold;">
            İade tutarı banka hesabınıza 5-7 iş günü içinde havale edilecektir.
          </p>
        ` : ''}
        
        <p>Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.</p>
        
        <p>Teşekkürler,<br />TDC Market Ekibi</p>
      </div>
    </body>
    </html>
  `;
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: `✅ İade Onaylandı - Sipariş ${data.orderNumber}`,
    html,
  });
};

export const sendBankTransferInstructions = async (to: string, data: BankTransferInstructionsData) => {
  const transporter = createTransporter();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  const expiresDate = new Date(data.expiresAt);
  const expiresDateStr = expiresDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  
  const bankAccountsHtml = data.bankAccounts.map(account => `
    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 10px 0;">
      <h4 style="margin-top: 0; color: #333;">${account.bankName}</h4>
      <p style="margin: 5px 0;"><strong>Hesap Sahibi:</strong> ${account.accountName}</p>
      <p style="margin: 5px 0;"><strong>IBAN:</strong> <code style="background-color: #e9ecef; padding: 2px 6px; border-radius: 4px;">${account.iban}</code></p>
      ${account.accountNumber ? `<p style="margin: 5px 0;"><strong>Hesap No:</strong> ${account.accountNumber}</p>` : ''}
      ${account.branchName ? `<p style="margin: 5px 0;"><strong>Şube:</strong> ${account.branchName}</p>` : ''}
    </div>
  `).join('');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Havale/EFT Ödeme Talimatları - TDC Market</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #CBA135;">Havale/EFT Ödeme Talimatları 💳</h2>
        
        <p>Merhaba <strong>${data.customerName}</strong>,</p>
        
        <p>Siparişiniz için ödeme bilgileri aşağıda yer almaktadır. Lütfen ödemeyi <strong>${expiresDateStr}</strong> tarihine kadar yapınız.</p>
        
        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;"><strong>⚠️ Önemli:</strong> Havale/EFT yaparken açıklama kısmına <strong>${data.reference}</strong> referans numarasını mutlaka yazınız.</p>
        </div>
        
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Ödeme Detayları:</h3>
          <p><strong>Sipariş No:</strong> ${data.orderNumber}</p>
          <p><strong>Ödeme Tutarı:</strong> ₺${data.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
          <p><strong>Referans No:</strong> <code style="background-color: #e9ecef; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${data.reference}</code></p>
          <p><strong>Son Ödeme Tarihi:</strong> ${expiresDateStr}</p>
        </div>
        
        <h3 style="color: #333;">Banka Hesap Bilgileri:</h3>
        ${bankAccountsHtml}
        
        <div style="background-color: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;"><strong>💡 Bilgi:</strong> Ödemeniz onaylandıktan sonra siparişiniz hazırlanmaya başlayacaktır. Ödeme onayı genellikle 1-2 iş günü içinde yapılmaktadır.</p>
        </div>
        
        <p>Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.</p>
        
        <p>Teşekkürler,<br />TDC Market Ekibi</p>
      </div>
    </body>
    </html>
  `;
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: `💳 Havale/EFT Ödeme Talimatları - Sipariş ${data.orderNumber}`,
    html,
  });
};

export const sendPaymentReminder = async (to: string, data: PaymentReminderData) => {
  const transporter = createTransporter();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  const expiresDate = new Date(data.expiresAt);
  const expiresDateStr = expiresDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  
  const bankAccountsHtml = data.bankAccounts.map(account => `
    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 10px 0;">
      <h4 style="margin-top: 0; color: #333;">${account.bankName}</h4>
      <p style="margin: 5px 0;"><strong>Hesap Sahibi:</strong> ${account.accountName}</p>
      <p style="margin: 5px 0;"><strong>IBAN:</strong> <code style="background-color: #e9ecef; padding: 2px 6px; border-radius: 4px;">${account.iban}</code></p>
    </div>
  `).join('');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Ödeme Hatırlatma - TDC Market</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #CBA135;">Ödeme Hatırlatma ⏰</h2>
        
        <p>Merhaba <strong>${data.customerName}</strong>,</p>
        
        <p>Siparişiniz için ödeme henüz alınmamıştır. Lütfen ödemeyi <strong>${expiresDateStr}</strong> tarihine kadar yapınız.</p>
        
        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;"><strong>⚠️ Önemli:</strong> Ödeme yapılmazsa siparişiniz otomatik olarak iptal edilecektir.</p>
        </div>
        
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Ödeme Detayları:</h3>
          <p><strong>Sipariş No:</strong> ${data.orderNumber}</p>
          <p><strong>Ödeme Tutarı:</strong> ₺${data.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
          <p><strong>Referans No:</strong> <code style="background-color: #e9ecef; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${data.reference}</code></p>
          <p><strong>Son Ödeme Tarihi:</strong> ${expiresDateStr}</p>
        </div>
        
        <h3 style="color: #333;">Banka Hesap Bilgileri:</h3>
        ${bankAccountsHtml}
        
        <p>Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.</p>
        
        <p>Teşekkürler,<br />TDC Market Ekibi</p>
      </div>
    </body>
    </html>
  `;
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: `⏰ Ödeme Hatırlatma - Sipariş ${data.orderNumber}`,
    html,
  });
};

export const sendLowStockAlert = async (to: string, data: LowStockAlertData) => {
  const transporter = createTransporter();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const productUrl = `${baseUrl}/seller/products`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Düşük Stok Uyarısı - TDC Market</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #ff9800;">⚠️ Düşük Stok Uyarısı</h2>
        
        <p>Merhaba <strong>${data.sellerName}</strong>,</p>
        
        <p>Mağazanızdaki bir ürün için düşük stok uyarısı:</p>
        
        <div style="background-color: #fff3cd; border-left: 4px solid #ff9800; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Ürün Bilgileri:</h3>
          <p><strong>Ürün Adı:</strong> ${data.productName}</p>
          <p><strong>Mevcut Stok:</strong> <span style="color: #ff9800; font-weight: bold; font-size: 18px;">${data.currentStock} adet</span></p>
          <p><strong>Uyarı Eşiği:</strong> ${data.threshold} adet</p>
        </div>
        
        <p>Stok seviyesini kontrol edip gerekirse ürün stoğunu yenileyin.</p>
        
        <p>
          <a href="${productUrl}" style="background-color: #CBA135; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Ürünleri Yönet
          </a>
        </p>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          <strong>Not:</strong> Stok seviyesi ${data.threshold} adetin altına düştüğünde bu uyarı gönderilir.
        </p>
        
        <p>Teşekkürler,<br />TDC Market Ekibi</p>
      </div>
    </body>
    </html>
  `;
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: `⚠️ Düşük Stok Uyarısı - ${data.productName}`,
    html,
  });
};

export const sendMarketingEmail = async (to: string, data: {
  subject: string;
  html: string;
  fromName?: string;
  fromEmail?: string;
}) => {
  const transporter = createTransporter();
  
  return transporter.sendMail({
    from: `"${data.fromName || 'TDC Market'}" <${data.fromEmail || process.env.SMTP_USER}>`,
    to,
    subject: data.subject,
    html: data.html,
  });
};

export const sendSellerNewOrder = async (to: string, data: SellerNewOrderData) => {
  const transporter = createTransporter();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const dashboardUrl = `${baseUrl}/seller/orders`;
  
  const itemsList = data.items
    .map((item) => `  <li>${item.title} (${item.qty} adet)</li>`)
    .join("\n");
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Yeni Sipariş - TDC Market</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #CBA135;">Yeni Sipariş Alındı! 🎉</h2>
        
        <p>Merhaba <strong>${data.sellerName}</strong>,</p>
        
        <p>Mağazanız için yeni bir sipariş alındı. Lütfen siparişi hazırlayıp kargoya verin.</p>
        
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Sipariş Detayları:</h3>
          <ul style="list-style: none; padding: 0;">
${itemsList}
          </ul>
          <p style="margin-top: 15px;"><strong>Toplam Ürün Sayısı:</strong> ${data.orderCount}</p>
        </div>
        
        <p>
          <a href="${dashboardUrl}" style="background-color: #CBA135; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Siparişleri Görüntüle
          </a>
        </p>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          <strong>Önemli:</strong> Siparişleri 24 saat içinde hazırlayıp kargoya vermeniz gerekmektedir.
        </p>
        
        <p>Teşekkürler,<br />TDC Market Ekibi</p>
      </div>
    </body>
    </html>
  `;
  
  return transporter.sendMail({
    from: `"TDC Market" <${process.env.SMTP_USER}>`,
    to,
    subject: `🛒 Yeni Sipariş - ${data.orderCount} Ürün`,
    html,
  });
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
    case 'seller_application_approved':
      return sendSellerApplicationApproved(to, data);
    case 'seller_application_rejected':
      return sendSellerApplicationRejected(to, data);
    case 'influencer_application_approved':
      return sendInfluencerApplicationApproved(to, data);
    case 'influencer_application_rejected':
      return sendInfluencerApplicationRejected(to, data);
    case 'payment_success':
      return sendPaymentSuccess(to, data);
    case 'order_shipped':
      return sendOrderShipped(to, data);
    case 'order_delivered':
      return sendOrderDelivered(to, data);
    default:
      throw new Error(`Unknown email type: ${type}`);
  }
};