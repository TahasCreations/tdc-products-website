import Head from 'next/head';

interface CategorySEOProps {
  title: string;
  description: string;
  keywords: string[];
  category: string;
  image?: string;
  canonicalUrl?: string;
}

export default function CategorySEO({
  title,
  description,
  keywords,
  category,
  image = 'https://via.placeholder.com/1200x630/4F46E5/FFFFFF?text=Category',
  canonicalUrl
}: CategorySEOProps) {
  const fullTitle = `${title} | TDC Products`;
  const keywordsString = keywords.join(', ');
  const canonical = canonicalUrl || `https://tdc-products.com/categories/${category}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="TDC Products" />
      <meta property="og:locale" content="tr_TR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@tdcproducts" />
      <meta name="twitter:creator" content="@tdcproducts" />

      {/* Additional SEO */}
      <meta name="author" content="TDC Products" />
      <meta name="publisher" content="TDC Products" />
      <meta name="copyright" content="TDC Products" />
      <meta name="language" content="Turkish" />
      <meta name="revisit-after" content="7 days" />

      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Theme */}
      <meta name="theme-color" content="#4F46E5" />
      <meta name="msapplication-TileColor" content="#4F46E5" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": title,
            "description": description,
            "url": canonical,
            "image": image,
            "mainEntity": {
              "@type": "ItemList",
              "name": `${title} Ürünleri`,
              "description": description
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Ana Sayfa",
                  "item": "https://tdc-products.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Kategoriler",
                  "item": "https://tdc-products.com/categories"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": title,
                  "item": canonical
                }
              ]
            }
          })
        }}
      />
    </Head>
  );
}
