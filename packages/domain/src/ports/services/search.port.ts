// Search Domain Port
export interface SearchDocument {
  id: string;
  index: string;
  content: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  // Embedding fields
  embedding?: number[];
  embeddingModel?: string;
  embeddingGeneratedAt?: Date;
}

export interface SearchQuery {
  index: string;
  query: string;
  filters?: Record<string, any>;
  sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
  limit?: number;
  offset?: number;
  facets?: string[];
  // Embedding and reranking options
  useEmbedding?: boolean;
  useReranking?: boolean;
  embeddingModel?: string;
  rerankingModel?: string;
  hybridSearch?: boolean; // Combine text and vector search
}

export interface SearchResult {
  hits: SearchDocument[];
  total: number;
  facets?: Record<string, any>;
  took: number; // milliseconds
  // Embedding and reranking metadata
  embeddingUsed?: boolean;
  rerankingUsed?: boolean;
  searchMethod?: 'text' | 'vector' | 'hybrid';
  rerankingScores?: Array<{ id: string; score: number }>;
}

export interface IndexOptions {
  index: string;
  settings?: Record<string, any>;
  mappings?: Record<string, any>;
}

export interface IndexResult {
  success: boolean;
  index: string;
  message?: string;
}

// Embedding and Reranking interfaces
export interface EmbeddingRequest {
  text: string;
  model?: string;
  dimensions?: number;
}

export interface EmbeddingResponse {
  embedding: number[];
  model: string;
  dimensions: number;
  tokens: number;
}

export interface RerankingRequest {
  query: string;
  documents: Array<{
    id: string;
    content: string;
    metadata?: Record<string, any>;
  }>;
  model?: string;
  topK?: number;
}

export interface RerankingResponse {
  results: Array<{
    id: string;
    score: number;
    rank: number;
  }>;
  model: string;
  totalProcessed: number;
}

export interface A/BTestResult {
  variant: 'A' | 'B';
  method: 'text' | 'vector' | 'hybrid';
  results: SearchResult;
  performance: {
    responseTime: number;
    relevanceScore: number;
    clickThroughRate?: number;
  };
}

// Search Port Interface
export interface SearchPort {
  // Index document
  indexDocument(document: SearchDocument): Promise<IndexResult>;
  
  // Index multiple documents
  indexDocuments(documents: SearchDocument[]): Promise<IndexResult>;
  
  // Search documents
  search(query: SearchQuery): Promise<SearchResult>;
  
  // Delete document
  deleteDocument(index: string, id: string): Promise<IndexResult>;
  
  // Update document
  updateDocument(document: SearchDocument): Promise<IndexResult>;
  
  // Create index
  createIndex(options: IndexOptions): Promise<IndexResult>;
  
  // Delete index
  deleteIndex(index: string): Promise<IndexResult>;
  
  // Get index stats
  getIndexStats(index: string): Promise<Record<string, any>>;
  
  // Health check
  healthCheck(): Promise<boolean>;
  
  // Embedding operations
  generateEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse>;
  
  // Index document with embedding
  embedIndex(text: string, vector: number[]): Promise<IndexResult>;
  
  // Reranking operations
  rerankDocuments(request: RerankingRequest): Promise<RerankingResponse>;
  
  // A/B testing for search methods
  searchWithABTest(query: SearchQuery): Promise<{
    variantA: A/BTestResult;
    variantB: A/BTestResult;
    recommendation: 'A' | 'B' | 'tie';
  }>;
  
  // Hybrid search (combines text and vector search)
  hybridSearch(query: SearchQuery): Promise<SearchResult>;
  
  // Update document embeddings
  updateDocumentEmbedding(index: string, id: string, text: string): Promise<IndexResult>;
  
  // Bulk update embeddings
  bulkUpdateEmbeddings(index: string, documents: Array<{ id: string; text: string }>): Promise<IndexResult>;
}
