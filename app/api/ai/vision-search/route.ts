export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { aiEmbed } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return Response.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert image to base64
    const buffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');

    // Use AI to extract features from image
    // For now, we'll do a simple text-based search
    // In production, use vision AI API (Google Vision, AWS Rekognition, etc.)
    
    // Mock: Extract keywords from image (in production, use real AI vision)
    const imageKeywords = await extractKeywordsFromImage(base64Image);

    // Search products based on keywords
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: imageKeywords, mode: 'insensitive' } },
          { description: { contains: imageKeywords, mode: 'insensitive' } },
          { category: { contains: imageKeywords, mode: 'insensitive' } },
        ],
        stock: { gt: 0 },
      },
      take: 10,
      orderBy: { rating: 'desc' },
    });

    return Response.json({
      success: true,
      products: products.map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.title,
        price: p.price,
        image: p.image,
      })),
    });
  } catch (error) {
    console.error('Vision search error:', error);
    return Response.json(
      { success: false, error: 'Failed to search products' },
      { status: 500 }
    );
  }
}

// Mock function - in production, replace with real AI vision API
async function extractKeywordsFromImage(base64Image: string): Promise<string> {
  // This is a placeholder - in production, use:
  // - Google Cloud Vision API
  // - AWS Rekognition
  // - Azure Computer Vision
  // - OpenAI GPT-4 Vision
  
  // For now, return generic search
  return 'popular trendy';
}


