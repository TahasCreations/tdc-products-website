// Analytics and tracking utilities
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface UserProperties {
  user_id?: string;
  user_role?: string;
  subscription_status?: string;
  signup_date?: string;
  last_login?: string;
}

// Event tracking
export const trackEvent = (event: AnalyticsEvent) => {
  if (typeof window !== 'undefined') {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters,
      });
    }

    // Custom analytics
    console.log('Analytics Event:', event);
    
    // Send to custom analytics endpoint
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }).catch(console.error);
  }
};

// Page view tracking
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined') {
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        page_title: title,
        page_location: url,
      });
    }

    trackEvent({
      action: 'page_view',
      category: 'engagement',
      label: url,
    });
  }
};

// E-commerce tracking
export const trackPurchase = (transactionId: string, value: number, currency: string = 'TRY', items: any[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    });
  }

  trackEvent({
    action: 'purchase',
    category: 'ecommerce',
    label: transactionId,
    value: value,
    custom_parameters: {
      currency,
      items_count: items.length,
    },
  });
};

// Blog tracking
export const trackBlogEvent = (action: string, postId: string, postTitle: string, authorId?: string) => {
  trackEvent({
    action,
    category: 'blog',
    label: postTitle,
    custom_parameters: {
      post_id: postId,
      author_id: authorId,
    },
  });
};

// User engagement tracking
export const trackUserEngagement = (action: string, details?: Record<string, any>) => {
  trackEvent({
    action,
    category: 'user_engagement',
    custom_parameters: details,
  });
};

// Conversion tracking
export const trackConversion = (conversionType: string, value?: number, currency: string = 'TRY') => {
  trackEvent({
    action: 'conversion',
    category: 'conversion',
    label: conversionType,
    value,
    custom_parameters: {
      currency,
    },
  });
};

// Error tracking
export const trackError = (error: Error, context?: string) => {
  trackEvent({
    action: 'error',
    category: 'error',
    label: context || 'unknown',
    custom_parameters: {
      error_message: error.message,
      error_stack: error.stack,
    },
  });
};

// Performance tracking
export const trackPerformance = (metric: string, value: number, unit: string = 'ms') => {
  trackEvent({
    action: 'performance',
    category: 'performance',
    label: metric,
    value,
    custom_parameters: {
      unit,
    },
  });
};

// A/B testing
export const trackABTest = (testName: string, variant: string, action: string) => {
  trackEvent({
    action: 'ab_test',
    category: 'experimentation',
    label: testName,
    custom_parameters: {
      variant,
      test_action: action,
    },
  });
};

// Custom dimensions
export const setUserProperties = (properties: UserProperties) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      custom_map: {
        user_id: properties.user_id,
        user_role: properties.user_role,
        subscription_status: properties.subscription_status,
        signup_date: properties.signup_date,
        last_login: properties.last_login,
      },
    });
  }
};

// E-commerce specific events
export const ecommerceEvents = {
  viewItem: (itemId: string, itemName: string, category: string, price: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'TRY',
        value: price,
        items: [{
          item_id: itemId,
          item_name: itemName,
          category: category,
          price: price,
        }],
      });
    }
  },

  addToCart: (itemId: string, itemName: string, category: string, price: number, quantity: number = 1) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'TRY',
        value: price * quantity,
        items: [{
          item_id: itemId,
          item_name: itemName,
          category: category,
          price: price,
          quantity: quantity,
        }],
      });
    }
  },

  removeFromCart: (itemId: string, itemName: string, category: string, price: number, quantity: number = 1) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'remove_from_cart', {
        currency: 'TRY',
        value: price * quantity,
        items: [{
          item_id: itemId,
          item_name: itemName,
          category: category,
          price: price,
          quantity: quantity,
        }],
      });
    }
  },

  beginCheckout: (value: number, items: any[]) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'TRY',
        value: value,
        items: items,
      });
    }
  },
};

// Blog specific events
export const blogEvents = {
  writeOpen: () => trackBlogEvent('blog_write_open', '', ''),
  draftSave: (postId: string) => trackBlogEvent('blog_draft_save', postId, ''),
  submit: (postId: string, postTitle: string) => trackBlogEvent('blog_submit', postId, postTitle),
  approve: (postId: string, postTitle: string) => trackBlogEvent('blog_approve', postId, postTitle),
  reject: (postId: string, postTitle: string) => trackBlogEvent('blog_reject', postId, postTitle),
  like: (postId: string, postTitle: string) => trackBlogEvent('blog_like', postId, postTitle),
  save: (postId: string, postTitle: string) => trackBlogEvent('blog_save', postId, postTitle),
  view: (postId: string, postTitle: string) => trackBlogEvent('blog_view', postId, postTitle),
  comment: (postId: string, postTitle: string) => trackBlogEvent('blog_comment_create', postId, postTitle),
  followTopic: (topicId: string) => trackEvent({ action: 'topic_follow', category: 'blog', label: topicId }),
  followAuthor: (authorId: string) => trackEvent({ action: 'author_follow', category: 'blog', label: authorId }),
  report: (entityType: string, entityId: string) => trackEvent({ action: 'report_create', category: 'moderation', label: entityType }),
  newsletterSubscribe: () => trackEvent({ action: 'newsletter_subscribe', category: 'marketing' }),
};

// Admin specific events
export const adminEvents = {
  login: () => trackEvent({ action: 'admin_login', category: 'admin' }),
  logout: () => trackEvent({ action: 'admin_logout', category: 'admin' }),
  moduleAccess: (moduleName: string) => trackEvent({ action: 'module_access', category: 'admin', label: moduleName }),
  dataExport: (dataType: string) => trackEvent({ action: 'data_export', category: 'admin', label: dataType }),
  settingsUpdate: (settingName: string) => trackEvent({ action: 'settings_update', category: 'admin', label: settingName }),
};

// Initialize analytics
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    // Track page load performance
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      trackPerformance('page_load_time', loadTime);
    });

    // Track user engagement
    let engagementTime = 0;
    const startTime = Date.now();

    const trackEngagement = () => {
      engagementTime = Date.now() - startTime;
      trackUserEngagement('time_on_page', { duration: engagementTime });
    };

    // Track engagement on page unload
    window.addEventListener('beforeunload', trackEngagement);

    // Track engagement every 30 seconds
    const engagementInterval = setInterval(() => {
      trackUserEngagement('active_engagement', { duration: Date.now() - startTime });
    }, 30000);

    // Cleanup
    return () => {
      clearInterval(engagementInterval);
      window.removeEventListener('beforeunload', trackEngagement);
    };
  }
};

// Type declarations for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
