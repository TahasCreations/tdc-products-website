import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import SEOHead from '../../../components/SEOHead';

interface StorePageProps {
  store: {
    id: string;
    name: string;
    description?: string;
    logo?: string;
    favicon?: string;
    canonicalDomain?: string;
    ga4MeasurementId?: string;
    metaPixelId?: string;
    googleTagManager?: string;
    hotjarId?: string;
    mixpanelToken?: string;
  };
  page?: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    structuredData?: Record<string, any>;
    breadcrumbs?: Array<{
      name: string;
      url: string;
      position: number;
    }>;
  };
  currentPath: string;
  currentDomain: string;
  notFound?: boolean;
}

export default function StorePage({
  store,
  page,
  currentPath,
  currentDomain,
  notFound = false
}: StorePageProps) {
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-8">Page not found</p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        store={store}
        page={page}
        currentPath={currentPath}
        currentDomain={currentDomain}
      />
      
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                {store.logo && (
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="h-8 w-auto mr-3"
                  />
                )}
                <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <a href="/" className="text-gray-500 hover:text-gray-900">Home</a>
                <a href="/products" className="text-gray-500 hover:text-gray-900">Products</a>
                <a href="/about" className="text-gray-500 hover:text-gray-900">About</a>
                <a href="/contact" className="text-gray-500 hover:text-gray-900">Contact</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {page ? (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {page.title || store.name}
              </h1>
              
              {page.description && (
                <p className="text-lg text-gray-600 mb-8">
                  {page.description}
                </p>
              )}

              {/* Breadcrumbs */}
              {page.breadcrumbs && page.breadcrumbs.length > 0 && (
                <nav className="flex mb-8" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2">
                    {page.breadcrumbs.map((item, index) => (
                      <li key={index} className="flex items-center">
                        {index > 0 && (
                          <svg
                            className="h-5 w-5 text-gray-400 mx-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <a
                          href={item.url}
                          className={`text-sm font-medium ${
                            index === page.breadcrumbs.length - 1
                              ? 'text-gray-500'
                              : 'text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {/* Page Content */}
              <div className="prose max-w-none">
                <p>This is a dynamic store page. Content would be rendered here based on the page configuration.</p>
                
                <h2>Store Information</h2>
                <ul>
                  <li><strong>Store ID:</strong> {store.id}</li>
                  <li><strong>Store Name:</strong> {store.name}</li>
                  <li><strong>Current Path:</strong> {currentPath}</li>
                  <li><strong>Current Domain:</strong> {currentDomain}</li>
                </ul>

                {page.structuredData && (
                  <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                    <h3>Structured Data</h3>
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(page.structuredData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Welcome to {store.name}
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                {store.description || 'Your one-stop shop for quality products.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Products</h3>
                  <p className="text-gray-600">Browse our wide selection of products</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About Us</h3>
                  <p className="text-gray-600">Learn more about our company</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact</h3>
                  <p className="text-gray-600">Get in touch with us</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2024 {store.name}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { storeId, path } = context.params as { storeId: string; path?: string[] };
  const host = context.req.headers.host || '';
  const currentPath = path ? `/${path.join('/')}` : '/';

  try {
    // Fetch store data
    const storeResponse = await fetch(`${process.env.API_GATEWAY_URL}/api/stores/${storeId}`);
    const store = await storeResponse.json();

    if (!store) {
      return {
        notFound: true,
      };
    }

    // Fetch page data if path exists
    let page = null;
    if (path && path.length > 0) {
      const pagePath = `/${path.join('/')}`;
      const pageResponse = await fetch(
        `${process.env.API_GATEWAY_URL}/api/seo/metadata?storeId=${storeId}&path=${encodeURIComponent(pagePath)}`
      );
      
      if (pageResponse.ok) {
        page = await pageResponse.json();
      }
    }

    return {
      props: {
        store,
        page,
        currentPath,
        currentDomain: host,
      },
    };
  } catch (error) {
    console.error('Error fetching store data:', error);
    return {
      notFound: true,
    };
  }
};

