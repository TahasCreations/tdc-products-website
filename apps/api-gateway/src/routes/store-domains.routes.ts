import express from 'express';
import { z } from 'zod';
import { StoreDomainsAdapter } from '@tdc/infra';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const storeDomainsAdapter = new StoreDomainsAdapter(prisma);

// Validation schemas
const CreateStoreSchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(100),
  description: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  theme: z.string().optional(),
  settings: z.record(z.any()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'MAINTENANCE']).default('ACTIVE'),
  isPublished: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional()
});

const UpdateStoreSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  theme: z.string().optional(),
  settings: z.record(z.any()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'MAINTENANCE']).optional(),
  isPublished: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional()
});

const CreateDomainSchema = z.object({
  tenantId: z.string().min(1),
  storeId: z.string().min(1),
  domain: z.string().min(1).max(255),
  isPrimary: z.boolean().default(false),
  vercelProjectId: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

const UpdateDomainSchema = z.object({
  domain: z.string().min(1).max(255).optional(),
  isPrimary: z.boolean().optional(),
  status: z.enum(['PENDING', 'VERIFYING', 'VERIFIED', 'FAILED', 'SUSPENDED', 'EXPIRED']).optional(),
  vercelProjectId: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

// Store Management Routes

// Create store
router.post('/stores', async (req, res) => {
  try {
    const input = CreateStoreSchema.parse(req.body);
    const store = await storeDomainsAdapter.createStore(input);
    res.json(store);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      console.error('Error creating store:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get store by ID
router.get('/stores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.query;
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const store = await storeDomainsAdapter.getStore(id, tenantId);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json(store);
  } catch (error) {
    console.error('Error getting store:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get store by slug
router.get('/stores/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { tenantId } = req.query;
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const store = await storeDomainsAdapter.getStoreBySlug(slug, tenantId);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json(store);
  } catch (error) {
    console.error('Error getting store by slug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get stores
router.get('/stores', async (req, res) => {
  try {
    const { tenantId, status, isPublished, limit, offset } = req.query;
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const filters = {
      ...(status && { status: status as any }),
      ...(isPublished !== undefined && { isPublished: isPublished === 'true' }),
      ...(limit && { limit: parseInt(limit as string) }),
      ...(offset && { offset: parseInt(offset as string) })
    };

    const stores = await storeDomainsAdapter.getStores(tenantId, filters);
    res.json(stores);
  } catch (error) {
    console.error('Error getting stores:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update store
router.put('/stores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.query;
    const input = UpdateStoreSchema.parse(req.body);
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const store = await storeDomainsAdapter.updateStore(id, tenantId, input);
    res.json(store);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      console.error('Error updating store:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Delete store
router.delete('/stores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.query;
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const success = await storeDomainsAdapter.deleteStore(id, tenantId);
    
    if (!success) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting store:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Domain Management Routes

// Create domain
router.post('/domains', async (req, res) => {
  try {
    const input = CreateDomainSchema.parse(req.body);
    const domain = await storeDomainsAdapter.createDomain(input);
    res.json(domain);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      console.error('Error creating domain:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get domain by ID
router.get('/domains/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.query;
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const domain = await storeDomainsAdapter.getDomain(id, tenantId);
    
    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    res.json(domain);
  } catch (error) {
    console.error('Error getting domain:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get domain by domain name
router.get('/domains/by-domain/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const { tenantId } = req.query;
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const storeDomain = await storeDomainsAdapter.getDomainByDomain(domain, tenantId);
    
    if (!storeDomain) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    res.json(storeDomain);
  } catch (error) {
    console.error('Error getting domain by domain name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get domains
router.get('/domains', async (req, res) => {
  try {
    const { tenantId, storeId, status, isPrimary, limit, offset } = req.query;
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const filters = {
      ...(storeId && { storeId: storeId as string }),
      ...(status && { status: status as any }),
      ...(isPrimary !== undefined && { isPrimary: isPrimary === 'true' }),
      ...(limit && { limit: parseInt(limit as string) }),
      ...(offset && { offset: parseInt(offset as string) })
    };

    const domains = await storeDomainsAdapter.getDomains(tenantId, filters);
    res.json(domains);
  } catch (error) {
    console.error('Error getting domains:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update domain
router.put('/domains/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.query;
    const input = UpdateDomainSchema.parse(req.body);
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const domain = await storeDomainsAdapter.updateDomain(id, tenantId, input);
    res.json(domain);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      console.error('Error updating domain:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Delete domain
router.delete('/domains/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.query;
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const success = await storeDomainsAdapter.deleteDomain(id, tenantId);
    
    if (!success) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting domain:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Domain Resolution
router.get('/resolve/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const result = await storeDomainsAdapter.resolveStoreByDomain(domain);
    res.json(result);
  } catch (error) {
    console.error('Error resolving domain:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Domain Verification
router.post('/domains/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.query;
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const result = await storeDomainsAdapter.verifyDomain(id, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Error verifying domain:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check DNS records
router.get('/domains/:domain/dns', async (req, res) => {
  try {
    const { domain } = req.params;
    const result = await storeDomainsAdapter.checkDnsRecords(domain);
    res.json(result);
  } catch (error) {
    console.error('Error checking DNS records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check SSL status
router.get('/domains/:domain/ssl', async (req, res) => {
  try {
    const { domain } = req.params;
    const result = await storeDomainsAdapter.checkSslStatus(domain);
    res.json(result);
  } catch (error) {
    console.error('Error checking SSL status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Vercel Integration
router.post('/domains/:id/vercel', async (req, res) => {
  try {
    const { id } = req.params;
    const { projectId } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    const domain = await storeDomainsAdapter.getDomain(id, req.query.tenantId as string);
    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    const result = await storeDomainsAdapter.addDomainToVercel(domain.domain, projectId);
    res.json(result);
  } catch (error) {
    console.error('Error adding domain to Vercel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/domains/:id/vercel', async (req, res) => {
  try {
    const { id } = req.params;
    const { vercelDomainId } = req.body;
    
    if (!vercelDomainId) {
      return res.status(400).json({ error: 'vercelDomainId is required' });
    }

    const result = await storeDomainsAdapter.removeDomainFromVercel(vercelDomainId);
    res.json(result);
  } catch (error) {
    console.error('Error removing domain from Vercel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health Check
router.get('/domains/:domain/health', async (req, res) => {
  try {
    const { domain } = req.params;
    const result = await storeDomainsAdapter.checkDomainHealth(domain);
    res.json(result);
  } catch (error) {
    console.error('Error checking domain health:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Analytics
router.get('/analytics/domains', async (req, res) => {
  try {
    const { tenantId } = req.query;
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const stats = await storeDomainsAdapter.getDomainStats(tenantId);
    res.json(stats);
  } catch (error) {
    console.error('Error getting domain stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/analytics/stores', async (req, res) => {
  try {
    const { tenantId } = req.query;
    
    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ error: 'tenantId is required' });
    }

    const stats = await storeDomainsAdapter.getStoreStats(tenantId);
    res.json(stats);
  } catch (error) {
    console.error('Error getting store stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

