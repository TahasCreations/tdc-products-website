import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { 
  generalRateLimiter, 
  strictRateLimiter, 
  authRateLimiter, 
  uploadRateLimiter, 
  searchRateLimiter,
  wafMiddleware 
} from '@tdc/infra';

// Import routes
import checkoutRouter from './routes/checkout.js';
import uploadRouter from './routes/upload.js';
import searchRouter from './routes/search.js';
import orderRouter from './routes/orders.js';
import reportRouter from './routes/reports.js';
import syncRouter from './routes/sync.js';
import commissionRouter from './routes/commission.js';
import settlementRouter from './routes/settlement.js';
import invoiceRouter from './routes/invoice.js';
import riskRouter from './routes/risk.js';
import shippingRouter from './routes/shipping.js';
import promotionRouter from './routes/promotion.js';
import adCampaignRouter from './routes/ad-campaign.js';
import crmRouter from './routes/crm.js';
import loyaltyRouter from './routes/loyalty.js';
import insightsRouter from './routes/insights.js';
import subscriptionRouter from './routes/subscription.js';
import searchEnhancedRouter from './routes/search-enhanced.js';
import recommendationRouter from './routes/recommendation.js';
import moderationRouter from './routes/moderation.js';
import rbacRouter from './routes/rbac.js';
import sellerRbacRouter from './routes/seller-rbac.js';
import webhookRouter from './routes/webhook.js';
import storeDomainsRouter from './routes/store-domains.js';
import { specs, swaggerUi } from './swagger/index.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());

// WAF middleware
app.use(wafMiddleware);

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Compression
app.use(compression());

// General rate limiting
app.use(generalRateLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
  });
});

// API routes with specific rate limiting
app.use('/api/checkout', strictRateLimiter, checkoutRouter);
app.use('/api/upload', uploadRateLimiter, uploadRouter);
app.use('/api/search', searchRateLimiter, searchRouter);
app.use('/api/orders', strictRateLimiter, orderRouter);
app.use('/api/reports', strictRateLimiter, reportRouter);
app.use('/api/sync', strictRateLimiter, syncRouter);
app.use('/api/commission', generalRateLimiter, commissionRouter);
app.use('/api/settlement', generalRateLimiter, settlementRouter);
app.use('/api/invoice', generalRateLimiter, invoiceRouter);
app.use('/api/risk', generalRateLimiter, riskRouter);
app.use('/api/shipping', generalRateLimiter, shippingRouter);
app.use('/api/promotion', generalRateLimiter, promotionRouter);
app.use('/api/ad-campaign', generalRateLimiter, adCampaignRouter);
app.use('/api/crm', generalRateLimiter, crmRouter);
app.use('/api/loyalty', generalRateLimiter, loyaltyRouter);
app.use('/api/insights', generalRateLimiter, insightsRouter);
app.use('/api/subscriptions', generalRateLimiter, subscriptionRouter);
app.use('/api/search', generalRateLimiter, searchEnhancedRouter);
app.use('/api/recommendations', generalRateLimiter, recommendationRouter);
app.use('/api/moderation', generalRateLimiter, moderationRouter);
app.use('/api/rbac', generalRateLimiter, rbacRouter);
app.use('/api/seller-rbac', generalRateLimiter, sellerRbacRouter);
app.use('/api/webhooks', generalRateLimiter, webhookRouter);
app.use('/api/store-domains', generalRateLimiter, storeDomainsRouter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'TDC Products API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true
  }
}));

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Checkout API: http://localhost:${PORT}/api/checkout`);
  console.log(`📁 Upload API: http://localhost:${PORT}/api/upload`);
  console.log(`🔍 Search API: http://localhost:${PORT}/api/search`);
  console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
  console.log(`📊 Reports API: http://localhost:${PORT}/api/reports`);
  console.log(`🔄 Sync API: http://localhost:${PORT}/api/sync`);
  console.log(`💰 Commission API: http://localhost:${PORT}/api/commission`);
  console.log(`💸 Settlement API: http://localhost:${PORT}/api/settlement`);
  console.log(`🧾 Invoice API: http://localhost:${PORT}/api/invoice`);
  console.log(`⚠️ Risk API: http://localhost:${PORT}/api/risk`);
  console.log(`📦 Shipping API: http://localhost:${PORT}/api/shipping`);
  console.log(`🎯 Promotion API: http://localhost:${PORT}/api/promotion`);
  console.log(`📢 Ad Campaign API: http://localhost:${PORT}/api/ad-campaign`);
  console.log(`👥 CRM API: http://localhost:${PORT}/api/crm`);
  console.log(`🎯 Loyalty API: http://localhost:${PORT}/api/loyalty`);
  console.log(`📊 Insights API: http://localhost:${PORT}/api/insights`);
  console.log(`💳 Subscriptions API: http://localhost:${PORT}/api/subscriptions`);
  console.log(`🔍 Enhanced Search API: http://localhost:${PORT}/api/search`);
  console.log(`🎯 Recommendations API: http://localhost:${PORT}/api/recommendations`);
console.log(`🛡️ Moderation API: http://localhost:${PORT}/api/moderation`);
console.log(`🔐 RBAC API: http://localhost:${PORT}/api/rbac`);
console.log(`👥 Seller RBAC API: http://localhost:${PORT}/api/seller-rbac`);
console.log(`🔗 Webhooks API: http://localhost:${PORT}/api/webhooks`);
console.log(`🏪 Store Domains API: http://localhost:${PORT}/api/store-domains`);
console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

export default app;
