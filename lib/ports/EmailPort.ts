// Email Port Interface
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text?: string;
  variables?: string[];
}

export interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  variables?: Record<string, any>;
  attachments?: EmailAttachment[];
  storeId?: string;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType: string;
  disposition?: 'attachment' | 'inline';
  cid?: string;
}

export interface EmailResult {
  id: string;
  status: 'sent' | 'failed' | 'pending';
  error?: string;
  messageId?: string;
}

export interface EmailList {
  id: string;
  name: string;
  subscriberCount: number;
  createdAt: Date;
}

export interface Subscriber {
  id: string;
  email: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  tags?: string[];
  customFields?: Record<string, any>;
  subscribedAt?: Date;
  unsubscribedAt?: Date;
}

export interface EmailPort {
  sendEmail(options: EmailOptions): Promise<EmailResult>;
  sendBulkEmail(options: EmailOptions[]): Promise<EmailResult[]>;
  getEmailStatus(messageId: string): Promise<EmailResult>;
  createTemplate(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate>;
  updateTemplate(id: string, template: Partial<EmailTemplate>): Promise<EmailTemplate>;
  deleteTemplate(id: string): Promise<boolean>;
  createList(name: string): Promise<EmailList>;
  addSubscriber(listId: string, subscriber: Omit<Subscriber, 'id'>): Promise<Subscriber>;
  removeSubscriber(listId: string, email: string): Promise<boolean>;
  getSubscribers(listId: string, limit?: number, offset?: number): Promise<Subscriber[]>;
  sendCampaign(listId: string, templateId: string, options?: any): Promise<EmailResult>;
}
