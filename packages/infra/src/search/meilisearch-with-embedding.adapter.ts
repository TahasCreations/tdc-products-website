/**
 * MeiliSearch Adapter with Embedding and Reranking Support
 * Enhanced search adapter that supports vector embeddings and reranking
 */

import { MeiliSearch } from 'meilisearch';
import { SearchPort, SearchDocument, SearchQuery, SearchResult, IndexOptions, IndexResult, EmbeddingRequest, EmbeddingResponse, RerankingRequest, RerankingResponse, A/BTestResult } from '@tdc/domain';

export class MeiliSearchWithEmbeddingAdapter implements SearchPort {
  private client: MeiliSearch;
  private embeddingService: EmbeddingService;
  private rerankingService: RerankingService;
  private abTestService: ABTestService;

  constructor(
    meiliUrl: string,
    meiliKey: string,
    embeddingService: EmbeddingService,
    rerankingService: RerankingService,
    abTestService: ABTestService
  ) {
    this.client = new MeiliSearch({
      host: meiliUrl,
      apiKey: meiliKey,
    });
    this.embeddingService = embeddingService;
    this.rerankingService = rerankingService;
    this.abTestService = abTestService;
  }

  // ===========================================
  // CORE SEARCH OPERATIONS
  // ===========================================

  async indexDocument(document: SearchDocument): Promise<IndexResult> {
    try {
      // Generate embedding if not present
      if (!document.embedding && document.content.text) {
        const embeddingResponse = await this.generateEmbedding({
          text: document.content.text,
          model: 'text-embedding-3-small',
        });
        document.embedding = embeddingResponse.embedding;
        document.embeddingModel = embeddingResponse.model;
        document.embeddingGeneratedAt = new Date();
      }

      // Index document with MeiliSearch
      await this.client.index(document.index).addDocuments([{
        id: document.id,
        ...document.content,
        _embedding: document.embedding,
        _embeddingModel: document.embeddingModel,
        _embeddingGeneratedAt: document.embeddingGeneratedAt,
        _createdAt: document.createdAt,
        _updatedAt: document.updatedAt,
      }]);

      return {
        success: true,
        index: document.index,
        message: 'Document indexed successfully with embedding',
      };
    } catch (error: any) {
      console.error('Error indexing document:', error);
      return {
        success: false,
        index: document.index,
        message: error.message,
      };
    }
  }

  async indexDocuments(documents: SearchDocument[]): Promise<IndexResult> {
    try {
      // Generate embeddings for documents that don't have them
      const documentsWithEmbeddings = await Promise.all(
        documents.map(async (doc) => {
          if (!doc.embedding && doc.content.text) {
            const embeddingResponse = await this.generateEmbedding({
              text: doc.content.text,
              model: 'text-embedding-3-small',
            });
            doc.embedding = embeddingResponse.embedding;
            doc.embeddingModel = embeddingResponse.model;
            doc.embeddingGeneratedAt = new Date();
          }
          return doc;
        })
      );

      // Prepare documents for MeiliSearch
      const meiliDocuments = documentsWithEmbeddings.map(doc => ({
        id: doc.id,
        ...doc.content,
        _embedding: doc.embedding,
        _embeddingModel: doc.embeddingModel,
        _embeddingGeneratedAt: doc.embeddingGeneratedAt,
        _createdAt: doc.createdAt,
        _updatedAt: doc.updatedAt,
      }));

      // Index documents with MeiliSearch
      await this.client.index(documents[0].index).addDocuments(meiliDocuments);

      return {
        success: true,
        index: documents[0].index,
        message: `${documents.length} documents indexed successfully with embeddings`,
      };
    } catch (error: any) {
      console.error('Error indexing documents:', error);
      return {
        success: false,
        index: documents[0]?.index || 'unknown',
        message: error.message,
      };
    }
  }

  async search(query: SearchQuery): Promise<SearchResult> {
    const startTime = Date.now();
    
    try {
      let searchResults: any;
      let searchMethod: 'text' | 'vector' | 'hybrid' = 'text';

      if (query.useEmbedding && query.hybridSearch) {
        // Hybrid search: combine text and vector search
        searchMethod = 'hybrid';
        searchResults = await this.hybridSearch(query);
      } else if (query.useEmbedding) {
        // Vector search using embeddings
        searchMethod = 'vector';
        const embeddingResponse = await this.generateEmbedding({
          text: query.query,
          model: query.embeddingModel || 'text-embedding-3-small',
        });
        
        searchResults = await this.client.index(query.index).search(query.query, {
          vector: embeddingResponse.embedding,
          limit: query.limit || 20,
          offset: query.offset || 0,
          filter: query.filters,
          sort: query.sort?.map(s => `${s.field}:${s.direction}`),
          facets: query.facets,
        });
      } else {
        // Traditional text search
        searchMethod = 'text';
        searchResults = await this.client.index(query.index).search(query.query, {
          limit: query.limit || 20,
          offset: query.offset || 0,
          filter: query.filters,
          sort: query.sort?.map(s => `${s.field}:${s.direction}`),
          facets: query.facets,
        });
      }

      // Apply reranking if requested
      let rerankingScores: Array<{ id: string; score: number }> = [];
      if (query.useReranking && searchResults.hits.length > 0) {
        const rerankingResponse = await this.rerankDocuments({
          query: query.query,
          documents: searchResults.hits.map((hit: any) => ({
            id: hit.id,
            content: hit.text || hit.title || hit.description || '',
            metadata: hit,
          })),
          model: query.rerankingModel || 'ms-marco-MiniLM-L-6-v2',
          topK: query.limit || 20,
        });

        // Reorder results based on reranking scores
        const rerankedHits = rerankingResponse.results.map(ranked => {
          const originalHit = searchResults.hits.find((hit: any) => hit.id === ranked.id);
          return {
            ...originalHit,
            _rerankingScore: ranked.score,
            _rerankingRank: ranked.rank,
          };
        });

        searchResults.hits = rerankedHits;
        rerankingScores = rerankingResponse.results.map(r => ({ id: r.id, score: r.score }));
      }

      const took = Date.now() - startTime;

      return {
        hits: searchResults.hits.map((hit: any) => ({
          id: hit.id,
          index: query.index,
          content: hit,
          createdAt: hit._createdAt ? new Date(hit._createdAt) : new Date(),
          updatedAt: hit._updatedAt ? new Date(hit._updatedAt) : new Date(),
          embedding: hit._embedding,
          embeddingModel: hit._embeddingModel,
          embeddingGeneratedAt: hit._embeddingGeneratedAt ? new Date(hit._embeddingGeneratedAt) : undefined,
        })),
        total: searchResults.estimatedTotalHits || searchResults.hits.length,
        facets: searchResults.facetsDistribution,
        took,
        embeddingUsed: query.useEmbedding || false,
        rerankingUsed: query.useReranking || false,
        searchMethod,
        rerankingScores,
      };
    } catch (error: any) {
      console.error('Error searching:', error);
      throw error;
    }
  }

  async deleteDocument(index: string, id: string): Promise<IndexResult> {
    try {
      await this.client.index(index).deleteDocument(id);
      return {
        success: true,
        index,
        message: 'Document deleted successfully',
      };
    } catch (error: any) {
      console.error('Error deleting document:', error);
      return {
        success: false,
        index,
        message: error.message,
      };
    }
  }

  async updateDocument(document: SearchDocument): Promise<IndexResult> {
    try {
      // Regenerate embedding if content changed
      if (document.content.text) {
        const embeddingResponse = await this.generateEmbedding({
          text: document.content.text,
          model: 'text-embedding-3-small',
        });
        document.embedding = embeddingResponse.embedding;
        document.embeddingModel = embeddingResponse.model;
        document.embeddingGeneratedAt = new Date();
      }

      await this.client.index(document.index).updateDocuments([{
        id: document.id,
        ...document.content,
        _embedding: document.embedding,
        _embeddingModel: document.embeddingModel,
        _embeddingGeneratedAt: document.embeddingGeneratedAt,
        _updatedAt: document.updatedAt,
      }]);

      return {
        success: true,
        index: document.index,
        message: 'Document updated successfully with new embedding',
      };
    } catch (error: any) {
      console.error('Error updating document:', error);
      return {
        success: false,
        index: document.index,
        message: error.message,
      };
    }
  }

  async createIndex(options: IndexOptions): Promise<IndexResult> {
    try {
      await this.client.createIndex(options.index, {
        primaryKey: 'id',
      });

      // Configure index settings for embedding support
      await this.client.index(options.index).updateSettings({
        searchableAttributes: ['*'],
        filterableAttributes: ['*'],
        sortableAttributes: ['*'],
        // Enable vector search if supported
        ...(options.settings || {}),
      });

      return {
        success: true,
        index: options.index,
        message: 'Index created successfully with embedding support',
      };
    } catch (error: any) {
      console.error('Error creating index:', error);
      return {
        success: false,
        index: options.index,
        message: error.message,
      };
    }
  }

  async deleteIndex(index: string): Promise<IndexResult> {
    try {
      await this.client.deleteIndex(index);
      return {
        success: true,
        index,
        message: 'Index deleted successfully',
      };
    } catch (error: any) {
      console.error('Error deleting index:', error);
      return {
        success: false,
        index,
        message: error.message,
      };
    }
  }

  async getIndexStats(index: string): Promise<Record<string, any>> {
    try {
      const stats = await this.client.index(index).getStats();
      return stats;
    } catch (error: any) {
      console.error('Error getting index stats:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const health = await this.client.health();
      return health.status === 'available';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // ===========================================
  // EMBEDDING OPERATIONS
  // ===========================================

  async generateEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    return this.embeddingService.generateEmbedding(request);
  }

  async embedIndex(text: string, vector: number[]): Promise<IndexResult> {
    try {
      // This method is used to index a document with a pre-computed embedding
      const document = {
        id: `embed_${Date.now()}`,
        index: 'embeddings',
        content: { text },
        embedding: vector,
        embeddingModel: 'text-embedding-3-small',
        embeddingGeneratedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return this.indexDocument(document);
    } catch (error: any) {
      console.error('Error embedding index:', error);
      return {
        success: false,
        index: 'embeddings',
        message: error.message,
      };
    }
  }

  // ===========================================
  // RERANKING OPERATIONS
  // ===========================================

  async rerankDocuments(request: RerankingRequest): Promise<RerankingResponse> {
    return this.rerankingService.rerankDocuments(request);
  }

  // ===========================================
  // A/B TESTING
  // ===========================================

  async searchWithABTest(query: SearchQuery): Promise<{
    variantA: A/BTestResult;
    variantB: A/BTestResult;
    recommendation: 'A' | 'B' | 'tie';
  }> {
    const startTime = Date.now();

    // Variant A: Traditional text search
    const variantAStart = Date.now();
    const variantAQuery = { ...query, useEmbedding: false, useReranking: false };
    const variantAResults = await this.search(variantAQuery);
    const variantAPerformance = {
      responseTime: Date.now() - variantAStart,
      relevanceScore: this.calculateRelevanceScore(variantAResults, query.query),
    };

    // Variant B: Hybrid search with reranking
    const variantBStart = Date.now();
    const variantBQuery = { 
      ...query, 
      useEmbedding: true, 
      useReranking: true, 
      hybridSearch: true 
    };
    const variantBResults = await this.search(variantBQuery);
    const variantBPerformance = {
      responseTime: Date.now() - variantBStart,
      relevanceScore: this.calculateRelevanceScore(variantBResults, query.query),
    };

    // Determine recommendation
    const recommendation = this.abTestService.compareResults(
      variantAPerformance,
      variantBPerformance
    );

    return {
      variantA: {
        variant: 'A',
        method: 'text',
        results: variantAResults,
        performance: variantAPerformance,
      },
      variantB: {
        variant: 'B',
        method: 'hybrid',
        results: variantBResults,
        performance: variantBPerformance,
      },
      recommendation,
    };
  }

  // ===========================================
  // HYBRID SEARCH
  // ===========================================

  async hybridSearch(query: SearchQuery): Promise<SearchResult> {
    const startTime = Date.now();

    try {
      // Generate embedding for the query
      const embeddingResponse = await this.generateEmbedding({
        text: query.query,
        model: query.embeddingModel || 'text-embedding-3-small',
      });

      // Perform both text and vector search
      const [textResults, vectorResults] = await Promise.all([
        this.client.index(query.index).search(query.query, {
          limit: query.limit || 20,
          offset: query.offset || 0,
          filter: query.filters,
          sort: query.sort?.map(s => `${s.field}:${s.direction}`),
          facets: query.facets,
        }),
        this.client.index(query.index).search(query.query, {
          vector: embeddingResponse.embedding,
          limit: query.limit || 20,
          offset: query.offset || 0,
          filter: query.filters,
          sort: query.sort?.map(s => `${s.field}:${s.direction}`),
          facets: query.facets,
        }),
      ]);

      // Combine and deduplicate results
      const combinedHits = this.combineSearchResults(textResults.hits, vectorResults.hits);
      
      // Apply reranking if requested
      let finalHits = combinedHits;
      if (query.useReranking) {
        const rerankingResponse = await this.rerankDocuments({
          query: query.query,
          documents: combinedHits.map((hit: any) => ({
            id: hit.id,
            content: hit.text || hit.title || hit.description || '',
            metadata: hit,
          })),
          model: query.rerankingModel || 'ms-marco-MiniLM-L-6-v2',
          topK: query.limit || 20,
        });

        finalHits = rerankingResponse.results.map(ranked => {
          const originalHit = combinedHits.find((hit: any) => hit.id === ranked.id);
          return {
            ...originalHit,
            _rerankingScore: ranked.score,
            _rerankingRank: ranked.rank,
          };
        });
      }

      const took = Date.now() - startTime;

      return {
        hits: finalHits.map((hit: any) => ({
          id: hit.id,
          index: query.index,
          content: hit,
          createdAt: hit._createdAt ? new Date(hit._createdAt) : new Date(),
          updatedAt: hit._updatedAt ? new Date(hit._updatedAt) : new Date(),
          embedding: hit._embedding,
          embeddingModel: hit._embeddingModel,
          embeddingGeneratedAt: hit._embeddingGeneratedAt ? new Date(hit._embeddingGeneratedAt) : undefined,
        })),
        total: Math.max(textResults.estimatedTotalHits || 0, vectorResults.estimatedTotalHits || 0),
        facets: textResults.facetsDistribution || vectorResults.facetsDistribution,
        took,
        embeddingUsed: true,
        rerankingUsed: query.useReranking || false,
        searchMethod: 'hybrid',
      };
    } catch (error: any) {
      console.error('Error in hybrid search:', error);
      throw error;
    }
  }

  // ===========================================
  // EMBEDDING UPDATE OPERATIONS
  // ===========================================

  async updateDocumentEmbedding(index: string, id: string, text: string): Promise<IndexResult> {
    try {
      const embeddingResponse = await this.generateEmbedding({
        text,
        model: 'text-embedding-3-small',
      });

      await this.client.index(index).updateDocuments([{
        id,
        _embedding: embeddingResponse.embedding,
        _embeddingModel: embeddingResponse.model,
        _embeddingGeneratedAt: new Date(),
        _updatedAt: new Date(),
      }]);

      return {
        success: true,
        index,
        message: 'Document embedding updated successfully',
      };
    } catch (error: any) {
      console.error('Error updating document embedding:', error);
      return {
        success: false,
        index,
        message: error.message,
      };
    }
  }

  async bulkUpdateEmbeddings(index: string, documents: Array<{ id: string; text: string }>): Promise<IndexResult> {
    try {
      const documentsWithEmbeddings = await Promise.all(
        documents.map(async (doc) => {
          const embeddingResponse = await this.generateEmbedding({
            text: doc.text,
            model: 'text-embedding-3-small',
          });
          return {
            id: doc.id,
            _embedding: embeddingResponse.embedding,
            _embeddingModel: embeddingResponse.model,
            _embeddingGeneratedAt: new Date(),
            _updatedAt: new Date(),
          };
        })
      );

      await this.client.index(index).updateDocuments(documentsWithEmbeddings);

      return {
        success: true,
        index,
        message: `${documents.length} document embeddings updated successfully`,
      };
    } catch (error: any) {
      console.error('Error bulk updating embeddings:', error);
      return {
        success: false,
        index,
        message: error.message,
      };
    }
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  private combineSearchResults(textHits: any[], vectorHits: any[]): any[] {
    const combinedMap = new Map();
    
    // Add text search results
    textHits.forEach(hit => {
      combinedMap.set(hit.id, {
        ...hit,
        _textScore: hit._score || 0,
        _vectorScore: 0,
      });
    });
    
    // Add vector search results
    vectorHits.forEach(hit => {
      const existing = combinedMap.get(hit.id);
      if (existing) {
        existing._vectorScore = hit._score || 0;
        existing._combinedScore = (existing._textScore + existing._vectorScore) / 2;
      } else {
        combinedMap.set(hit.id, {
          ...hit,
          _textScore: 0,
          _vectorScore: hit._score || 0,
          _combinedScore: hit._score || 0,
        });
      }
    });
    
    // Sort by combined score
    return Array.from(combinedMap.values()).sort((a, b) => 
      (b._combinedScore || 0) - (a._combinedScore || 0)
    );
  }

  private calculateRelevanceScore(results: SearchResult, query: string): number {
    // Simple relevance scoring based on hit count and query length
    const hitCount = results.hits.length;
    const queryLength = query.length;
    const avgScore = results.hits.reduce((sum, hit) => sum + (hit.content._score || 0), 0) / hitCount;
    
    return Math.min(1.0, (hitCount / 10) * (queryLength / 50) * (avgScore / 10));
  }
}

// ===========================================
// SUPPORTING SERVICES
// ===========================================

export class EmbeddingService {
  async generateEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    // Mock implementation - in real app, this would call OpenAI, Cohere, or local embedding service
    const mockEmbedding = Array.from({ length: request.dimensions || 1536 }, () => Math.random());
    
    return {
      embedding: mockEmbedding,
      model: request.model || 'text-embedding-3-small',
      dimensions: request.dimensions || 1536,
      tokens: Math.ceil(request.text.length / 4), // Rough token estimation
    };
  }
}

export class RerankingService {
  async rerankDocuments(request: RerankingRequest): Promise<RerankingResponse> {
    // Mock implementation - in real app, this would call a reranking service
    const results = request.documents.map((doc, index) => ({
      id: doc.id,
      score: Math.random() * 0.5 + 0.5, // Random score between 0.5 and 1.0
      rank: index + 1,
    }));

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);
    
    // Update ranks
    results.forEach((result, index) => {
      result.rank = index + 1;
    });

    return {
      results: results.slice(0, request.topK || 20),
      model: request.model || 'ms-marco-MiniLM-L-6-v2',
      totalProcessed: request.documents.length,
    };
  }
}

export class ABTestService {
  compareResults(performanceA: any, performanceB: any): 'A' | 'B' | 'tie' {
    const scoreA = performanceA.relevanceScore - (performanceA.responseTime / 1000) * 0.1;
    const scoreB = performanceB.relevanceScore - (performanceB.responseTime / 1000) * 0.1;
    
    const threshold = 0.05; // 5% threshold for significance
    
    if (Math.abs(scoreA - scoreB) < threshold) {
      return 'tie';
    }
    
    return scoreA > scoreB ? 'A' : 'B';
  }
}

