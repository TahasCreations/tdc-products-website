/**
 * Email Port Interface
 * Defines contract for email communication services
 */

export interface EmailMessage {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  content: string;
  htmlContent?: string;
  textContent?: string;
  attachments?: EmailAttachment[];
  headers?: Record<string, string>;
  replyTo?: string;
  from?: string;
  templateId?: string;
  templateVariables?: Record<string, any>;
  trackingId?: string;
  metadata?: any;
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
  disposition?: 'attachment' | 'inline';
  cid?: string; // Content ID for inline attachments
}

export interface EmailResponse {
  messageId: string;
  status: 'sent' | 'queued' | 'failed';
  providerId?: string;
  providerResponse?: any;
  error?: string;
  metadata?: any;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  htmlContent?: string;
  textContent?: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailProvider {
  id: string;
  name: string;
  type: 'SMTP' | 'API' | 'SERVICE';
  config: {
    host?: string;
    port?: number;
    secure?: boolean;
    username?: string;
    password?: string;
    apiKey?: string;
    apiUrl?: string;
    region?: string;
    fromEmail?: string;
    fromName?: string;
  };
  limits: {
    dailyLimit?: number;
    monthlyLimit?: number;
    rateLimit?: number; // messages per minute
  };
  isActive: boolean;
}

export interface EmailPort {
  // Message sending
  sendEmail(message: EmailMessage): Promise<EmailResponse>;
  sendBulkEmails(messages: EmailMessage[]): Promise<EmailResponse[]>;
  
  // Template management
  createTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate>;
  updateTemplate(id: string, template: Partial<EmailTemplate>): Promise<EmailTemplate>;
  getTemplate(id: string): Promise<EmailTemplate | null>;
  getTemplates(): Promise<EmailTemplate[]>;
  deleteTemplate(id: string): Promise<boolean>;
  
  // Provider management
  addProvider(provider: Omit<EmailProvider, 'id'>): Promise<EmailProvider>;
  updateProvider(id: string, provider: Partial<EmailProvider>): Promise<EmailProvider>;
  getProvider(id: string): Promise<EmailProvider | null>;
  getProviders(): Promise<EmailProvider[]>;
  removeProvider(id: string): Promise<boolean>;
  
  // Delivery tracking
  getDeliveryStatus(messageId: string): Promise<{
    status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    bouncedAt?: Date;
    error?: string;
  }>;
  
  // Analytics
  getEmailStats(dateFrom: Date, dateTo: Date): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalOpened: number;
    totalClicked: number;
    totalBounced: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  }>;
  
  // Health check
  healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    message: string;
    details?: any;
  }>;
}

