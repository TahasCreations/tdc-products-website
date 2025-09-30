import React from 'react';
import { GetServerSideProps } from 'next';
import { StoreProvider, useStoreInfo } from '../../components/StoreProvider';
import PageBuilder from '../../components/PageBuilder';
import { PrismaClient } from '@prisma/client';
import { PageStatus, CampaignType } from '@tdc/domain';

interface DynamicPageProps {
  page: {
    id: string;
    title: string;
    description?: string;
    content?: any;
    layoutJson?: any;
    themeId?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords: string[];
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    status: PageStatus;
    isPublished: boolean;
    isCampaign: boolean;
    campaignType?: CampaignType;
    discountCode?: string;
    priority: number;
    viewCount: number;
    startAt?: Date;
    endAt?: Date;
    revalidateAt?: Date;
  } | null;
  store: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    theme?: any;
  } | null;
  products: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
    images: string[];
    description?: string;
  }>;
  isCampaign: boolean;
  campaignData?: {
    type: CampaignType;
    discountCode?: string;
    endDate?: Date;
    priority: number;
  };
}

function DynamicPageContent({ 
  page, 
  store, 
  products, 
  isCampaign, 
  campaignData 
}: DynamicPageProps) {
  const storeInfo = useStoreInfo();

  if (!page || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or is not published.</p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // Check if page is published and within date range
  const now = new Date();
  const isPageActive = page.isPublished && 
    (!page.startAt || page.startAt <= now) && 
    (!page.endAt || page.endAt >= now);

  if (!isPageActive) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Available</h1>
          <p className="text-gray-600 mb-8">
            {page.startAt && page.startAt > now 
              ? 'This page is scheduled to be published later.'
              : page.endAt && page.endAt < now
              ? 'This page has expired.'
              : 'This page is not published.'
            }
          </p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const handleProductClick = (product: any) => {
    window.location.href = `/${store.slug}/products/${product.slug}`;
  };

  const handleAddToCart = (product: any) => {
    console.log('Add to cart:', product);
    // Implement cart functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {store.logo && (
                <img 
                  src={store.logo} 
                  alt={store.name}
                  className="h-8 w-8 rounded-full mr-3"
                />
              )}
              <h1 className="text-xl font-semibold text-gray-900">{store.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isCampaign && campaignData && (
                <div className="flex items-center space-x-2">
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {campaignData.type}
                  </span>
                  {campaignData.discountCode && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {campaignData.discountCode}
                    </span>
                  )}
                </div>
              )}
              <span className="text-sm text-gray-500">
                {storeInfo.isCustomDomain ? 'Custom Domain' : 'Subdomain'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Campaign Banner */}
      {isCampaign && campaignData && (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <span className="text-sm font-medium">
                🎉 {campaignData.type} Campaign Active
                {campaignData.discountCode && ` - Use code: ${campaignData.discountCode}`}
                {campaignData.endDate && ` - Ends ${campaignData.endDate.toLocaleDateString()}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <main>
        {page.layoutJson ? (
          <PageBuilder
            layout={page.layoutJson}
            theme={store.theme}
            products={products}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="prose prose-lg max-w-none">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{page.title}</h1>
              {page.description && (
                <p className="text-xl text-gray-600 mb-8">{page.description}</p>
              )}
              {page.content && (
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Store Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">&copy; 2024 {store.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function DynamicPage(props: DynamicPageProps) {
  return (
    <StoreProvider>
      <DynamicPageContent {...props} />
    </StoreProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug, path } = context.params as { slug: string; path: string[] };
  const { hostname } = context.req;

  const prisma = new PrismaClient();

  try {
    // Check if this is a custom domain request
    const isCustomDomain = !hostname.includes('vercel.app') && 
                          !hostname.includes('localhost') && 
                          !hostname.includes('127.0.0.1');

    let store = null;
    let page = null;

    if (isCustomDomain) {
      // Find store by domain
      const storeDomain = await prisma.storeDomain.findFirst({
        where: {
          domain: hostname,
          status: 'VERIFIED'
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

      if (storeDomain) {
        store = storeDomain.store;
        
        // Find page by path
        const fullPath = '/' + (path || []).join('/');
        page = await prisma.storePage.findFirst({
          where: {
            storeId: store.id,
            path: fullPath,
            isPublished: true,
            status: 'PUBLISHED'
          }
        });
      }
    } else {
      // Find store by slug
      const foundStore = await prisma.store.findFirst({
        where: {
          slug: slug,
          status: 'ACTIVE',
          isPublished: true
        },
        include: {
          themes: {
            where: { isActive: true },
            take: 1
          }
        }
      });

      if (foundStore) {
        store = foundStore;
        
        // Find page by path
        const fullPath = '/' + (path || []).join('/');
        page = await prisma.storePage.findFirst({
          where: {
            storeId: store.id,
            path: fullPath,
            isPublished: true,
            status: 'PUBLISHED'
          }
        });
      }
    }

    if (!store || !page) {
      return {
        notFound: true
      };
    }

    // Check if page is within date range
    const now = new Date();
    const isPageActive = (!page.startAt || page.startAt <= now) && 
                        (!page.endAt || page.endAt >= now);

    if (!isPageActive) {
      return {
        notFound: true
      };
    }

    // Get products for this store (for PageBuilder)
    const products = await prisma.product.findMany({
      where: {
        storeId: store.id,
        enabled: true
      },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        images: true,
        description: true
      },
      take: 20,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Update view count
    await prisma.storePage.update({
      where: { id: page.id },
      data: {
        viewCount: { increment: 1 },
        lastViewedAt: new Date()
      }
    });

    await prisma.$disconnect();

    const isCampaign = page.isCampaign;
    const campaignData = isCampaign ? {
      type: page.campaignType,
      discountCode: page.discountCode,
      endDate: page.endAt,
      priority: page.priority
    } : undefined;

    return {
      props: {
        page: {
          id: page.id,
          title: page.title,
          description: page.description,
          content: page.content,
          layoutJson: page.layoutJson,
          themeId: page.themeId,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          metaKeywords: page.metaKeywords,
          ogImage: page.ogImage,
          ogTitle: page.ogTitle,
          ogDescription: page.ogDescription,
          status: page.status,
          isPublished: page.isPublished,
          isCampaign: page.isCampaign,
          campaignType: page.campaignType,
          discountCode: page.discountCode,
          priority: page.priority,
          viewCount: page.viewCount + 1,
          startAt: page.startAt,
          endAt: page.endAt,
          revalidateAt: page.revalidateAt
        },
        store: {
          id: store.id,
          name: store.name,
          slug: store.slug,
          description: store.description,
          logo: store.logo,
          theme: store.themes[0] || null
        },
        products: products.map(product => ({
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: Number(product.price),
          images: product.images,
          description: product.description
        })),
        isCampaign,
        campaignData
      }
    };

  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    await prisma.$disconnect();
    
    return {
      notFound: true
    };
  }
};

