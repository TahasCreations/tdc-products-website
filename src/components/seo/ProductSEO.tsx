'use client';

import React from 'react';
import { SEOMeta, StructuredData } from './StructuredData';

interface ProductSEOProps {
  product: {
    id: string;
    name: string;
    description: string;
    slug: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: string;
    brand: string;
    sku: string;
    stock: number;
    rating?: {
      average: number;
      count: number;
    };
    shippingDetails?: {
      handlingTime: string;
      transitTime: string;
      deliveryTime: string;
      shippingRate: number;
    };
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function ProductSEO({ product, breadcrumbs = [] }: ProductSEOProps) {
  // Generate canonical URL
  const canonicalUrl = `https://tdcmarket.com/urun/${product.slug}`;
  
  // Generate Open Graph image
  const ogImage = product.images[0] || `https://tdcmarket.com/api/og?title=${encodeURIComponent(product.name)}&type=product`;
  
  // Generate product schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    url: canonicalUrl,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    sku: product.sku,
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'TRY',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'TDC Market'
      },
      ...(product.originalPrice && {
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }),
      ...(product.shippingDetails && {
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: product.shippingDetails.shippingRate,
            currency: 'TRY'
          },
          ...(product.shippingDetails.handlingTime && {
            handlingTime: {
              '@type': 'QuantitativeValue',
              value: product.shippingDetails.handlingTime,
              unitCode: 'DAY'
            }
          }),
          ...(product.shippingDetails.transitTime && {
            transitTime: {
              '@type': 'QuantitativeValue',
              value: product.shippingDetails.transitTime,
              unitCode: 'DAY'
            }
          }),
          ...(product.shippingDetails.deliveryTime && {
            deliveryTime: {
              '@type': 'QuantitativeValue',
              value: product.shippingDetails.deliveryTime,
              unitCode: 'DAY'
            }
          })
        }
      })
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.average,
        reviewCount: product.rating.count,
        bestRating: 5,
        worstRating: 1
      }
    })
  };

  // Generate breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://tdcmarket.com' },
      { '@type': 'ListItem', position: 2, name: 'Kategoriler', item: 'https://tdcmarket.com/kategoriler' },
      { '@type': 'ListItem', position: 3, name: product.category, item: `https://tdcmarket.com/k/${product.category.toLowerCase().replace(/\s+/g, '-')}` },
      ...breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 4,
        name: breadcrumb.name,
        item: breadcrumb.url
      })),
      { '@type': 'ListItem', position: breadcrumbs.length + 4, name: product.name, item: canonicalUrl }
    ]
  };

  return (
    <>
      <SEOMeta
        title={`${product.name} - TDC Market`}
        description={product.description}
        keywords={`${product.name}, ${product.brand}, ${product.category}, TDC Market`}
        image={ogImage}
        url={canonicalUrl}
        type="product"
      />
      
      <StructuredData type="combined" schemas={[productSchema, breadcrumbSchema]} />
    </>
  );
}
