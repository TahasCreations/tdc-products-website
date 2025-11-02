/**
 * Enterprise Elasticsearch Integration
 * Advanced search with fuzzy matching, autocomplete, facets
 */

import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY || '',
  },
});

const INDEX_NAME = 'tdc-products';

interface SearchQuery {
  query: string;
  filters?: {
    categories?: string[];
    brands?: string[];
    priceRange?: [number, number];
    rating?: number;
    inStock?: boolean;
  };
  sort?: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  page?: number;
  pageSize?: number;
}

interface SearchResult {
  products: any[];
  total: number;
  facets: {
    categories: Array<{ name: string; count: number }>;
    brands: Array<{ name: string; count: number }>;
    priceRanges: Array<{ range: string; count: number }>;
  };
  suggestions: string[];
  took: number;
}

export class ElasticsearchService {
  /**
   * Initialize index with mappings
   */
  async createIndex() {
    const exists = await client.indices.exists({ index: INDEX_NAME });
    
    if (!exists) {
      await client.indices.create({
        index: INDEX_NAME,
        body: {
          settings: {
            analysis: {
              analyzer: {
                turkish_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'turkish_stop', 'turkish_stemmer'],
                },
                autocomplete_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'edge_ngram_filter'],
                },
              },
              filter: {
                turkish_stop: {
                  type: 'stop',
                  stopwords: '_turkish_',
                },
                turkish_stemmer: {
                  type: 'stemmer',
                  language: 'turkish',
                },
                edge_ngram_filter: {
                  type: 'edge_ngram',
                  min_gram: 2,
                  max_gram: 20,
                },
              },
            },
          },
          mappings: {
            properties: {
              name: {
                type: 'text',
                analyzer: 'turkish_analyzer',
                fields: {
                  autocomplete: {
                    type: 'text',
                    analyzer: 'autocomplete_analyzer',
                  },
                  keyword: {
                    type: 'keyword',
                  },
                },
              },
              description: {
                type: 'text',
                analyzer: 'turkish_analyzer',
              },
              category: {
                type: 'keyword',
              },
              brand: {
                type: 'keyword',
              },
              price: {
                type: 'float',
              },
              rating: {
                type: 'float',
              },
              stock: {
                type: 'integer',
              },
              tags: {
                type: 'keyword',
              },
              createdAt: {
                type: 'date',
              },
              salesCount: {
                type: 'integer',
              },
              viewCount: {
                type: 'integer',
              },
            },
          },
        },
      });
    }
  }

  /**
   * Advanced search with all features
   */
  async search(query: SearchQuery): Promise<SearchResult> {
    const { query: searchQuery, filters, sort, page = 1, pageSize = 24 } = query;

    // Build Elasticsearch query
    const must: any[] = [];
    const filter: any[] = [];

    // Text search with fuzzy matching
    if (searchQuery) {
      must.push({
        multi_match: {
          query: searchQuery,
          fields: ['name^3', 'description^2', 'tags'],
          type: 'best_fields',
          fuzziness: 'AUTO',
          prefix_length: 2,
        },
      });
    }

    // Filters
    if (filters?.categories && filters.categories.length > 0) {
      filter.push({ terms: { category: filters.categories } });
    }

    if (filters?.brands && filters.brands.length > 0) {
      filter.push({ terms: { brand: filters.brands } });
    }

    if (filters?.priceRange) {
      filter.push({
        range: {
          price: {
            gte: filters.priceRange[0],
            lte: filters.priceRange[1],
          },
        },
      });
    }

    if (filters?.rating) {
      filter.push({ range: { rating: { gte: filters.rating } } });
    }

    if (filters?.inStock) {
      filter.push({ range: { stock: { gt: 0 } } });
    }

    // Sorting
    let sortField: any[] = [];
    switch (sort) {
      case 'price-asc':
        sortField = [{ price: 'asc' }];
        break;
      case 'price-desc':
        sortField = [{ price: 'desc' }];
        break;
      case 'rating':
        sortField = [{ rating: 'desc' }];
        break;
      case 'newest':
        sortField = [{ createdAt: 'desc' }];
        break;
      default:
        sortField = [{ _score: 'desc' }];
    }

    // Execute search
    const response = await client.search({
      index: INDEX_NAME,
      body: {
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }],
            filter,
          },
        },
        sort: sortField,
        from: (page - 1) * pageSize,
        size: pageSize,
        aggs: {
          categories: {
            terms: { field: 'category', size: 20 },
          },
          brands: {
            terms: { field: 'brand', size: 20 },
          },
          price_ranges: {
            range: {
              field: 'price',
              ranges: [
                { to: 100 },
                { from: 100, to: 500 },
                { from: 500, to: 1000 },
                { from: 1000 },
              ],
            },
          },
        },
        suggest: {
          product_suggest: {
            prefix: searchQuery,
            completion: {
              field: 'name.autocomplete',
              size: 5,
              skip_duplicates: true,
            },
          },
        },
      },
    });

    // Parse results
    const hits = response.hits.hits;
    const total = typeof response.hits.total === 'number' 
      ? response.hits.total 
      : response.hits.total?.value || 0;

    const products = hits.map((hit: any) => ({
      id: hit._id,
      score: hit._score,
      ...hit._source,
    }));

    // Parse facets
    const facets = {
      categories: (response.aggregations?.categories as any)?.buckets.map((b: any) => ({
        name: b.key,
        count: b.doc_count,
      })) || [],
      brands: (response.aggregations?.brands as any)?.buckets.map((b: any) => ({
        name: b.key,
        count: b.doc_count,
      })) || [],
      priceRanges: (response.aggregations?.price_ranges as any)?.buckets.map((b: any) => ({
        range: b.key,
        count: b.doc_count,
      })) || [],
    };

    const suggestions = (response.suggest?.product_suggest as any)?.[0]?.options.map(
      (o: any) => o.text
    ) || [];

    return {
      products,
      total,
      facets,
      suggestions,
      took: response.took,
    };
  }

  /**
   * Index product
   */
  async indexProduct(product: any) {
    await client.index({
      index: INDEX_NAME,
      id: product.id,
      body: product,
    });
  }

  /**
   * Bulk index products
   */
  async bulkIndexProducts(products: any[]) {
    const body = products.flatMap((product) => [
      { index: { _index: INDEX_NAME, _id: product.id } },
      product,
    ]);

    await client.bulk({ body });
  }

  /**
   * Delete product from index
   */
  async deleteProduct(productId: string) {
    await client.delete({
      index: INDEX_NAME,
      id: productId,
    });
  }

  /**
   * Update product
   */
  async updateProduct(productId: string, updates: any) {
    await client.update({
      index: INDEX_NAME,
      id: productId,
      body: {
        doc: updates,
      },
    });
  }

  /**
   * Search suggestions (autocomplete)
   */
  async getSuggestions(prefix: string, limit: number = 5): Promise<string[]> {
    const response = await client.search({
      index: INDEX_NAME,
      body: {
        suggest: {
          product_suggest: {
            prefix,
            completion: {
              field: 'name.autocomplete',
              size: limit,
              skip_duplicates: true,
            },
          },
        },
      },
    });

    return (response.suggest?.product_suggest as any)?.[0]?.options.map(
      (o: any) => o.text
    ) || [];
  }

  /**
   * More Like This (MLT) query
   */
  async findSimilarProducts(productId: string, limit: number = 6) {
    const response = await client.search({
      index: INDEX_NAME,
      body: {
        query: {
          more_like_this: {
            fields: ['name', 'description', 'category', 'tags'],
            like: [
              {
                _index: INDEX_NAME,
                _id: productId,
              },
            ],
            min_term_freq: 1,
            max_query_terms: 12,
          },
        },
        size: limit,
      },
    });

    return response.hits.hits.map((hit: any) => ({
      id: hit._id,
      score: hit._score,
      ...hit._source,
    }));
  }

  /**
   * Semantic search using vector similarity
   */
  async semanticSearch(queryVector: number[], limit: number = 10) {
    // Requires dense_vector field in mappings
    const response = await client.search({
      index: INDEX_NAME,
      body: {
        query: {
          script_score: {
            query: { match_all: {} },
            script: {
              source: 'cosineSimilarity(params.query_vector, "embedding_vector") + 1.0',
              params: {
                query_vector: queryVector,
              },
            },
          },
        },
        size: limit,
      },
    });

    return response.hits.hits.map((hit: any) => hit._source);
  }
}

export const elasticsearchService = new ElasticsearchService();

