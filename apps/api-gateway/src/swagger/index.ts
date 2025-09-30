import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { webhookSchemas, webhookPaths, webhookParameters } from './webhook.schema.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TDC Products API',
      version: '1.0.0',
      description: 'Comprehensive e-commerce platform API with webhook support, RBAC, moderation, and more.',
      contact: {
        name: 'TDC Products Team',
        email: 'api@tdcproducts.com',
        url: 'https://tdcproducts.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Development server'
      },
      {
        url: 'https://api.tdcproducts.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        ...webhookSchemas
      },
      parameters: {
        ...webhookParameters
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        },
        ApiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for authentication'
        },
        WebhookSignature: {
          type: 'apiKey',
          in: 'header',
          name: 'X-Webhook-Signature',
          description: 'HMAC signature for webhook verification'
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Webhook Subscriptions',
        description: 'Manage webhook subscriptions for receiving events'
      },
      {
        name: 'Webhook Events',
        description: 'Create and manage webhook events'
      },
      {
        name: 'Webhook Deliveries',
        description: 'Monitor and manage webhook deliveries'
      },
      {
        name: 'Webhook Statistics',
        description: 'View webhook statistics and metrics'
      },
      {
        name: 'Webhook Health',
        description: 'Check webhook system health'
      },
      {
        name: 'Webhook Security',
        description: 'HMAC signature generation and verification'
      },
      {
        name: 'Webhook Processing',
        description: 'Process webhook events and deliveries'
      },
      {
        name: 'Products',
        description: 'Product management operations'
      },
      {
        name: 'Orders',
        description: 'Order management operations'
      },
      {
        name: 'Customers',
        description: 'Customer management operations'
      },
      {
        name: 'Sellers',
        description: 'Seller management operations'
      },
      {
        name: 'Settlement',
        description: 'Settlement and payout operations'
      },
      {
        name: 'Invoices',
        description: 'Invoice management operations'
      },
      {
        name: 'Risk Management',
        description: 'Risk assessment and management'
      },
      {
        name: 'Shipping',
        description: 'Shipping and logistics operations'
      },
      {
        name: 'Promotions',
        description: 'Promotion and coupon management'
      },
      {
        name: 'Ad Campaigns',
        description: 'Advertising campaign management'
      },
      {
        name: 'CRM',
        description: 'Customer relationship management'
      },
      {
        name: 'Loyalty',
        description: 'Loyalty points and rewards'
      },
      {
        name: 'Insights',
        description: 'Analytics and insights'
      },
      {
        name: 'Subscriptions',
        description: 'Subscription management'
      },
      {
        name: 'Search',
        description: 'Search and discovery'
      },
      {
        name: 'Recommendations',
        description: 'Product recommendations'
      },
      {
        name: 'Moderation',
        description: 'Content moderation'
      },
      {
        name: 'RBAC',
        description: 'Role-based access control'
      }
    ],
    paths: {
      ...webhookPaths
    }
  },
  apis: [
    './src/routes/*.ts',
    './src/swagger/*.ts'
  ]
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };

