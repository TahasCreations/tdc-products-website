/**
 * Search Service with Embedding and Reranking Support
 * Business logic for enhanced search functionality
 */

import { SearchPort, SearchDocument, SearchQuery, SearchResult, EmbeddingRequest, EmbeddingResponse, RerankingRequest, RerankingResponse, A/BTestResult } from '../ports/services/search.port';

export class SearchWithEmbeddingService {
  constructor(private searchPort: SearchPort) {}

  // ===========================================
  // ENHANCED SEARCH OPERATIONS
  // ===========================================

  async searchProducts(query: string, options: {
    tenantId: string;
    sellerId?: string;
    categoryId?: string;
    priceRange?: { min: number; max: number };
    useEmbedding?: boolean;
    useReranking?: boolean;
    hybridSearch?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<SearchResult> {
    const searchQuery: SearchQuery = {
      index: `products_${options.tenantId}`,
      query,
      filters: {
        ...(options.sellerId && { sellerId: options.sellerId }),
        ...(options.categoryId && { categoryId: options.categoryId }),
        ...(options.priceRange && {
          price: {
            min: options.priceRange.min,
            max: options.priceRange.max,
          },
        }),
      },
      useEmbedding: options.useEmbedding || false,
      useReranking: options.useReranking || false,
      hybridSearch: options.hybridSearch || false,
      embeddingModel: 'text-embedding-3-small',
      rerankingModel: 'ms-marco-MiniLM-L-6-v2',
      limit: options.limit || 20,
      offset: options.offset || 0,
      facets: ['category', 'brand', 'priceRange', 'tags'],
    };

    return this.searchPort.search(searchQuery);
  }

  async searchWithABTest(query: string, options: {
    tenantId: string;
    sellerId?: string;
    testName?: string;
  }): Promise<{
    variantA: A/BTestResult;
    variantB: A/BTestResult;
    recommendation: 'A' | 'B' | 'tie';
    testResults: {
      testName: string;
      query: string;
      timestamp: Date;
      winner: 'A' | 'B' | 'tie';
      performanceGap: number;
    };
  }> {
    const searchQuery: SearchQuery = {
      index: `products_${options.tenantId}`,
      query,
      filters: {
        ...(options.sellerId && { sellerId: options.sellerId }),
      },
      limit: 20,
    };

    const abTestResults = await this.searchPort.searchWithABTest(searchQuery);
    
    const performanceGap = Math.abs(
      abTestResults.variantA.performance.relevanceScore - 
      abTestResults.variantB.performance.relevanceScore
    );

    return {
      ...abTestResults,
      testResults: {
        testName: options.testName || 'search_ab_test',
        query,
        timestamp: new Date(),
        winner: abTestResults.recommendation,
        performanceGap,
      },
    };
  }

  // ===========================================
  // PRODUCT INDEXING WITH EMBEDDINGS
  // ===========================================

  async indexProduct(product: {
    id: string;
    tenantId: string;
    sellerId: string;
    title: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    tags: string[];
    images: string[];
    specifications: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<{ success: boolean; message: string }> {
    try {
      // Prepare searchable content
      const searchableContent = [
        product.title,
        product.description,
        product.category,
        product.brand,
        ...product.tags,
        ...Object.values(product.specifications).filter(v => typeof v === 'string'),
      ].join(' ');

      // Create search document
      const searchDocument: SearchDocument = {
        id: product.id,
        index: `products_${product.tenantId}`,
        content: {
          title: product.title,
          description: product.description,
          category: product.category,
          brand: product.brand,
          price: product.price,
          tags: product.tags,
          images: product.images,
          specifications: product.specifications,
          sellerId: product.sellerId,
          text: searchableContent, // This will be used for embedding generation
        },
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };

      // Index document (embedding will be generated automatically)
      const result = await this.searchPort.indexDocument(searchDocument);

      return {
        success: result.success,
        message: result.message || 'Product indexed successfully',
      };
    } catch (error: any) {
      console.error('Error indexing product:', error);
      return {
        success: false,
        message: `Failed to index product: ${error.message}`,
      };
    }
  }

  async bulkIndexProducts(products: Array<{
    id: string;
    tenantId: string;
    sellerId: string;
    title: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    tags: string[];
    images: string[];
    specifications: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }>): Promise<{ success: boolean; message: string; indexed: number }> {
    try {
      const searchDocuments: SearchDocument[] = products.map(product => {
        const searchableContent = [
          product.title,
          product.description,
          product.category,
          product.brand,
          ...product.tags,
          ...Object.values(product.specifications).filter(v => typeof v === 'string'),
        ].join(' ');

        return {
          id: product.id,
          index: `products_${product.tenantId}`,
          content: {
            title: product.title,
            description: product.description,
            category: product.category,
            brand: product.brand,
            price: product.price,
            tags: product.tags,
            images: product.images,
            specifications: product.specifications,
            sellerId: product.sellerId,
            text: searchableContent,
          },
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        };
      });

      const result = await this.searchPort.indexDocuments(searchDocuments);

      return {
        success: result.success,
        message: result.message || 'Products indexed successfully',
        indexed: products.length,
      };
    } catch (error: any) {
      console.error('Error bulk indexing products:', error);
      return {
        success: false,
        message: `Failed to bulk index products: ${error.message}`,
        indexed: 0,
      };
    }
  }

  // ===========================================
  // EMBEDDING OPERATIONS
  // ===========================================

  async generateProductEmbedding(product: {
    title: string;
    description: string;
    category: string;
    brand: string;
    tags: string[];
    specifications: Record<string, any>;
  }): Promise<EmbeddingResponse> {
    const searchableText = [
      product.title,
      product.description,
      product.category,
      product.brand,
      ...product.tags,
      ...Object.values(product.specifications).filter(v => typeof v === 'string'),
    ].join(' ');

    return this.searchPort.generateEmbedding({
      text: searchableText,
      model: 'text-embedding-3-small',
      dimensions: 1536,
    });
  }

  async updateProductEmbedding(productId: string, tenantId: string, product: {
    title: string;
    description: string;
    category: string;
    brand: string;
    tags: string[];
    specifications: Record<string, any>;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const searchableText = [
        product.title,
        product.description,
        product.category,
        product.brand,
        ...product.tags,
        ...Object.values(product.specifications).filter(v => typeof v === 'string'),
      ].join(' ');

      const result = await this.searchPort.updateDocumentEmbedding(
        `products_${tenantId}`,
        productId,
        searchableText
      );

      return {
        success: result.success,
        message: result.message || 'Product embedding updated successfully',
      };
    } catch (error: any) {
      console.error('Error updating product embedding:', error);
      return {
        success: false,
        message: `Failed to update product embedding: ${error.message}`,
      };
    }
  }

  // ===========================================
  // RERANKING OPERATIONS
  // ===========================================

  async rerankProductResults(query: string, products: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    tags: string[];
    metadata?: Record<string, any>;
  }>): Promise<RerankingResponse> {
    const rerankingRequest: RerankingRequest = {
      query,
      documents: products.map(product => ({
        id: product.id,
        content: [
          product.title,
          product.description,
          product.category,
          product.brand,
          ...product.tags,
        ].join(' '),
        metadata: {
          ...product.metadata,
          price: product.price,
          category: product.category,
          brand: product.brand,
        },
      })),
      model: 'ms-marco-MiniLM-L-6-v2',
      topK: products.length,
    };

    return this.searchPort.rerankDocuments(rerankingRequest);
  }

  // ===========================================
  // ANALYTICS AND MONITORING
  // ===========================================

  async getSearchAnalytics(tenantId: string, dateRange: {
    start: Date;
    end: Date;
  }): Promise<{
    totalSearches: number;
    averageResponseTime: number;
    embeddingUsage: number;
    rerankingUsage: number;
    hybridSearchUsage: number;
    topQueries: Array<{ query: string; count: number }>;
    searchMethods: {
      text: number;
      vector: number;
      hybrid: number;
    };
  }> {
    // Mock implementation - in real app, this would query analytics data
    return {
      totalSearches: 1250,
      averageResponseTime: 150,
      embeddingUsage: 450,
      rerankingUsage: 300,
      hybridSearchUsage: 200,
      topQueries: [
        { query: 'laptop', count: 45 },
        { query: 'smartphone', count: 38 },
        { query: 'headphones', count: 32 },
        { query: 'camera', count: 28 },
        { query: 'tablet', count: 25 },
      ],
      searchMethods: {
        text: 600,
        vector: 400,
        hybrid: 250,
      },
    };
  }

  async getABTestResults(tenantId: string, testName?: string): Promise<Array<{
    testName: string;
    query: string;
    timestamp: Date;
    variantA: {
      method: string;
      relevanceScore: number;
      responseTime: number;
    };
    variantB: {
      method: string;
      relevanceScore: number;
      responseTime: number;
    };
    winner: 'A' | 'B' | 'tie';
    performanceGap: number;
  }>> {
    // Mock implementation - in real app, this would query A/B test results
    return [
      {
        testName: 'search_ab_test_1',
        query: 'laptop gaming',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        variantA: {
          method: 'text',
          relevanceScore: 0.75,
          responseTime: 120,
        },
        variantB: {
          method: 'hybrid',
          relevanceScore: 0.85,
          responseTime: 180,
        },
        winner: 'B',
        performanceGap: 0.1,
      },
      {
        testName: 'search_ab_test_2',
        query: 'wireless headphones',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        variantA: {
          method: 'text',
          relevanceScore: 0.70,
          responseTime: 110,
        },
        variantB: {
          method: 'hybrid',
          relevanceScore: 0.72,
          responseTime: 160,
        },
        winner: 'A',
        performanceGap: 0.02,
      },
    ];
  }

  // ===========================================
  // HEALTH AND MONITORING
  // ===========================================

  async healthCheck(): Promise<{
    searchEngine: boolean;
    embeddingService: boolean;
    rerankingService: boolean;
    overall: boolean;
  }> {
    try {
      const searchEngineHealth = await this.searchPort.healthCheck();
      
      // Test embedding service
      let embeddingServiceHealth = false;
      try {
        await this.searchPort.generateEmbedding({
          text: 'test',
          model: 'text-embedding-3-small',
        });
        embeddingServiceHealth = true;
      } catch (error) {
        console.error('Embedding service health check failed:', error);
      }

      // Test reranking service
      let rerankingServiceHealth = false;
      try {
        await this.searchPort.rerankDocuments({
          query: 'test',
          documents: [{ id: '1', content: 'test content' }],
        });
        rerankingServiceHealth = true;
      } catch (error) {
        console.error('Reranking service health check failed:', error);
      }

      return {
        searchEngine: searchEngineHealth,
        embeddingService: embeddingServiceHealth,
        rerankingService: rerankingServiceHealth,
        overall: searchEngineHealth && embeddingServiceHealth && rerankingServiceHealth,
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        searchEngine: false,
        embeddingService: false,
        rerankingService: false,
        overall: false,
      };
    }
  }
}

