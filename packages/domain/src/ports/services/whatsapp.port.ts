/**
 * WhatsApp Port Interface
 * Defines contract for WhatsApp communication services
 */

export interface WhatsAppMessage {
  to: string; // Phone number with country code
  messageType: 'text' | 'template' | 'media' | 'interactive' | 'location' | 'contact';
  content: WhatsAppContent;
  templateId?: string;
  templateVariables?: Record<string, any>;
  trackingId?: string;
  metadata?: any;
}

export interface WhatsAppContent {
  // Text message
  text?: string;
  
  // Media message
  media?: {
    type: 'image' | 'video' | 'audio' | 'document';
    url?: string;
    caption?: string;
    filename?: string;
  };
  
  // Interactive message
  interactive?: {
    type: 'button' | 'list' | 'product' | 'product_list';
    header?: {
      type: 'text' | 'image' | 'video' | 'document';
      text?: string;
      media?: { url: string };
    };
    body: {
      text: string;
    };
    footer?: {
      text: string;
    };
    action: {
      buttons?: Array<{
        type: 'reply';
        reply: {
          id: string;
          title: string;
        };
      }>;
      sections?: Array<{
        title: string;
        rows: Array<{
          id: string;
          title: string;
          description?: string;
        }>;
      }>;
    };
  };
  
  // Location message
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
  
  // Contact message
  contact?: {
    name: {
      formatted_name: string;
      first_name?: string;
      last_name?: string;
    };
    phones?: Array<{
      phone: string;
      type?: 'HOME' | 'WORK' | 'OTHER';
    }>;
    emails?: Array<{
      email: string;
      type?: 'HOME' | 'WORK' | 'OTHER';
    }>;
  };
}

export interface WhatsAppResponse {
  messageId: string;
  status: 'sent' | 'queued' | 'failed' | 'delivered' | 'read';
  providerId?: string;
  providerResponse?: any;
  error?: string;
  metadata?: any;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
  language: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISABLED';
  components: WhatsAppTemplateComponent[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsAppTemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  example?: {
    header_text?: string[];
    body_text?: string[][];
    footer_text?: string[];
  };
  buttons?: Array<{
    type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
    text: string;
    url?: string;
    phone_number?: string;
  }>;
}

export interface WhatsAppProvider {
  id: string;
  name: string;
  type: 'WHATSAPP_BUSINESS_API' | 'WHATSAPP_CLOUD_API' | 'THIRD_PARTY';
  config: {
    accessToken?: string;
    phoneNumberId?: string;
    businessAccountId?: string;
    webhookUrl?: string;
    webhookSecret?: string;
    apiUrl?: string;
    apiVersion?: string;
  };
  limits: {
    dailyLimit?: number;
    monthlyLimit?: number;
    rateLimit?: number; // messages per minute
    templateLimit?: number;
  };
  isActive: boolean;
}

export interface WhatsAppWebhookEvent {
  id: string;
  type: 'message' | 'status' | 'template' | 'account';
  timestamp: Date;
  data: any;
  metadata?: any;
}

export interface WhatsAppPort {
  // Message sending
  sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse>;
  sendBulkMessages(messages: WhatsAppMessage[]): Promise<WhatsAppResponse[]>;
  
  // Template management
  createTemplate(template: Omit<WhatsAppTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<WhatsAppTemplate>;
  updateTemplate(id: string, template: Partial<WhatsAppTemplate>): Promise<WhatsAppTemplate>;
  getTemplate(id: string): Promise<WhatsAppTemplate | null>;
  getTemplates(): Promise<WhatsAppTemplate[]>;
  deleteTemplate(id: string): Promise<boolean>;
  submitTemplateForApproval(templateId: string): Promise<{ status: string; message: string }>;
  
  // Provider management
  addProvider(provider: Omit<WhatsAppProvider, 'id'>): Promise<WhatsAppProvider>;
  updateProvider(id: string, provider: Partial<WhatsAppProvider>): Promise<WhatsAppProvider>;
  getProvider(id: string): Promise<WhatsAppProvider | null>;
  getProviders(): Promise<WhatsAppProvider[]>;
  removeProvider(id: string): Promise<boolean>;
  
  // Webhook management
  setupWebhook(webhookUrl: string, events: string[]): Promise<{ success: boolean; message: string }>;
  verifyWebhook(verifyToken: string, challenge: string): Promise<boolean>;
  processWebhookEvent(event: WhatsAppWebhookEvent): Promise<void>;
  
  // Delivery tracking
  getDeliveryStatus(messageId: string): Promise<{
    status: 'sent' | 'delivered' | 'read' | 'failed';
    deliveredAt?: Date;
    readAt?: Date;
    error?: string;
  }>;
  
  // Analytics
  getWhatsAppStats(dateFrom: Date, dateTo: Date): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalRead: number;
    totalFailed: number;
    deliveryRate: number;
    readRate: number;
    failureRate: number;
  }>;
  
  // Media management
  uploadMedia(file: Buffer, filename: string, contentType: string): Promise<{ mediaId: string; url: string }>;
  getMedia(mediaId: string): Promise<{ url: string; contentType: string; filename: string }>;
  deleteMedia(mediaId: string): Promise<boolean>;
  
  // Health check
  healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    message: string;
    details?: any;
  }>;
}

