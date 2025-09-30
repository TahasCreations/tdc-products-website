import { Router, Request, Response } from 'express';
import { container } from '@tdc/infra';
import { SearchDocument, SearchQuery } from '@tdc/domain';
import { z } from 'zod';

const router = Router();

// Validation schemas
const SearchRequestSchema = z.object({
  index: z.string().min(1),
  query: z.string().min(1),
  filters: z.record(z.any()).optional(),
  sort: z.array(z.object({
    field: z.string(),
    direction: z.enum(['asc', 'desc']),
  })).optional(),
  limit: z.number().positive().max(100).default(20),
  offset: z.number().nonnegative().default(0),
  facets: z.array(z.string()).optional(),
});

const IndexDocumentSchema = z.object({
  index: z.string().min(1),
  content: z.record(z.any()),
});

const IndexDocumentsSchema = z.object({
  index: z.string().min(1),
  documents: z.array(z.object({
    id: z.string(),
    content: z.record(z.any()),
  })),
});

// POST /search/query
router.post('/query', async (req: Request, res: Response) => {
  try {
    // Validate request
    const validatedData = SearchRequestSchema.parse(req.body);
    
    // Get search service from DI container
    const searchService = container.getSearchService();
    
    // Prepare search query
    const searchQuery: SearchQuery = {
      index: validatedData.index,
      query: validatedData.query,
      filters: validatedData.filters,
      sort: validatedData.sort,
      limit: validatedData.limit,
      offset: validatedData.offset,
      facets: validatedData.facets,
    };

    // Execute search
    const result = await searchService.search(searchQuery);

    res.json({
      success: true,
      data: {
        hits: result.hits,
        total: result.total,
        facets: result.facets,
        took: result.took,
      },
    });
  } catch (error) {
    console.error('Search query failed:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Search query failed',
    });
  }
});

// POST /search/index
router.post('/index', async (req: Request, res: Response) => {
  try {
    // Validate request
    const validatedData = IndexDocumentSchema.parse(req.body);
    
    // Get search service from DI container
    const searchService = container.getSearchService();
    
    // Prepare search document
    const document: SearchDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      index: validatedData.index,
      content: validatedData.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Index document
    const result = await searchService.indexDocument(document);

    res.json({
      success: result.success,
      data: {
        index: result.index,
        message: result.message,
      },
    });
  } catch (error) {
    console.error('Document indexing failed:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Document indexing failed',
    });
  }
});

// POST /search/index-bulk
router.post('/index-bulk', async (req: Request, res: Response) => {
  try {
    // Validate request
    const validatedData = IndexDocumentsSchema.parse(req.body);
    
    // Get search service from DI container
    const searchService = container.getSearchService();
    
    // Prepare search documents
    const documents: SearchDocument[] = validatedData.documents.map(doc => ({
      id: doc.id,
      index: validatedData.index,
      content: doc.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Index documents
    const result = await searchService.indexDocuments(documents);

    res.json({
      success: result.success,
      data: {
        index: result.index,
        message: result.message,
      },
    });
  } catch (error) {
    console.error('Bulk document indexing failed:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Bulk document indexing failed',
    });
  }
});

// DELETE /search/:index/:id
router.delete('/:index/:id', async (req: Request, res: Response) => {
  try {
    const { index, id } = req.params;
    
    // Get search service from DI container
    const searchService = container.getSearchService();
    
    // Delete document
    const result = await searchService.deleteDocument(index, id);

    res.json({
      success: result.success,
      data: {
        index: result.index,
        message: result.message,
      },
    });
  } catch (error) {
    console.error('Document deletion failed:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Document deletion failed',
    });
  }
});

// GET /search/stats/:index
router.get('/stats/:index', async (req: Request, res: Response) => {
  try {
    const { index } = req.params;
    
    // Get search service from DI container
    const searchService = container.getSearchService();
    
    // Get index stats
    const stats = await searchService.getIndexStats(index);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Index stats retrieval failed:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Index stats retrieval failed',
    });
  }
});

// GET /search/health
router.get('/health', async (req: Request, res: Response) => {
  try {
    // Get search service from DI container
    const searchService = container.getSearchService();
    
    // Health check
    const isHealthy = await searchService.healthCheck();

    res.json({
      success: isHealthy,
      data: {
        status: isHealthy ? 'healthy' : 'unhealthy',
      },
    });
  } catch (error) {
    console.error('Search health check failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Search health check failed',
    });
  }
});

export default router;


