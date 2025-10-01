// Analytics Events System
export enum AnalyticsEvent {
  // Homepage
  HOME_HERO_CTA = 'home_hero_cta',
  CATEGORY_CLICK = 'category_click',
  PRODUCT_CARD_CLICK = 'product_card_click',
  
  // Search
  SEARCH_SUBMIT = 'search_submit',
  SEARCH_RESULT_CLICK = 'search_result_click',
  
  // E-commerce
  ADD_TO_CART = 'add_to_cart',
  REMOVE_FROM_CART = 'remove_from_cart',
  CHECKOUT_START = 'checkout_start',
  CHECKOUT_COMPLETE = 'checkout_complete',
  ORDER_CREATED = 'order_created',
  ORDER_PAID = 'order_paid',
  
  // Reviews & Q&A
  REVIEW_CREATE = 'review_create',
  QNA_CREATE = 'qna_create',
  QNA_ANSWER = 'qna_answer',
  
  // Blog
  BLOG_WRITE_OPEN = 'blog_write_open',
  BLOG_DRAFT_AUTOSAVE = 'blog_draft_autosave',
  BLOG_SUBMIT = 'blog_submit',
  BLOG_APPROVE = 'blog_approve',
  BLOG_REJECT = 'blog_reject',
  BLOG_LIKE = 'blog_like',
  BLOG_SAVE = 'blog_save',
  BLOG_VIEW = 'blog_view',
  BLOG_COMMENT_CREATE = 'blog_comment_create',
  
  // Following
  TOPIC_FOLLOW = 'topic_follow',
  AUTHOR_FOLLOW = 'author_follow',
  
  // Reports
  REPORT_CREATE = 'report_create',
  
  // Newsletter
  NEWSLETTER_SUBSCRIBE = 'newsletter_subscribe',
  NEWSLETTER_UNSUBSCRIBE = 'newsletter_unsubscribe',
  
  // Seller
  SELLER_ONBOARDING_DONE = 'seller_onboarding_done',
  PAYOUT_PDF_DOWNLOAD = 'payout_pdf_download',
  
  // Ads
  AD_IMPRESSION = 'ad_impression',
  AD_CLICK = 'ad_click',
  
  // AI
  AI_SUGGESTION_VIEW = 'ai_suggestion_view',
  AI_SUGGESTION_APPLY = 'ai_suggestion_apply',
  AI_VAT_ANALYSIS = 'ai_vat_analysis',
  
  // Admin
  ADMIN_LOGIN = 'admin_login',
  ADMIN_ACTION = 'admin_action',
}

export interface EventProperties {
  [key: string]: any;
}

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  properties?: EventProperties;
  userId?: string;
  sessionId?: string;
  timestamp?: Date;
  storeId?: string;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEventData[] = [];

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  track(event: AnalyticsEvent, properties?: EventProperties, userId?: string, storeId?: string): void {
    const eventData: AnalyticsEventData = {
      event,
      properties,
      userId,
      sessionId: this.getSessionId(),
      timestamp: new Date(),
      storeId,
    };

    this.events.push(eventData);
    
    // Send to external analytics services
    this.sendToExternalServices(eventData);
  }

  private getSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('analytics_session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('analytics_session_id', sessionId);
      }
      return sessionId;
    }
    return 'server_session';
  }

  private sendToExternalServices(eventData: AnalyticsEventData): void {
    // Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventData.event, {
        event_category: 'engagement',
        event_label: eventData.properties?.label || '',
        value: eventData.properties?.value || 0,
        custom_parameters: eventData.properties,
      });
    }

    // Send to Mixpanel
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.track(eventData.event, eventData.properties);
    }

    // Send to internal API
    this.sendToInternalAPI(eventData);
  }

  private async sendToInternalAPI(eventData: AnalyticsEventData): Promise<void> {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  getEvents(): AnalyticsEventData[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }
}

// Convenience functions
export const analytics = AnalyticsService.getInstance();

export function trackEvent(
  event: AnalyticsEvent,
  properties?: EventProperties,
  userId?: string,
  storeId?: string
): void {
  analytics.track(event, properties, userId, storeId);
}

// React hook for tracking
export function useAnalytics() {
  return {
    track: trackEvent,
    trackPageView: (page: string, properties?: EventProperties) => {
      trackEvent(AnalyticsEvent.HOME_HERO_CTA, { page, ...properties });
    },
  };
}
