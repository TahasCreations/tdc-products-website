import React from 'react';
import Head from 'next/head';

interface SEOHeadProps {
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
  currentPath?: string;
  currentDomain?: string;
}

export default function SEOHead({
  store,
  page,
  currentPath = '/',
  currentDomain
}: SEOHeadProps) {
  const protocol = currentDomain?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${currentDomain}`;
  const canonicalDomain = store.canonicalDomain || currentDomain;
  const canonicalUrl = page?.canonicalUrl || `${protocol}://${canonicalDomain}${currentPath}`;
  
  const title = page?.title || store.name;
  const description = page?.description || store.description || '';
  const keywords = page?.keywords || [];
  const ogTitle = page?.ogTitle || title;
  const ogDescription = page?.ogDescription || description;
  const ogImage = page?.ogImage || store.logo || `${baseUrl}/og-image.jpg`;
  const ogType = page?.ogType || 'website';
  const twitterCard = page?.twitterCard || 'summary_large_image';
  const twitterTitle = page?.twitterTitle || ogTitle;
  const twitterDescription = page?.twitterDescription || ogDescription;
  const twitterImage = page?.twitterImage || ogImage;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <meta name="author" content={store.name} />
      <meta name="generator" content="TDC Store" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Favicon */}
      {store.favicon && (
        <link rel="icon" href={store.favicon} />
      )}
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={store.name} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={twitterImage} />
      <meta name="twitter:site" content={`@${store.name.replace(/\s+/g, '').toLowerCase()}`} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={store.name} />
      
      {/* Structured Data */}
      {page?.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(page.structuredData)
          }}
        />
      )}
      
      {/* Breadcrumb Structured Data */}
      {page?.breadcrumbs && page.breadcrumbs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": page.breadcrumbs.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": `${protocol}://${canonicalDomain}${item.url}`
              }))
            })
          }}
        />
      )}
      
      {/* Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": store.name,
            "url": `${protocol}://${canonicalDomain}`,
            "logo": store.logo ? `${protocol}://${canonicalDomain}${store.logo}` : undefined,
            "description": store.description
          })
        }}
      />
      
      {/* Analytics Scripts */}
      {store.ga4MeasurementId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${store.ga4MeasurementId}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${store.ga4MeasurementId}', {
                  page_title: '${title}',
                  page_location: '${canonicalUrl}'
                });
              `
            }}
          />
        </>
      )}
      
      {/* Google Tag Manager */}
      {store.googleTagManager && (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${store.googleTagManager}');
              `
            }}
          />
        </>
      )}
      
      {/* Meta Pixel */}
      {store.metaPixelId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${store.metaPixelId}');
              fbq('track', 'PageView');
            `
          }}
        />
      )}
      
      {/* Hotjar */}
      {store.hotjarId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${store.hotjarId},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `
          }}
        />
      )}
      
      {/* Mixpanel */}
      {store.mixpanelToken && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"state")&&(j=JSON.parse(decodeURIComponent(d(f,"state"))),"mpeditor"===j.action&&(b.sessionStorage.setItem("_mpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.mixpanel=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};h="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(l=0;l<h.length;l++)c(e,h[l]);var f="init identify track track_pageview register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(l=0;l<f.length;l++)c(e,f[l]);a._i.push([b,d,g])};a.__SV=1.2;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===c.location.protocol&&"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js";d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}})(document,window.mixpanel||[]);
              mixpanel.init('${store.mixpanelToken}');
              mixpanel.track('Page View', {
                page: '${currentPath}',
                store: '${store.name}'
              });
            `
          }}
        />
      )}
    </Head>
  );
}

