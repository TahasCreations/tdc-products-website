import React from 'react';
import { GetServerSideProps } from 'next';
import { StoreProvider, useStoreInfo } from '../../components/StoreProvider';
import { PrismaClient } from '@prisma/client';

interface StorePageProps {
  store: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    theme: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
  } | null;
  products: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
    images: string[];
  }>;
}

function StorePageContent({ store, products }: StorePageProps) {
  const storeInfo = useStoreInfo();

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Store Not Found</h1>
          <p className="text-gray-600 mb-8">The store you're looking for doesn't exist or is not published.</p>
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
            <div className="text-sm text-gray-500">
              {storeInfo.isCustomDomain ? 'Custom Domain' : 'Subdomain'}
            </div>
          </div>
        </div>
      </header>

      {/* Store Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Store Description */}
        {store.description && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {store.name}</h2>
            <p className="text-gray-600 leading-relaxed">{store.description}</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Products</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {product.images.length > 0 && (
                    <img 
                      src={product.images[0]} 
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
                    <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                    <a 
                      href={`/${store.slug}/products/${product.slug}`}
                      className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Product
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products available yet.</p>
            </div>
          )}
        </div>

        {/* Store Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Store ID:</span>
              <span className="ml-2 text-gray-600">{store.id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Slug:</span>
              <span className="ml-2 text-gray-600">{store.slug}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Domain Type:</span>
              <span className="ml-2 text-gray-600">
                {storeInfo.isCustomDomain ? 'Custom Domain' : 'Subdomain'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Current Domain:</span>
              <span className="ml-2 text-gray-600">{storeInfo.domain || 'N/A'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function StorePage(props: StorePageProps) {
  return (
    <StoreProvider>
      <StorePageContent {...props} />
    </StoreProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };
  const { hostname } = context.req;

  const prisma = new PrismaClient();

  try {
    // Check if this is a custom domain request
    const isCustomDomain = !hostname.includes('vercel.app') && 
                          !hostname.includes('localhost') && 
                          !hostname.includes('127.0.0.1');

    let store = null;

    if (isCustomDomain) {
      // Find store by domain
      const storeDomain = await prisma.storeDomain.findFirst({
        where: {
          domain: hostname,
          status: 'VERIFIED'
        },
        include: {
          store: true
        }
      });

      if (storeDomain) {
        store = storeDomain.store;
      }
    } else {
      // Find store by slug
      store = await prisma.store.findFirst({
        where: {
          slug: slug,
          status: 'ACTIVE',
          isPublished: true
        }
      });
    }

    if (!store) {
      return {
        notFound: true
      };
    }

    // Get products for this store
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
        images: true
      },
      take: 12,
      orderBy: {
        createdAt: 'desc'
      }
    });

    await prisma.$disconnect();

    return {
      props: {
        store: {
          id: store.id,
          name: store.name,
          slug: store.slug,
          description: store.description,
          logo: store.logo,
          theme: store.theme,
          metaTitle: store.metaTitle,
          metaDescription: store.metaDescription
        },
        products: products.map(product => ({
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: Number(product.price),
          images: product.images
        }))
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

