// Search Port Interface
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'product' | 'blog' | 'store';
  score: number;
  metadata?: Record<string, any>;
}

export interface SearchFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  tags?: string[];
}

export interface SearchOptions {
  query: string;
  filters?: SearchFilters;
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
  page?: number;
  limit?: number;
  storeId?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  facets?: Record<string, any>;
}

export interface SearchPort {
  search(options: SearchOptions): Promise<SearchResponse>;
  indexDocument(type: string, id: string, document: any): Promise<void>;
  deleteDocument(type: string, id: string): Promise<void>;
  updateDocument(type: string, id: string, document: any): Promise<void>;
  getSuggestions(query: string, limit?: number): Promise<string[]>;
}
