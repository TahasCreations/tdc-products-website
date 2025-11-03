/**
 * Universal Analytics Tracker
 * Supports: Google Analytics 4, Mixpanel, Custom events
 */

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

export interface UserProperties {
  userId?: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

class AnalyticsTracker {
  private queue: AnalyticsEvent[] = [];
  private isInitialized = false;

  /**
   * Initialize analytics providers
   */
  init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Google Analytics 4
    if (process.env.NEXT_PUBLIC_GA_ID) {
      this.initGA4();
    }

    // Mixpanel
    if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
      this.initMixpanel();
    }

    this.isInitialized = true;
    this.flushQueue();
  }

  /**
   * Initialize Google Analytics 4
   */
  private initGA4() {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    
    // Load gtag.js
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', gaId, {
      send_page_view: false // We'll send manually
    });
  }

  /**
   * Initialize Mixpanel
   */
  private initMixpanel() {
    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
    
    // Load Mixpanel SDK
    const script = document.createElement('script');
    script.innerHTML = `
      (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
      for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;}})(document,window.mixpanel||[]);
      mixpanel.init("${token}", {debug: false, track_pageview: true, persistence: "localStorage"});
    `;
    document.head.appendChild(script);
  }

  /**
   * Track page view
   */
  pageView(url: string, title?: string) {
    this.track('page_view', {
      page_url: url,
      page_title: title || document.title
    });
  }

  /**
   * Track custom event
   */
  track(eventName: string, properties?: Record<string, any>, userId?: string) {
    const event: AnalyticsEvent = {
      event: eventName,
      properties,
      userId,
      timestamp: Date.now()
    };

    if (!this.isInitialized) {
      this.queue.push(event);
      return;
    }

    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track(eventName, properties);
    }

    // Custom backend
    this.sendToBackend(event);
  }

  /**
   * Identify user
   */
  identify(userId: string, properties?: UserProperties) {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('set', 'user_properties', {
        user_id: userId,
        ...properties
      });
    }

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.identify(userId);
      if (properties) {
        window.mixpanel.people.set(properties);
      }
    }
  }

  /**
   * Track e-commerce events
   */
  ecommerce = {
    viewProduct: (product: any) => {
      this.track('view_item', {
        items: [{
          item_id: product.id,
          item_name: product.title,
          price: product.price,
          currency: 'TRY'
        }]
      });
    },

    addToCart: (product: any, quantity: number = 1) => {
      this.track('add_to_cart', {
        items: [{
          item_id: product.id,
          item_name: product.title,
          price: product.price,
          quantity
        }],
        currency: 'TRY',
        value: product.price * quantity
      });
    },

    purchase: (orderId: string, total: number, items: any[]) => {
      this.track('purchase', {
        transaction_id: orderId,
        value: total,
        currency: 'TRY',
        items: items.map(item => ({
          item_id: item.productId,
          item_name: item.title,
          price: item.price,
          quantity: item.quantity
        }))
      });
    }
  };

  /**
   * Send to custom backend
   */
  private sendToBackend(event: AnalyticsEvent) {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(console.error);
  }

  /**
   * Flush queued events
   */
  private flushQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift()!;
      this.track(event.event, event.properties, event.userId);
    }
  }
}

// Singleton instance
export const analytics = new AnalyticsTracker();

// React Hook
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    pageView: analytics.pageView.bind(analytics),
    identify: analytics.identify.bind(analytics),
    ecommerce: analytics.ecommerce
  };
}

// Type declarations for window
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    mixpanel: any;
  }
}

