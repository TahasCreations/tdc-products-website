import { Template } from './types';
import { generateId } from './utils';

export const ADVANCED_TEMPLATES: Template[] = [
  // 1. E-Commerce Product Showcase
  {
    id: 'ecommerce-showcase',
    name: 'E-Commerce Vitrin',
    description: 'Ürünleri sergileyin, modern grid layout',
    category: 'ecommerce',
    components: {
      'hero-1': {
        id: 'hero-1',
        type: 'hero',
        children: ['hero-container'],
        content: { text: 'Ürünlerimizi Keşfedin' },
        styles: {
          padding: '5rem 2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          textAlign: 'center',
        },
      },
      'hero-container': {
        id: 'hero-container',
        type: 'container',
        parentId: 'hero-1',
        children: ['hero-heading', 'hero-text', 'hero-button'],
        styles: { maxWidth: '800px', margin: '0 auto' },
      },
      'hero-heading': {
        id: 'hero-heading',
        type: 'heading',
        parentId: 'hero-container',
        content: { text: 'Harika Ürünler' },
        styles: { fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem' },
      },
      'hero-text': {
        id: 'hero-text',
        type: 'text',
        parentId: 'hero-container',
        content: { text: 'En kaliteli ürünleri en uygun fiyatlarla bulun' },
        styles: { fontSize: '1.25rem', marginBottom: '2rem', opacity: '0.95' },
      },
      'hero-button': {
        id: 'hero-button',
        type: 'button',
        parentId: 'hero-container',
        content: { text: 'Alışverişe Başla', href: '/products' },
        styles: {
          padding: '1rem 2.5rem',
          backgroundColor: '#ffffff',
          color: '#667eea',
          borderRadius: '12px',
          fontSize: '1.125rem',
          fontWeight: '700',
        },
      },
      'products-section': {
        id: 'products-section',
        type: 'section',
        children: ['products-container'],
        styles: { padding: '4rem 2rem', backgroundColor: '#f9fafb' },
      },
      'products-container': {
        id: 'products-container',
        type: 'container',
        parentId: 'products-section',
        children: ['products-grid'],
        styles: { maxWidth: '1400px', margin: '0 auto' },
      },
      'products-grid': {
        id: 'products-grid',
        type: 'grid',
        parentId: 'products-container',
        styles: {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
        },
      },
    },
    rootComponentIds: ['hero-1', 'products-section'],
    createdAt: new Date().toISOString(),
  },

  // 2. Blog Post Layout
  {
    id: 'blog-post',
    name: 'Blog Yazısı',
    description: 'Tek blog yazısı için layout',
    category: 'content',
    components: {
      'article-section': {
        id: 'article-section',
        type: 'section',
        children: ['article-container'],
        styles: { padding: '4rem 2rem', backgroundColor: '#ffffff' },
      },
      'article-container': {
        id: 'article-container',
        type: 'container',
        parentId: 'article-section',
        children: ['article-title', 'article-meta', 'article-content'],
        styles: { maxWidth: '800px', margin: '0 auto' },
      },
      'article-title': {
        id: 'article-title',
        type: 'heading',
        parentId: 'article-container',
        content: { text: 'Blog Yazısı Başlığı' },
        styles: {
          fontSize: '3rem',
          fontWeight: '800',
          marginBottom: '1.5rem',
          lineHeight: '1.2',
        },
      },
      'article-meta': {
        id: 'article-meta',
        type: 'text',
        parentId: 'article-container',
        content: { text: '15 Ocak 2025 • 5 dk okuma' },
        styles: {
          fontSize: '0.875rem',
          color: '#6b7280',
          marginBottom: '2rem',
        },
      },
      'article-content': {
        id: 'article-content',
        type: 'text',
        parentId: 'article-container',
        content: { text: 'Blog yazısı içeriği buraya gelecek. Lorem ipsum dolor sit amet...' },
        styles: {
          fontSize: '1.125rem',
          lineHeight: '1.8',
          color: '#374151',
        },
      },
    },
    rootComponentIds: ['article-section'],
    createdAt: new Date().toISOString(),
  },

  // 3. Features Grid
  {
    id: 'features-grid',
    name: 'Özellik Grid',
    description: '3 sütunlu özellik showcas',
    category: 'marketing',
    components: {
      'features-section': {
        id: 'features-section',
        type: 'section',
        children: ['features-container'],
        styles: { padding: '5rem 2rem', backgroundColor: '#ffffff' },
      },
      'features-container': {
        id: 'features-container',
        type: 'container',
        parentId: 'features-section',
        children: ['features-heading', 'features-grid'],
        styles: { maxWidth: '1200px', margin: '0 auto' },
      },
      'features-heading': {
        id: 'features-heading',
        type: 'heading',
        parentId: 'features-container',
        content: { text: 'Özellikler' },
        styles: {
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '3rem',
          textAlign: 'center',
        },
      },
      'features-grid': {
        id: 'features-grid',
        type: 'grid',
        parentId: 'features-container',
        styles: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2.5rem',
        },
      },
    },
    rootComponentIds: ['features-section'],
    createdAt: new Date().toISOString(),
  },

  // 4. Contact Page
  {
    id: 'contact-page',
    name: 'İletişim Sayfası',
    description: 'İletişim formu ve bilgiler',
    category: 'content',
    components: {
      'contact-section': {
        id: 'contact-section',
        type: 'section',
        children: ['contact-container'],
        styles: { padding: '4rem 2rem', backgroundColor: '#f9fafb' },
      },
      'contact-container': {
        id: 'contact-container',
        type: 'container',
        parentId: 'contact-section',
        children: ['contact-heading', 'contact-grid'],
        styles: { maxWidth: '1200px', margin: '0 auto' },
      },
      'contact-heading': {
        id: 'contact-heading',
        type: 'heading',
        parentId: 'contact-container',
        content: { text: 'Bize Ulaşın' },
        styles: {
          fontSize: '3rem',
          fontWeight: '700',
          marginBottom: '3rem',
          textAlign: 'center',
        },
      },
      'contact-grid': {
        id: 'contact-grid',
        type: 'grid',
        parentId: 'contact-container',
        styles: {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '3rem',
        },
      },
    },
    rootComponentIds: ['contact-section'],
    createdAt: new Date().toISOString(),
  },

  // 5. Pricing Table
  {
    id: 'pricing-table',
    name: 'Fiyatlandırma Tablosu',
    description: '3 kolonlu fiyat planları',
    category: 'marketing',
    components: {
      'pricing-section': {
        id: 'pricing-section',
        type: 'section',
        children: ['pricing-container'],
        styles: {
          padding: '5rem 2rem',
          background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)',
        },
      },
      'pricing-container': {
        id: 'pricing-container',
        type: 'container',
        parentId: 'pricing-section',
        children: ['pricing-heading', 'pricing-grid'],
        styles: { maxWidth: '1200px', margin: '0 auto' },
      },
      'pricing-heading': {
        id: 'pricing-heading',
        type: 'heading',
        parentId: 'pricing-container',
        content: { text: 'Fiyatlandırma Planları' },
        styles: {
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '3rem',
          textAlign: 'center',
        },
      },
      'pricing-grid': {
        id: 'pricing-grid',
        type: 'grid',
        parentId: 'pricing-container',
        styles: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
        },
      },
    },
    rootComponentIds: ['pricing-section'],
    createdAt: new Date().toISOString(),
  },

  // 6. Team Section
  {
    id: 'team-section',
    name: 'Ekip Bölümü',
    description: 'Ekip üyeleri grid',
    category: 'content',
    components: {
      'team-section': {
        id: 'team-section',
        type: 'section',
        children: ['team-container'],
        styles: { padding: '4rem 2rem', backgroundColor: '#ffffff' },
      },
      'team-container': {
        id: 'team-container',
        type: 'container',
        parentId: 'team-section',
        children: ['team-heading', 'team-grid'],
        styles: { maxWidth: '1200px', margin: '0 auto' },
      },
      'team-heading': {
        id: 'team-heading',
        type: 'heading',
        parentId: 'team-container',
        content: { text: 'Ekibimiz' },
        styles: {
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '3rem',
          textAlign: 'center',
        },
      },
      'team-grid': {
        id: 'team-grid',
        type: 'grid',
        parentId: 'team-container',
        styles: {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
        },
      },
    },
    rootComponentIds: ['team-section'],
    createdAt: new Date().toISOString(),
  },

  // 7. FAQ Section
  {
    id: 'faq-section',
    name: 'S.S.S Bölümü',
    description: 'Sık sorulan sorular',
    category: 'content',
    components: {
      'faq-section': {
        id: 'faq-section',
        type: 'section',
        children: ['faq-container'],
        styles: { padding: '4rem 2rem', backgroundColor: '#f9fafb' },
      },
      'faq-container': {
        id: 'faq-container',
        type: 'container',
        parentId: 'faq-section',
        children: ['faq-heading'],
        styles: { maxWidth: '900px', margin: '0 auto' },
      },
      'faq-heading': {
        id: 'faq-heading',
        type: 'heading',
        parentId: 'faq-container',
        content: { text: 'Sık Sorulan Sorular' },
        styles: {
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '2rem',
          textAlign: 'center',
        },
      },
    },
    rootComponentIds: ['faq-section'],
    createdAt: new Date().toISOString(),
  },

  // 8. CTA Section
  {
    id: 'cta-section',
    name: 'CTA (Call to Action)',
    description: 'Aksiyon çağrısı bölümü',
    category: 'marketing',
    components: {
      'cta-section': {
        id: 'cta-section',
        type: 'section',
        children: ['cta-container'],
        styles: {
          padding: '6rem 2rem',
          background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
          color: '#ffffff',
        },
      },
      'cta-container': {
        id: 'cta-container',
        type: 'container',
        parentId: 'cta-section',
        children: ['cta-heading', 'cta-text', 'cta-button'],
        styles: { maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
      },
      'cta-heading': {
        id: 'cta-heading',
        type: 'heading',
        parentId: 'cta-container',
        content: { text: 'Hemen Başlayın!' },
        styles: { fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem' },
      },
      'cta-text': {
        id: 'cta-text',
        type: 'text',
        parentId: 'cta-container',
        content: { text: 'Bugün kaydolun ve fırsatları kaçırmayın' },
        styles: { fontSize: '1.25rem', marginBottom: '2rem' },
      },
      'cta-button': {
        id: 'cta-button',
        type: 'button',
        parentId: 'cta-container',
        content: { text: 'Ücretsiz Deneyin', href: '/signup' },
        styles: {
          padding: '1rem 3rem',
          backgroundColor: '#ffffff',
          color: '#dc2626',
          borderRadius: '12px',
          fontSize: '1.125rem',
          fontWeight: '700',
        },
      },
    },
    rootComponentIds: ['cta-section'],
    createdAt: new Date().toISOString(),
  },

  // 9. Testimonials
  {
    id: 'testimonials',
    name: 'Müşteri Yorumları',
    description: 'Testimonial grid layout',
    category: 'marketing',
    components: {
      'testimonials-section': {
        id: 'testimonials-section',
        type: 'section',
        children: ['testimonials-container'],
        styles: { padding: '5rem 2rem', backgroundColor: '#ffffff' },
      },
      'testimonials-container': {
        id: 'testimonials-container',
        type: 'container',
        parentId: 'testimonials-section',
        children: ['testimonials-heading', 'testimonials-grid'],
        styles: { maxWidth: '1200px', margin: '0 auto' },
      },
      'testimonials-heading': {
        id: 'testimonials-heading',
        type: 'heading',
        parentId: 'testimonials-container',
        content: { text: 'Müşterilerimiz Ne Diyor?' },
        styles: {
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '3rem',
          textAlign: 'center',
        },
      },
      'testimonials-grid': {
        id: 'testimonials-grid',
        type: 'grid',
        parentId: 'testimonials-container',
        styles: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
        },
      },
    },
    rootComponentIds: ['testimonials-section'],
    createdAt: new Date().toISOString(),
  },

  // 10. Footer
  {
    id: 'footer-standard',
    name: 'Standard Footer',
    description: '4 kolonlu footer layout',
    category: 'layout',
    components: {
      'footer-section': {
        id: 'footer-section',
        type: 'section',
        children: ['footer-container'],
        styles: {
          padding: '3rem 2rem 2rem',
          backgroundColor: '#1f2937',
          color: '#f9fafb',
        },
      },
      'footer-container': {
        id: 'footer-container',
        type: 'container',
        parentId: 'footer-section',
        children: ['footer-grid', 'footer-bottom'],
        styles: { maxWidth: '1400px', margin: '0 auto' },
      },
      'footer-grid': {
        id: 'footer-grid',
        type: 'grid',
        parentId: 'footer-container',
        styles: {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
          marginBottom: '2rem',
        },
      },
      'footer-bottom': {
        id: 'footer-bottom',
        type: 'text',
        parentId: 'footer-container',
        content: { text: '© 2025 TDC Market. Tüm hakları saklıdır.' },
        styles: {
          textAlign: 'center',
          paddingTop: '2rem',
          borderTop: '1px solid #374151',
          fontSize: '0.875rem',
          color: '#9ca3af',
        },
      },
    },
    rootComponentIds: ['footer-section'],
    createdAt: new Date().toISOString(),
  },

  // 11. Newsletter Signup
  {
    id: 'newsletter',
    name: 'Newsletter Kayıt',
    description: 'E-posta listesi kayıt formu',
    category: 'marketing',
    components: {
      'newsletter-section': {
        id: 'newsletter-section',
        type: 'section',
        children: ['newsletter-container'],
        styles: {
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
        },
      },
      'newsletter-container': {
        id: 'newsletter-container',
        type: 'container',
        parentId: 'newsletter-section',
        children: ['newsletter-heading', 'newsletter-text'],
        styles: {
          maxWidth: '700px',
          margin: '0 auto',
          textAlign: 'center',
        },
      },
      'newsletter-heading': {
        id: 'newsletter-heading',
        type: 'heading',
        parentId: 'newsletter-container',
        content: { text: 'Kampanyalardan Haberdar Olun' },
        styles: {
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '1rem',
        },
      },
      'newsletter-text': {
        id: 'newsletter-text',
        type: 'text',
        parentId: 'newsletter-container',
        content: { text: 'E-posta adresinizi bırakın, fırsatları ilk siz öğrenin' },
        styles: {
          fontSize: '1.125rem',
          marginBottom: '2rem',
        },
      },
    },
    rootComponentIds: ['newsletter-section'],
    createdAt: new Date().toISOString(),
  },

  // 12. Stats Counter
  {
    id: 'stats-section',
    name: 'İstatistik Sayaçları',
    description: '4 kolonlu istatistik gösterimi',
    category: 'marketing',
    components: {
      'stats-section': {
        id: 'stats-section',
        type: 'section',
        children: ['stats-container'],
        styles: {
          padding: '4rem 2rem',
          backgroundColor: '#111827',
          color: '#ffffff',
        },
      },
      'stats-container': {
        id: 'stats-container',
        type: 'container',
        parentId: 'stats-section',
        children: ['stats-grid'],
        styles: { maxWidth: '1200px', margin: '0 auto' },
      },
      'stats-grid': {
        id: 'stats-grid',
        type: 'grid',
        parentId: 'stats-container',
        styles: {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '3rem',
          textAlign: 'center',
        },
      },
    },
    rootComponentIds: ['stats-section'],
    createdAt: new Date().toISOString(),
  },
];

