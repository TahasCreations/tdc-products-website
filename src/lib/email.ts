import nodemailer from 'nodemailer';

// E-posta transporter'ı oluştur
const transporter = nodemailer.createTransport({
  service: 'gmail', // Gmail kullanıyoruz, değiştirilebilir
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// E-posta şablonları
export const emailTemplates = {
  // Hoş geldin e-postası
  welcome: (userName: string) => ({
    subject: 'TDC Products\'a Hoş Geldiniz! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">TDC Products</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Anime ve Gaming Figürleri</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Merhaba ${userName}! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            TDC Products ailesine katıldığınız için teşekkür ederiz! Artık en sevdiğiniz anime ve gaming figürlerine kolayca ulaşabilirsiniz.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">🎁 Hoş Geldin İndirimi</h3>
            <p style="color: #666; margin-bottom: 15px;">İlk alışverişinizde %10 indirim kazanın!</p>
            <div style="background: #667eea; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; font-weight: bold;">
              Kupon Kodu: HOSGELDIN
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/products" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Ürünleri Keşfet
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Herhangi bir sorunuz varsa bizimle iletişime geçebilirsiniz.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 TDC Products. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `
  }),

  // Sipariş onayı e-postası
  orderConfirmed: (orderNumber: string, customerName: string, totalAmount: number, items: any[]) => ({
    subject: `Siparişiniz Onaylandı! #${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Sipariş Onaylandı!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Sipariş No: #${orderNumber}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Merhaba ${customerName}! ✅</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Siparişiniz başarıyla onaylandı ve hazırlanmaya başlandı. Siparişinizin durumunu aşağıdaki linkten takip edebilirsiniz.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📦 Sipariş Detayları</h3>
            <div style="margin: 15px 0;">
              <strong>Sipariş No:</strong> #${orderNumber}<br>
              <strong>Toplam Tutar:</strong> ₺${totalAmount.toLocaleString('tr-TR')}<br>
              <strong>Ürün Sayısı:</strong> ${items.length} adet
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders/${orderNumber}" 
               style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Siparişi Takip Et
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Siparişinizle ilgili herhangi bir sorunuz varsa bizimle iletişime geçebilirsiniz.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 TDC Products. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `
  }),

  // Sipariş kargoda e-postası
  orderShipped: (orderNumber: string, customerName: string, trackingNumber?: string) => ({
    subject: `Siparişiniz Kargoya Verildi! #${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Kargoya Verildi!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Sipariş No: #${orderNumber}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Merhaba ${customerName}! 🚚</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Siparişiniz başarıyla kargoya verildi! Artık yolda ve yakında kapınızda olacak.
          </p>
          
          ${trackingNumber ? `
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📋 Kargo Takip</h3>
            <div style="margin: 15px 0;">
              <strong>Takip Numarası:</strong> ${trackingNumber}<br>
              <strong>Kargo Firması:</strong> Kargo A.Ş.
            </div>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders/${orderNumber}" 
               style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Siparişi Takip Et
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Kargo teslimatı ile ilgili herhangi bir sorunuz varsa bizimle iletişime geçebilirsiniz.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 TDC Products. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `
  }),

  // Sipariş teslim edildi e-postası
  orderDelivered: (orderNumber: string, customerName: string) => ({
    subject: `Siparişiniz Teslim Edildi! #${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Teslim Edildi!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Sipariş No: #${orderNumber}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Merhaba ${customerName}! 🎉</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Siparişiniz başarıyla teslim edildi! Umarız ürünlerimizden memnun kalırsınız.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #333; margin-top: 0;">⭐ Değerlendirme Yapın</h3>
            <p style="color: #666; margin-bottom: 15px;">Deneyiminizi paylaşın ve diğer müşterilere yardımcı olun!</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/products" 
               style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Yeni Ürünleri Keşfet
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Herhangi bir sorunuz varsa bizimle iletişime geçebilirsiniz.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 TDC Products. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `
  }),

  // Düşük stok uyarısı e-postası
  lowStockAlert: (productName: string, currentStock: number, threshold: number) => ({
    subject: `Düşük Stok Uyarısı: ${productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Düşük Stok Uyarısı!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Acil Müdahale Gerekli</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">⚠️ Stok Uyarısı</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Aşağıdaki ürünün stok miktarı kritik seviyeye düştü. Lütfen stok takviyesi yapın.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #333; margin-top: 0;">📦 Ürün Bilgileri</h3>
            <div style="margin: 15px 0;">
              <strong>Ürün Adı:</strong> ${productName}<br>
              <strong>Mevcut Stok:</strong> ${currentStock} adet<br>
              <strong>Uyarı Eşiği:</strong> ${threshold} adet
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" 
               style="background: #ffc107; color: #333; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Admin Paneline Git
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Bu otomatik bir uyarıdır. Stok durumunu kontrol edin ve gerekli aksiyonu alın.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 TDC Products. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `
  }),

  // Yeni kupon e-postası
  newCoupon: (couponCode: string, discountValue: string, expiryDate: string) => ({
    subject: `Yeni Kupon Kodu: ${couponCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #e83e8c 0%, #6f42c1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Yeni Kupon Kodu!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Özel İndirim Fırsatı</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">🎉 Özel İndirim!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Size özel yeni bir kupon kodumuz var! Bu fırsatı kaçırmayın.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e83e8c;">
            <h3 style="color: #333; margin-top: 0;">🎫 Kupon Detayları</h3>
            <div style="margin: 15px 0;">
              <strong>Kupon Kodu:</strong> <span style="background: #e83e8c; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;">${couponCode}</span><br>
              <strong>İndirim:</strong> ${discountValue}<br>
              <strong>Son Kullanım:</strong> ${expiryDate}
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/products" 
               style="background: #e83e8c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Alışverişe Başla
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Bu kupon kodunu checkout sayfasında kullanabilirsiniz.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 TDC Products. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `
  })
};

// E-posta gönderme fonksiyonu
export const sendEmail = async (to: string, template: keyof typeof emailTemplates, data: any) => {
  try {
    let emailContent: any;
    
    // Şablona göre e-posta içeriği oluştur
    switch (template) {
      case 'welcome':
        emailContent = emailTemplates.welcome(data);
        break;
      case 'orderConfirmed':
        emailContent = emailTemplates.orderConfirmed(data.orderNumber, data.customerName, data.totalAmount, data.items);
        break;
      case 'orderShipped':
        emailContent = emailTemplates.orderShipped(data.orderNumber, data.customerName, data.trackingNumber);
        break;
      case 'orderDelivered':
        emailContent = emailTemplates.orderDelivered(data.orderNumber, data.customerName);
        break;
      case 'lowStockAlert':
        emailContent = emailTemplates.lowStockAlert(data.productName, data.currentStock, data.threshold);
        break;
      case 'newCoupon':
        emailContent = emailTemplates.newCoupon(data.couponCode, data.discountValue, data.expiryDate);
        break;
      default:
        throw new Error('Geçersiz e-posta şablonu');
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    // E-posta gönderildi
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    return { success: false, error: error };
  }
};

// Toplu e-posta gönderme fonksiyonu
export const sendBulkEmail = async (recipients: string[], template: keyof typeof emailTemplates, data: any) => {
  const results = [];
  
  for (const recipient of recipients) {
    const result = await sendEmail(recipient, template, data);
    results.push({ recipient, ...result });
    
    // Rate limiting - her e-posta arasında 1 saniye bekle
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
};
