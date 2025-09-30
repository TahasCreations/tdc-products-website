import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { StoreProvider, useStoreInfo } from '../../components/StoreProvider';
import PageBuilder from '../../components/PageBuilder';
import { LayoutConfig } from '@tdc/domain';
import { PrismaClient } from '@prisma/client';

interface PageBuilderPageProps {
  store: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    theme: any;
  } | null;
  layout: LayoutConfig | null;
  products: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
    images: string[];
    description?: string;
  }>;
}

function PageBuilderPageContent({ store, layout, products }: PageBuilderPageProps) {
  const storeInfo = useStoreInfo();
  const [isEditing, setIsEditing] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<LayoutConfig | null>(layout);

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

  const handleProductClick = (product: any) => {
    // Navigate to product detail page
    window.location.href = `/${store.slug}/products/${product.slug}`;
  };

  const handleAddToCart = (product: any) => {
    // Add to cart logic
    console.log('Add to cart:', product);
    // You can implement cart functionality here
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Save layout changes
    console.log('Saving layout:', currentLayout);
    setIsEditing(false);
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
              <span className="text-sm text-gray-500">
                {storeInfo.isCustomDomain ? 'Custom Domain' : 'Subdomain'}
              </span>
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {isEditing ? 'Exit Edit' : 'Edit Page'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Edit Mode Overlay */}
      {isEditing && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-yellow-800">
                  Edit Mode: You can now modify the page layout
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-sm text-yellow-700 hover:text-yellow-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-yellow-600 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <main>
        {currentLayout ? (
          <PageBuilder
            layout={currentLayout}
            theme={store.theme}
            products={products}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to {store.name}</h2>
              {store.description && (
                <p className="text-lg text-gray-600 mb-8">{store.description}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(0, 6).map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {product.images && product.images.length > 0 && (
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
                      <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                      <button
                        onClick={() => handleProductClick(product)}
                        className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Product
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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

export default function PageBuilderPage(props: PageBuilderPageProps) {
  return (
    <StoreProvider>
      <PageBuilderPageContent {...props} />
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
    let layout = null;

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
        layout = storeDomain.store.themes[0]?.layoutJson || null;
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
        layout = foundStore.themes[0]?.layoutJson || null;
      }
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
        images: true,
        description: true
      },
      take: 20,
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
          theme: store.themes[0] || null
        },
        layout: layout,
        products: products.map(product => ({
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: Number(product.price),
          images: product.images,
          description: product.description
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

