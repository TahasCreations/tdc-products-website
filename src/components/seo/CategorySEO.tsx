'use client';

import React from 'react';
import { SEOMeta, StructuredData, BreadcrumbStructuredData } from './StructuredData';

interface CategorySEOProps {
  title: string;
  description: string;
  keywords?: string;
  slug: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  image?: string;
  products?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    url: string;
  }>;
  totalProducts?: number;
}

export function CategorySEO({
  title,
  description,
  keywords,
  slug,
  breadcrumbs = [],
  image,
  products = [],
  totalProducts = 0
}: CategorySEOProps) {
  // Generate canonical URL
  const canonicalUrl = `https://tdcmarket.com/k/${slug}`;
  
  // Generate Open Graph image
  const ogImage = image || `https://tdcmarket.com/api/og?title=${encodeURIComponent(title)}&type=category`;
  
  // Generate breadcrumbs
  const fullBreadcrumbs = [
    { name: 'Ana Sayfa', url: 'https://tdcmarket.com' },
    { name: 'Kategoriler', url: 'https://tdcmarket.com/kategoriler' },
    ...breadcrumbs
  ];

  // Generate category schema
  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonicalUrl,
    image: ogImage,
    mainEntity: {
      '@type': 'ItemList',
      name: title,
      description,
      numberOfItems: totalProducts,
      itemListElement: products.slice(0, 10).map((product, index) => ({
        '@type': 'Product',
        position: index + 1,
        name: product.name,
        url: product.url,
        image: product.image,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'TRY'
        }
      }))
    }
  };

  return (
    <>
      <SEOMeta
        title={title}
        description={description}
        keywords={keywords}
        image={ogImage}
        url={canonicalUrl}
        type="website"
      />
      
      <StructuredData type="combined" schemas={[
        categorySchema,
        {
          '@type': 'BreadcrumbList',
          itemListElement: fullBreadcrumbs.map((breadcrumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: breadcrumb.name,
            item: breadcrumb.url
          }))
        }
      ]} />
    </>
  );
}