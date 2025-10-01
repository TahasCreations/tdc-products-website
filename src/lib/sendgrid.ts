import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'SG.dummy');

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (template: EmailTemplate) => {
  try {
    const msg = {
      to: template.to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@tdcmarket.com',
        name: 'TDC Market',
      },
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    await sgMail.send(msg);
    return { success: true };
  } catch (error: any) {
    console.error('SendGrid error:', error);
    return { success: false, error: error.message };
  }
};

// Email Templates
export const emailTemplates = {
  welcome: (name: string, email: string) => ({
    to: email,
    subject: 'TDC Market\'e Hoş Geldiniz! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #5A63F2, #FF7A59); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">TDC Market</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Özel figürlerden elektroniğe, tasarımdan ev yaşamına</p>
        </div>
        <div style="padding: 40px; background: white; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #0F172A; margin: 0 0 20px 0;">Merhaba ${name}! 👋</h2>
          <p style="color: #64748B; line-height: 1.6; margin: 0 0 20px 0;">
            TDC Market ailesine hoş geldiniz! Artık binlerce ürün arasından seçim yapabilir, 
            blog yazılarımızı okuyabilir ve topluluğumuzun bir parçası olabilirsiniz.
          </p>
          <div style="background: #F1F5F9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #0F172A; margin: 0 0 10px 0;">🎯 Başlamak için:</h3>
            <ul style="color: #64748B; margin: 0; padding-left: 20px;">
              <li>Profilinizi tamamlayın</li>
              <li>İlginizi çeken kategorileri keşfedin</li>
              <li>Blog yazılarımızı okuyun</li>
              <li>İlk alışverişinizi yapın</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" 
               style="background: linear-gradient(135deg, #5A63F2, #FF7A59); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Alışverişe Başla
            </a>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #94A3B8; font-size: 14px;">
          <p>TDC Market - Figür & Koleksiyon Dünyası</p>
        </div>
      </div>
    `,
  }),

  blogPublished: (authorName: string, postTitle: string, postUrl: string) => ({
    to: process.env.SENDGRID_FROM_EMAIL || 'noreply@tdcmarket.com',
    subject: `Yeni Blog Yazısı: ${postTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #5A63F2, #FF7A59); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">TDC Market Blog</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Yeni içerik yayınlandı!</p>
        </div>
        <div style="padding: 40px; background: white; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #0F172A; margin: 0 0 20px 0;">📝 Yeni Blog Yazısı</h2>
          <p style="color: #64748B; line-height: 1.6; margin: 0 0 20px 0;">
            <strong>${authorName}</strong> tarafından yeni bir blog yazısı yayınlandı:
          </p>
          <div style="background: #F1F5F9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #0F172A; margin: 0 0 10px 0;">${postTitle}</h3>
            <p style="color: #64748B; margin: 0;">Yazıyı okumak için aşağıdaki butona tıklayın.</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${postUrl}" 
               style="background: linear-gradient(135deg, #5A63F2, #FF7A59); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Yazıyı Oku
            </a>
          </div>
        </div>
      </div>
    `,
  }),

  newsletter: (subscriberEmail: string, posts: any[]) => ({
    to: subscriberEmail,
    subject: 'TDC Market Haftalık Bülten - En Popüler Yazılar',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #5A63F2, #FF7A59); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">TDC Market Bülten</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Bu haftanın en popüler yazıları</p>
        </div>
        <div style="padding: 40px; background: white; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #0F172A; margin: 0 0 20px 0;">📚 Haftalık Özet</h2>
          <p style="color: #64748B; line-height: 1.6; margin: 0 0 30px 0;">
            Bu hafta topluluğumuz tarafından en çok okunan ve beğenilen yazıları sizin için derledik.
          </p>
          ${posts.map(post => `
            <div style="border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #0F172A; margin: 0 0 10px 0;">${post.title}</h3>
              <p style="color: #64748B; margin: 0 0 10px 0; font-size: 14px;">${post.author.name} • ${post.readingTime} dk okuma</p>
              <p style="color: #64748B; margin: 0 0 15px 0;">${post.excerpt}</p>
              <a href="${post.url}" style="color: #5A63F2; text-decoration: none; font-weight: 600;">Yazıyı Oku →</a>
            </div>
          `).join('')}
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog" 
               style="background: linear-gradient(135deg, #5A63F2, #FF7A59); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Tüm Yazıları Gör
            </a>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #94A3B8; font-size: 14px;">
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #94A3B8;">Abonelikten çık</a>
          </p>
        </div>
      </div>
    `,
  }),
};
