import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tenantId, storeId, path } = req.query;

  if (!tenantId || !storeId || !path) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    // Get page data
    const fullPath = '/' + (Array.isArray(path) ? path.join('/') : path);
    
    const page = await prisma.storePage.findFirst({
      where: {
        tenantId: tenantId as string,
        storeId: storeId as string,
        path: fullPath,
        isPublished: true,
        status: 'PUBLISHED'
      },
      include: {
        store: {
          include: {
            themes: {
              where: { isActive: true },
              take: 1
            }
          }
        }
      }
    });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    // Generate OG image
    const ogImageData = {
      title: page.ogTitle || page.title,
      description: page.ogDescription || page.metaDescription || page.description,
      imageUrl: page.ogImage,
      storeName: page.store.name,
      storeLogo: page.store.logo,
      campaignType: page.isCampaign ? page.campaignType : undefined,
      discountCode: page.discountCode,
      endDate: page.endAt,
      theme: page.store.themes[0] ? {
        primaryColor: page.store.themes[0].colors?.primary || '#3B82F6',
        secondaryColor: page.store.themes[0].colors?.secondary || '#6B7280',
        fontFamily: page.store.themes[0].typography?.fontFamily?.primary || 'Inter'
      } : {
        primaryColor: '#3B82F6',
        secondaryColor: '#6B7280',
        fontFamily: 'Inter'
      }
    };

    // Generate SVG OG image
    const svg = generateOGImageSVG(ogImageData);

    // Set headers
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.setHeader('Content-Disposition', 'inline; filename="og-image.svg"');

    return res.status(200).send(svg);

  } catch (error) {
    console.error('OG image generation error:', error);
    return res.status(500).json({ 
      message: 'Error generating OG image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
}

function generateOGImageSVG(data: {
  title: string;
  description?: string;
  imageUrl?: string;
  storeName: string;
  storeLogo?: string;
  campaignType?: string;
  discountCode?: string;
  endDate?: Date;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}): string {
  const { title, description, imageUrl, storeName, storeLogo, campaignType, discountCode, endDate, theme } = data;

  // Truncate text to fit
  const truncatedTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  const truncatedDescription = description && description.length > 120 
    ? description.substring(0, 117) + '...' 
    : description;

  // Campaign badge
  const campaignBadge = campaignType ? `
    <rect x="40" y="40" width="120" height="32" rx="16" fill="${theme.primaryColor}"/>
    <text x="100" y="60" text-anchor="middle" fill="white" font-family="${theme.fontFamily}" font-size="14" font-weight="600">
      ${campaignType}
    </text>
  ` : '';

  // Discount code badge
  const discountBadge = discountCode ? `
    <rect x="40" y="80" width="120" height="32" rx="16" fill="${theme.secondaryColor}"/>
    <text x="100" y="100" text-anchor="middle" fill="white" font-family="${theme.fontFamily}" font-size="12" font-weight="500">
      ${discountCode}
    </text>
  ` : '';

  // End date badge
  const endDateBadge = endDate ? `
    <rect x="40" y="120" width="120" height="28" rx="14" fill="#EF4444"/>
    <text x="100" y="138" text-anchor="middle" fill="white" font-family="${theme.fontFamily}" font-size="11" font-weight="500">
      Ends ${endDate.toLocaleDateString()}
    </text>
  ` : '';

  // Background image
  const backgroundImage = imageUrl ? `
    <defs>
      <pattern id="bg-image" patternUnits="userSpaceOnUse" width="1200" height="630">
        <image href="${imageUrl}" x="0" y="0" width="1200" height="630" preserveAspectRatio="cover"/>
      </pattern>
    </defs>
    <rect width="1200" height="630" fill="url(#bg-image)"/>
    <rect width="1200" height="630" fill="rgba(0,0,0,0.4)"/>
  ` : `
    <rect width="1200" height="630" fill="linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)"/>
  `;

  return `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      ${backgroundImage}
      
      <!-- Store Logo -->
      ${storeLogo ? `
        <image href="${storeLogo}" x="60" y="60" width="80" height="80" preserveAspectRatio="xMidYMid slice"/>
      ` : ''}
      
      <!-- Store Name -->
      <text x="60" y="200" fill="white" font-family="${theme.fontFamily}" font-size="24" font-weight="600">
        ${storeName}
      </text>
      
      <!-- Page Title -->
      <text x="60" y="260" fill="white" font-family="${theme.fontFamily}" font-size="48" font-weight="700">
        ${truncatedTitle}
      </text>
      
      <!-- Description -->
      ${truncatedDescription ? `
        <text x="60" y="320" fill="rgba(255,255,255,0.9)" font-family="${theme.fontFamily}" font-size="24" font-weight="400">
          ${truncatedDescription}
        </text>
      ` : ''}
      
      <!-- Campaign Badges -->
      ${campaignBadge}
      ${discountBadge}
      ${endDateBadge}
      
      <!-- Bottom gradient -->
      <defs>
        <linearGradient id="bottomGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:transparent;stop-opacity:0" />
          <stop offset="100%" style="stop-color:black;stop-opacity:0.3" />
        </linearGradient>
      </defs>
      <rect width="1200" height="200" y="430" fill="url(#bottomGradient)"/>
      
      <!-- Website URL -->
      <text x="60" y="580" fill="rgba(255,255,255,0.8)" font-family="${theme.fontFamily}" font-size="18" font-weight="400">
        ${storeName.toLowerCase().replace(/\s+/g, '')}.com
      </text>
    </svg>
  `;
}

