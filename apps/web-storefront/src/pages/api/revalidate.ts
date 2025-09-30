import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const { tenantId, storeId, path } = req.query;

    if (!tenantId || !storeId) {
      return res.status(400).json({ message: 'tenantId and storeId are required' });
    }

    // Get pages that need revalidation
    const pages = await prisma.storePage.findMany({
      where: {
        tenantId: tenantId as string,
        storeId: storeId as string,
        isPublished: true,
        status: 'PUBLISHED',
        OR: [
          { revalidateAt: { lte: new Date() } },
          { revalidateAt: null }
        ]
      },
      include: {
        store: true
      }
    });

    const revalidatedPaths: string[] = [];
    const errors: string[] = [];

    for (const page of pages) {
      try {
        // Determine the revalidation path
        let revalidatePath: string;
        
        if (page.store.slug) {
          // Subdomain path
          revalidatePath = `/${page.store.slug}${page.path}`;
        } else {
          // Custom domain path
          revalidatePath = page.path;
        }

        // Revalidate the page
        await res.revalidate(revalidatePath);
        
        // Update revalidation time
        const nextRevalidation = new Date();
        nextRevalidation.setSeconds(nextRevalidation.getSeconds() + page.cacheTtl);
        
        await prisma.storePage.update({
          where: { id: page.id },
          data: { revalidateAt: nextRevalidation }
        });

        revalidatedPaths.push(revalidatePath);
      } catch (error) {
        console.error(`Error revalidating page ${page.id}:`, error);
        errors.push(`Failed to revalidate ${page.path}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // If specific path is provided, revalidate only that path
    if (path) {
      const specificPage = await prisma.storePage.findFirst({
        where: {
          tenantId: tenantId as string,
          storeId: storeId as string,
          path: path as string,
          isPublished: true,
          status: 'PUBLISHED'
        },
        include: {
          store: true
        }
      });

      if (specificPage) {
        try {
          let revalidatePath: string;
          
          if (specificPage.store.slug) {
            revalidatePath = `/${specificPage.store.slug}${specificPage.path}`;
          } else {
            revalidatePath = specificPage.path;
          }

          await res.revalidate(revalidatePath);
          
          // Update revalidation time
          const nextRevalidation = new Date();
          nextRevalidation.setSeconds(nextRevalidation.getSeconds() + specificPage.cacheTtl);
          
          await prisma.storePage.update({
            where: { id: specificPage.id },
            data: { revalidateAt: nextRevalidation }
          });

          revalidatedPaths.push(revalidatePath);
        } catch (error) {
          console.error(`Error revalidating specific page:`, error);
          errors.push(`Failed to revalidate ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    return res.json({
      revalidated: true,
      revalidatedPaths,
      errors,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return res.status(500).json({ 
      message: 'Error revalidating pages',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
}

