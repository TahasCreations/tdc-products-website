/**
 * Enhanced Search API Routes with Embedding and Reranking
 * Advanced search functionality with A/B testing
 */

import { Router } from 'express';
import { z } from 'zod';
import { SearchWithEmbeddingService } from '@tdc/domain';
import { MeiliSearchWithEmbeddingAdapter, EmbeddingService, RerankingService, ABTestService } from '@tdc/infra';

const router = Router();

// Initialize services
const embeddingService = new EmbeddingService();
const rerankingService = new RerankingService();
const abTestService = new ABTestService();
const searchAdapter = new MeiliSearchWithEmbeddingAdapter(
  process.env.MEILISEARCH_URL || 'http://localhost:7700',
  process.env.MEILISEARCH_KEY || 'masterKey',
  embeddingService,
  rerankingService,
  abTestService
);
const searchService = new SearchWithEmbeddingService(searchAdapter);

// ===========================================
// VALIDATION SCHEMAS
// ===========================================

const SearchProductsSchema = z.object({
  query: z.string().min(1),
  tenantId: z.string(),
  sellerId: z.string().optional(),
  categoryId: z.string().optional(),
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
  useEmbedding: z.boolean().optional().default(false),
  useReranking: z.boolean().optional().default(false),
  hybridSearch: z.boolean().optional().default(false),
  limit: z.number().min(1).max(100).optional().default(20),
  offset: z.number().min(0).optional().default(0),
});

const ABTestSchema = z.object({
  query: z.string().min(1),
  tenantId: z.string(),
  sellerId: z.string().optional(),
  testName: z.string().optional(),
});

const IndexProductSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  sellerId: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  brand: z.string(),
  price: z.number().min(0),
  tags: z.array(z.string()),
  images: z.array(z.string()),
  specifications: z.record(z.any()),
});

const BulkIndexProductsSchema = z.object({
  products: z.array(IndexProductSchema),
});

const UpdateEmbeddingSchema = z.object({
  productId: z.string(),
  tenantId: z.string(),
  product: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    brand: z.string(),
    tags: z.array(z.string()),
    specifications: z.record(z.any()),
  }),
});

const RerankProductsSchema = z.object({
  query: z.string().min(1),
  products: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    brand: z.string(),
    price: z.number(),
    tags: z.array(z.string()),
    metadata: z.record(z.any()).optional(),
  })),
});

// ===========================================
// SEARCH ENDPOINTS
// ===========================================

/**
 * POST /api/search/products
 * Search products with enhanced features
 */
router.post('/products', async (req, res) => {
  try {
    const input = SearchProductsSchema.parse(req.body);
    
    const results = await searchService.searchProducts(input.query, {
      tenantId: input.tenantId,
      sellerId: input.sellerId,
      categoryId: input.categoryId,
      priceRange: input.priceRange,
      useEmbedding: input.useEmbedding,
      useReranking: input.useReranking,
      hybridSearch: input.hybridSearch,
      limit: input.limit,
      offset: input.offset,
    });

    res.json({
      success: true,
      data: results,
      metadata: {
        searchMethod: results.searchMethod,
        embeddingUsed: results.embeddingUsed,
        rerankingUsed: results.rerankingUsed,
        responseTime: results.took,
      },
    });
  } catch (error: any) {
    console.error('Error searching products:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/search/ab-test
 * Run A/B test for search methods
 */
router.post('/ab-test', async (req, res) => {
  try {
    const input = ABTestSchema.parse(req.body);
    
    const results = await searchService.searchWithABTest(input.query, {
      tenantId: input.tenantId,
      sellerId: input.sellerId,
      testName: input.testName,
    });

    res.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    console.error('Error running A/B test:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/search/hybrid
 * Hybrid search combining text and vector search
 */
router.post('/hybrid', async (req, res) => {
  try {
    const input = SearchProductsSchema.parse(req.body);
    
    const results = await searchService.searchProducts(input.query, {
      ...input,
      hybridSearch: true,
      useEmbedding: true,
      useReranking: true,
    });

    res.json({
      success: true,
      data: results,
      metadata: {
        searchMethod: 'hybrid',
        embeddingUsed: true,
        rerankingUsed: true,
        responseTime: results.took,
      },
    });
  } catch (error: any) {
    console.error('Error in hybrid search:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// INDEXING ENDPOINTS
// ===========================================

/**
 * POST /api/search/index/product
 * Index a single product with embedding
 */
router.post('/index/product', async (req, res) => {
  try {
    const input = IndexProductSchema.parse(req.body);
    
    const result = await searchService.indexProduct(input);

    res.json({
      success: result.success,
      message: result.message,
    });
  } catch (error: any) {
    console.error('Error indexing product:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/search/index/products
 * Bulk index products with embeddings
 */
router.post('/index/products', async (req, res) => {
  try {
    const input = BulkIndexProductsSchema.parse(req.body);
    
    const result = await searchService.bulkIndexProducts(input.products);

    res.json({
      success: result.success,
      message: result.message,
      indexed: result.indexed,
    });
  } catch (error: any) {
    console.error('Error bulk indexing products:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/search/embedding/update
 * Update product embedding
 */
router.put('/embedding/update', async (req, res) => {
  try {
    const input = UpdateEmbeddingSchema.parse(req.body);
    
    const result = await searchService.updateProductEmbedding(
      input.productId,
      input.tenantId,
      input.product
    );

    res.json({
      success: result.success,
      message: result.message,
    });
  } catch (error: any) {
    console.error('Error updating embedding:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// RERANKING ENDPOINTS
// ===========================================

/**
 * POST /api/search/rerank
 * Rerank product results
 */
router.post('/rerank', async (req, res) => {
  try {
    const input = RerankProductsSchema.parse(req.body);
    
    const results = await searchService.rerankProductResults(
      input.query,
      input.products
    );

    res.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    console.error('Error reranking products:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// ANALYTICS ENDPOINTS
// ===========================================

/**
 * GET /api/search/analytics
 * Get search analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    const { tenantId, start, end } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const dateRange = {
      start: start ? new Date(start as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: end ? new Date(end as string) : new Date(),
    };

    const analytics = await searchService.getSearchAnalytics(
      tenantId as string,
      dateRange
    );

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    console.error('Error fetching search analytics:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/search/ab-test-results
 * Get A/B test results
 */
router.get('/ab-test-results', async (req, res) => {
  try {
    const { tenantId, testName } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const results = await searchService.getABTestResults(
      tenantId as string,
      testName as string
    );

    res.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    console.error('Error fetching A/B test results:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// HEALTH CHECK
// ===========================================

/**
 * GET /api/search/health
 * Health check for search services
 */
router.get('/health', async (req, res) => {
  try {
    const health = await searchService.healthCheck();
    
    res.status(health.overall ? 200 : 503).json({
      success: health.overall,
      data: health,
    });
  } catch (error: any) {
    res.status(503).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// COMPARISON ENDPOINTS
// ===========================================

/**
 * POST /api/search/compare
 * Compare different search methods
 */
router.post('/compare', async (req, res) => {
  try {
    const { query, tenantId, sellerId } = req.body;
    
    if (!query || !tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Query and tenant ID are required',
      });
    }

    // Run all three search methods
    const [textResults, vectorResults, hybridResults] = await Promise.all([
      searchService.searchProducts(query, {
        tenantId,
        sellerId,
        useEmbedding: false,
        useReranking: false,
        limit: 10,
      }),
      searchService.searchProducts(query, {
        tenantId,
        sellerId,
        useEmbedding: true,
        useReranking: false,
        limit: 10,
      }),
      searchService.searchProducts(query, {
        tenantId,
        sellerId,
        useEmbedding: true,
        useReranking: true,
        hybridSearch: true,
        limit: 10,
      }),
    ]);

    res.json({
      success: true,
      data: {
        query,
        comparison: {
          text: {
            results: textResults,
            method: 'text',
            responseTime: textResults.took,
            hitCount: textResults.hits.length,
          },
          vector: {
            results: vectorResults,
            method: 'vector',
            responseTime: vectorResults.took,
            hitCount: vectorResults.hits.length,
          },
          hybrid: {
            results: hybridResults,
            method: 'hybrid',
            responseTime: hybridResults.took,
            hitCount: hybridResults.hits.length,
          },
        },
        summary: {
          fastest: textResults.took < vectorResults.took && textResults.took < hybridResults.took ? 'text' :
                  vectorResults.took < hybridResults.took ? 'vector' : 'hybrid',
          mostRelevant: hybridResults.hits.length > vectorResults.hits.length && hybridResults.hits.length > textResults.hits.length ? 'hybrid' :
                       vectorResults.hits.length > textResults.hits.length ? 'vector' : 'text',
        },
      },
    });
  } catch (error: any) {
    console.error('Error comparing search methods:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

