/**
 * AutoImage Orchestrator - Boş görsel alanları için otomatik üretim pipeline'ı
 * Öncelik sırası: Medya Kütüphanesi → Prosedürel SVG → Dinamik OG → (Opsiyonel) AI
 */

import { MediaType, VariantSize, MediaItem } from './mediaLibrary';

// Slot türleri
export const SlotType = {
  CATEGORY_HERO: 'category.hero',
  CATEGORY_BANNER: 'category.banner',
  PRODUCT_CARD: 'product.card',
  PRODUCT_HERO: 'product.hero',
  EDITORIAL_BANNER: 'editorial.banner',
  UGC_GALLERY: 'ugc.gallery',
  OG_IMAGE: 'og.image'
} as const;

export type SlotType = typeof SlotType[keyof typeof SlotType];

// Slot boyutları
export const SLOT_DIMENSIONS: Record<SlotType, {
  desktop: { width: number; height: number };
  tablet?: { width: number; height: number };
  mobile?: { width: number; height: number };
}> = {
  [SlotType.CATEGORY_HERO]: {
    desktop: { width: 1920, height: 900 },
    tablet: { width: 1280, height: 720 },
    mobile: { width: 820, height: 520 }
  },
  [SlotType.CATEGORY_BANNER]: {
    desktop: { width: 1440, height: 480 },
    tablet: { width: 1024, height: 360 },
    mobile: { width: 640, height: 240 }
  },
  [SlotType.PRODUCT_CARD]: {
    desktop: { width: 800, height: 1000 },
    tablet: { width: 600, height: 750 },
    mobile: { width: 400, height: 500 }
  },
  [SlotType.PRODUCT_HERO]: {
    desktop: { width: 1200, height: 800 },
    tablet: { width: 900, height: 600 },
    mobile: { width: 600, height: 400 }
  },
  [SlotType.EDITORIAL_BANNER]: {
    desktop: { width: 1440, height: 600 },
    tablet: { width: 1024, height: 400 },
    mobile: { width: 640, height: 300 }
  },
  [SlotType.UGC_GALLERY]: {
    desktop: { width: 400, height: 400 },
    tablet: { width: 300, height: 300 },
    mobile: { width: 200, height: 200 }
  },
  [SlotType.OG_IMAGE]: {
    desktop: { width: 1200, height: 630 }
  }
};

// Slot context
export interface SlotContext {
  slotType: SlotType;
  category?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  colorPalette?: string[];
  accentColor?: string;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
}

// AutoImage sonucu
export interface AutoImageResult {
  url: string;
  source: 'media_library' | 'procedural_svg' | 'dynamic_og' | 'ai_generated';
  alt: string;
  width: number;
  height: number;
  format: 'svg' | 'png' | 'webp' | 'avif';
  size: number;
  metadata?: {
    mediaItemId?: string;
    generatedAt: string;
    prompt?: string;
  };
}

// Prosedürel SVG şablonları
export const SVG_TEMPLATES = {
  'figur-koleksiyon': {
    background: 'linear-gradient(135deg, #0B0B0B 0%, #1a1a1a 100%)',
    accent: '#CBA135',
    elements: [
      {
        type: 'neon-line',
        path: 'M 100 200 Q 300 100 500 200 T 900 200',
        stroke: '#CBA135',
        strokeWidth: 3,
        opacity: 0.8,
        animation: 'pulse'
      },
      {
        type: 'silhouette',
        path: 'M 200 300 L 250 250 L 300 300 L 350 250 L 400 300 L 450 250 L 500 300 L 550 250 L 600 300 L 650 250 L 700 300',
        fill: '#CBA135',
        opacity: 0.3
      }
    ],
    icon: 'figure'
  },
  'moda-aksesuar': {
    background: 'linear-gradient(135deg, #F6F6F6 0%, #E5E5E5 100%)',
    accent: '#CBA135',
    elements: [
      {
        type: 'geometric',
        shapes: [
          { type: 'circle', cx: 200, cy: 200, r: 50, fill: '#CBA135', opacity: 0.1 },
          { type: 'rect', x: 600, y: 150, width: 100, height: 200, fill: '#CBA135', opacity: 0.1 }
        ]
      },
      {
        type: 'texture',
        pattern: 'fabric',
        opacity: 0.05
      }
    ],
    icon: 'fashion'
  },
  'elektronik': {
    background: 'linear-gradient(135deg, #0B0B0B 0%, #1a1a2e 100%)',
    accent: '#CBA135',
    elements: [
      {
        type: 'grid',
        size: 50,
        stroke: '#CBA135',
        opacity: 0.1,
        strokeWidth: 1
      },
      {
        type: 'circuit',
        path: 'M 100 300 L 200 250 L 300 300 L 400 250 L 500 300 L 600 250 L 700 300',
        stroke: '#CBA135',
        strokeWidth: 2,
        opacity: 0.6,
        animation: 'flow'
      }
    ],
    icon: 'tech'
  },
  'ev-yasam': {
    background: 'linear-gradient(135deg, #FEF7E0 0%, #F5E6D3 100%)',
    accent: '#CBA135',
    elements: [
      {
        type: 'soft-blobs',
        shapes: [
          { type: 'circle', cx: 300, cy: 200, r: 80, fill: '#CBA135', opacity: 0.1 },
          { type: 'circle', cx: 700, cy: 400, r: 120, fill: '#CBA135', opacity: 0.08 },
          { type: 'circle', cx: 500, cy: 600, r: 60, fill: '#CBA135', opacity: 0.12 }
        ]
      }
    ],
    icon: 'home'
  },
  'sanat-hobi': {
    background: 'linear-gradient(135deg, #F0F0F0 0%, #E0E0E0 100%)',
    accent: '#CBA135',
    elements: [
      {
        type: 'paint-strokes',
        strokes: [
          { path: 'M 100 200 Q 200 150 300 200', stroke: '#CBA135', strokeWidth: 8, opacity: 0.3 },
          { path: 'M 400 300 Q 500 250 600 300', stroke: '#CBA135', strokeWidth: 6, opacity: 0.2 },
          { path: 'M 200 400 Q 300 350 400 400', stroke: '#CBA135', strokeWidth: 10, opacity: 0.25 }
        ]
      }
    ],
    icon: 'art'
  },
  'hediyelik': {
    background: 'linear-gradient(135deg, #FFF5E6 0%, #FFE4B5 100%)',
    accent: '#CBA135',
    elements: [
      {
        type: 'celebration',
        confetti: [
          { x: 200, y: 100, color: '#CBA135', size: 10 },
          { x: 400, y: 150, color: '#F4D03F', size: 8 },
          { x: 600, y: 120, color: '#CBA135', size: 12 },
          { x: 800, y: 180, color: '#F4D03F', size: 9 }
        ],
        ribbons: [
          { x1: 100, y1: 300, x2: 200, y2: 250, stroke: '#CBA135', strokeWidth: 4 },
          { x1: 700, y1: 350, x2: 800, y2: 300, stroke: '#F4D03F', strokeWidth: 4 }
        ]
      }
    ],
    icon: 'gift'
  }
};

// AutoImage Orchestrator sınıfı
export class AutoImageOrchestrator {
  private mediaLibrary: any; // MediaLibraryService instance
  private cache: Map<string, AutoImageResult> = new Map();

  constructor(mediaLibrary: any) {
    this.mediaLibrary = mediaLibrary;
  }

  /**
   * Ana orchestrator metodu - slot için görsel üretir
   */
  async generateImage(context: SlotContext): Promise<AutoImageResult> {
    const cacheKey = this.getCacheKey(context);
    
    // Cache kontrolü
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let result: AutoImageResult;

    try {
      // 1. Öncelik: Medya Kütüphanesi
      result = await this.tryMediaLibrary(context);
    } catch (error) {
      console.warn('Media library failed:', error);
      
      try {
        // 2. Prosedürel SVG
        result = await this.generateProceduralSVG(context);
      } catch (error) {
        console.warn('Procedural SVG failed:', error);
        
        try {
          // 3. Dinamik OG
          result = await this.generateDynamicOG(context);
        } catch (error) {
          console.warn('Dynamic OG failed:', error);
          
          // 4. Son çare: Basit fallback SVG
          result = await this.generateFallbackSVG(context);
        }
      }
    }

    // Cache'e kaydet
    this.cache.set(cacheKey, result);
    return result;
  }

  /**
   * 1. Medya Kütüphanesi'nde uygun görsel ara
   */
  private async tryMediaLibrary(context: SlotContext): Promise<AutoImageResult> {
    if (!this.mediaLibrary) {
      throw new Error('Media library not available');
    }

    // Kategoriye göre tag'ler
    const tags = this.getTagsForContext(context);
    
    const { items } = await this.mediaLibrary.getMediaItems({
      tags,
      limit: 10
    });

    if (items.length === 0) {
      throw new Error('No suitable images in media library');
    }

    // En uygun görseli seç
    const selectedItem = this.selectBestMediaItem(items, context);
    const dimensions = this.getSlotDimensions(context);

    return {
      url: selectedItem.variants[this.getVariantForSlot(context)]?.url || selectedItem.variants.hero?.url,
      source: 'media_library',
      alt: selectedItem.alt || context.title,
      width: dimensions.width,
      height: dimensions.height,
      format: 'webp',
      size: selectedItem.size,
      metadata: {
        mediaItemId: selectedItem.id,
        generatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * 2. Prosedürel SVG üret
   */
  private async generateProceduralSVG(context: SlotContext): Promise<AutoImageResult> {
    const template = this.getSVGTemplate(context);
    const dimensions = this.getSlotDimensions(context);
    
    const svg = this.generateSVG(template, dimensions, context);
    const svgUrl = `data:image/svg+xml;base64,${btoa(svg)}`;

    return {
      url: svgUrl,
      source: 'procedural_svg',
      alt: context.title,
      width: dimensions.width,
      height: dimensions.height,
      format: 'svg',
      size: svg.length,
      metadata: {
        generatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * 3. Dinamik OG görsel üret
   */
  private async generateDynamicOG(context: SlotContext): Promise<AutoImageResult> {
    const dimensions = this.getSlotDimensions(context);
    
    const ogUrl = `/api/og?${new URLSearchParams({
      title: context.title,
      subtitle: context.subtitle || '',
      category: context.category || '',
      width: dimensions.width.toString(),
      height: dimensions.height.toString(),
      type: context.slotType
    })}`;

    return {
      url: ogUrl,
      source: 'dynamic_og',
      alt: context.title,
      width: dimensions.width,
      height: dimensions.height,
      format: 'png',
      size: 0, // Bilinmiyor
      metadata: {
        generatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * 4. Basit fallback SVG
   */
  private async generateFallbackSVG(context: SlotContext): Promise<AutoImageResult> {
    const dimensions = this.getSlotDimensions(context);
    
    const fallbackSvg = `
      <svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0B0B0B;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
              font-family="Inter, sans-serif" font-size="48" font-weight="bold" 
              fill="#CBA135">${context.title}</text>
      </svg>
    `;

    const svgUrl = `data:image/svg+xml;base64,${btoa(fallbackSvg)}`;

    return {
      url: svgUrl,
      source: 'procedural_svg',
      alt: context.title,
      width: dimensions.width,
      height: dimensions.height,
      format: 'svg',
      size: fallbackSvg.length,
      metadata: {
        generatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Yardımcı metodlar
   */
  private getCacheKey(context: SlotContext): string {
    return `${context.slotType}-${context.category || 'default'}-${context.deviceType || 'desktop'}`;
  }

  private getTagsForContext(context: SlotContext): string[] {
    const baseTags: string[] = [context.slotType];
    if (context.category) {
      baseTags.push(context.category);
    }
    return baseTags;
  }

  private selectBestMediaItem(items: MediaItem[], context: SlotContext): MediaItem {
    // Basit seçim algoritması - gerçek uygulamada daha sofistike olabilir
    return items[0];
  }

  private getVariantForSlot(context: SlotContext): string {
    switch (context.slotType) {
      case SlotType.CATEGORY_HERO:
      case SlotType.PRODUCT_HERO:
        return 'hero';
      case SlotType.PRODUCT_CARD:
        return 'card';
      case SlotType.CATEGORY_BANNER:
      case SlotType.EDITORIAL_BANNER:
        return 'banner';
      default:
        return 'hero';
    }
  }

  private getSlotDimensions(context: SlotContext): { width: number; height: number } {
    const slotConfig = SLOT_DIMENSIONS[context.slotType];
    const deviceType = context.deviceType || 'desktop';
    return slotConfig[deviceType] || slotConfig.desktop;
  }

  private getSVGTemplate(context: SlotContext): any {
    if (context.category && SVG_TEMPLATES[context.category as keyof typeof SVG_TEMPLATES]) {
      return SVG_TEMPLATES[context.category as keyof typeof SVG_TEMPLATES];
    }
    
    // Varsayılan template
    return {
      background: 'linear-gradient(135deg, #0B0B0B 0%, #1a1a1a 100%)',
      accent: '#CBA135',
      elements: [],
      icon: 'default'
    };
  }

  private generateSVG(template: any, dimensions: { width: number; height: number }, context: SlotContext): string {
    const { width, height } = dimensions;
    const accentColor = context.accentColor || template.accent;
    
    let svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0B0B0B;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
          </linearGradient>
    `;

    // Template elementlerini ekle
    template.elements.forEach((element: any) => {
      svg += this.renderSVGElement(element, accentColor);
    });

    // Logo watermark
    svg += `
          <text x="50" y="50" font-family="Inter, sans-serif" font-size="24" font-weight="bold" 
                fill="${accentColor}" opacity="0.3">TDC Market</text>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#bg)"/>
        
        <!-- Ana başlık -->
        <text x="50%" y="40%" text-anchor="middle" dominant-baseline="middle" 
              font-family="Inter, sans-serif" font-size="64" font-weight="bold" 
              fill="#F6F6F6">${context.title}</text>
    `;

    // Alt başlık
    if (context.subtitle) {
      svg += `
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
              font-family="Inter, sans-serif" font-size="32" font-weight="normal" 
              fill="#F6F6F6" opacity="0.8">${context.subtitle}</text>
      `;
    }

    // CTA butonu
    if (context.ctaText) {
      svg += `
        <rect x="${width/2 - 100}" y="70%" width="200" height="50" rx="25" 
              fill="${accentColor}" opacity="0.9"/>
        <text x="50%" y="72.5%" text-anchor="middle" dominant-baseline="middle" 
              font-family="Inter, sans-serif" font-size="18" font-weight="bold" 
              fill="#0B0B0B">${context.ctaText}</text>
      `;
    }

    svg += '</svg>';
    return svg;
  }

  private renderSVGElement(element: any, accentColor: string): string {
    switch (element.type) {
      case 'neon-line':
        return `
          <path d="${element.path}" stroke="${element.stroke || accentColor}" 
                stroke-width="${element.strokeWidth}" fill="none" opacity="${element.opacity}"
                stroke-linecap="round">
            ${element.animation === 'pulse' ? '<animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>' : ''}
          </path>
        `;
      
      case 'silhouette':
        return `
          <path d="${element.path}" fill="${element.fill || accentColor}" opacity="${element.opacity}"/>
        `;
      
      case 'geometric':
        return element.shapes.map((shape: any) => {
          if (shape.type === 'circle') {
            return `<circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" 
                           fill="${shape.fill}" opacity="${shape.opacity}"/>`;
          } else if (shape.type === 'rect') {
            return `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" 
                          fill="${shape.fill}" opacity="${shape.opacity}"/>`;
          }
          return '';
        }).join('');
      
      case 'circuit':
        return `
          <path d="${element.path}" stroke="${element.stroke || accentColor}" 
                stroke-width="${element.strokeWidth}" fill="none" opacity="${element.opacity}"
                stroke-linecap="round" stroke-linejoin="round">
            ${element.animation === 'flow' ? '<animate attributeName="stroke-dasharray" values="0,1000;1000,0;0,1000" dur="3s" repeatCount="indefinite"/>' : ''}
          </path>
        `;
      
      case 'soft-blobs':
        return element.shapes.map((shape: any) => {
          return `<circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" 
                         fill="${shape.fill}" opacity="${shape.opacity}"/>`;
        }).join('');
      
      case 'paint-strokes':
        return element.strokes.map((stroke: any) => {
          return `<path d="${stroke.path}" stroke="${stroke.stroke}" 
                       stroke-width="${stroke.strokeWidth}" fill="none" opacity="${stroke.opacity}"
                       stroke-linecap="round"/>`;
        }).join('');
      
      case 'celebration':
        let celebrationSvg = '';
        element.confetti.forEach((confetti: any) => {
          celebrationSvg += `<circle cx="${confetti.x}" cy="${confetti.y}" r="${confetti.size}" 
                                    fill="${confetti.color}" opacity="0.8"/>`;
        });
        element.ribbons.forEach((ribbon: any) => {
          celebrationSvg += `<line x1="${ribbon.x1}" y1="${ribbon.y1}" x2="${ribbon.x2}" y2="${ribbon.y2}" 
                                  stroke="${ribbon.stroke}" stroke-width="${ribbon.strokeWidth}"/>`;
        });
        return celebrationSvg;
      
      default:
        return '';
    }
  }

  /**
   * Cache temizleme
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Cache durumu
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Varsayılan orchestrator instance
export const autoImageOrchestrator = new AutoImageOrchestrator(null);