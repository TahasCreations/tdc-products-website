// Meilisearch Integration
import { MeiliSearch } from 'meilisearch';
import { SearchPort, SearchOptions, SearchResponse, SearchResult } from '../ports/SearchPort';

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_API_KEY || 'masterKey',
});

export class MeilisearchService implements SearchPort {
  private client: MeiliSearch;

  constructor() {
    this.client = client;
  }

  async search(options: SearchOptions): Promise<SearchResponse> {
    try {
      const index = this.client.index('products');
      
      const searchParams: any = {
        q: options.query,
        limit: options.limit || 12,
        offset: ((options.page || 1) - 1) * (options.limit || 12),
        attributesToRetrieve: ['*'],
        attributesToHighlight: ['title', 'description'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
      };

      // Add filters
      if (options.filters) {
        const filterArray = [];
        
        if (options.filters.category) {
          filterArray.push(`category = "${options.filters.category}"`);
        }
        
        if (options.filters.priceMin !== undefined) {
          filterArray.push(`price >= ${options.filters.priceMin}`);
        }
        
        if (options.filters.priceMax !== undefined) {
          filterArray.push(`price <= ${options.filters.priceMax}`);
        }
        
        if (options.filters.rating !== undefined) {
          filterArray.push(`rating >= ${options.filters.rating}`);
        }
        
        if (options.filters.inStock !== undefined) {
          filterArray.push(`stock > 0`);
        }
        
        if (options.filters.tags && options.filters.tags.length > 0) {
          filterArray.push(`tags IN [${options.filters.tags.map(tag => `"${tag}"`).join(', ')}]`);
        }

        if (filterArray.length > 0) {
          searchParams.filter = filterArray.join(' AND ');
        }
      }

      // Add sorting
      if (options.sort) {
        switch (options.sort) {
          case 'price_asc':
            searchParams.sort = ['price:asc'];
            break;
          case 'price_desc':
            searchParams.sort = ['price:desc'];
            break;
          case 'rating':
            searchParams.sort = ['rating:desc'];
            break;
          case 'newest':
            searchParams.sort = ['createdAt:desc'];
            break;
          case 'relevance':
          default:
            // Meilisearch sorts by relevance by default
            break;
        }
      }

      const response = await index.search(searchParams);

      const results: SearchResult[] = response.hits.map((hit: any) => ({
        id: hit.id,
        title: hit.title || hit.name,
        description: hit.description || hit.excerpt,
        url: `/products/${hit.slug}`,
        type: 'product',
        score: hit._score || 0,
        metadata: {
          price: hit.price,
          image: hit.images?.[0],
          category: hit.category,
          rating: hit.rating,
          stock: hit.stock,
        },
      }));

      return {
        results,
        total: response.estimatedTotalHits || 0,
        page: options.page || 1,
        limit: options.limit || 12,
        facets: response.facetDistribution || {},
      };

    } catch (error) {
      console.error('Meilisearch search error:', error);
      throw new Error('Search failed');
    }
  }

  async indexDocument(type: string, id: string, document: any): Promise<void> {
    try {
      const index = this.client.index(type);
      await index.addDocuments([{ ...document, id }]);
    } catch (error) {
      console.error('Meilisearch index error:', error);
      throw new Error('Indexing failed');
    }
  }

  async deleteDocument(type: string, id: string): Promise<void> {
    try {
      const index = this.client.index(type);
      await index.deleteDocument(id);
    } catch (error) {
      console.error('Meilisearch delete error:', error);
      throw new Error('Document deletion failed');
    }
  }

  async updateDocument(type: string, id: string, document: any): Promise<void> {
    try {
      const index = this.client.index(type);
      await index.updateDocuments([{ ...document, id }]);
    } catch (error) {
      console.error('Meilisearch update error:', error);
      throw new Error('Document update failed');
    }
  }

  async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
    try {
      const index = this.client.index('products');
      const response = await index.search(query, {
        limit,
        attributesToRetrieve: ['title', 'name'],
      });

      return response.hits.map((hit: any) => hit.title || hit.name);
    } catch (error) {
      console.error('Meilisearch suggestions error:', error);
      return [];
    }
  }

  // Initialize indexes
  async initializeIndexes(): Promise<void> {
    try {
      // Products index
      const productsIndex = this.client.index('products');
      await productsIndex.updateSettings({
        searchableAttributes: ['title', 'name', 'description', 'tags', 'category'],
        filterableAttributes: ['category', 'price', 'rating', 'stock', 'tags', 'isActive'],
        sortableAttributes: ['price', 'rating', 'createdAt', 'updatedAt'],
        displayedAttributes: ['*'],
        rankingRules: [
          'words',
          'typo',
          'proximity',
          'attribute',
          'sort',
          'exactness'
        ],
      });

      // Blog posts index
      const blogIndex = this.client.index('blog');
      await blogIndex.updateSettings({
        searchableAttributes: ['title', 'content', 'excerpt', 'tags', 'topic'],
        filterableAttributes: ['topic', 'status', 'author', 'tags', 'publishedAt'],
        sortableAttributes: ['publishedAt', 'likes', 'views', 'readingTime'],
        displayedAttributes: ['*'],
        rankingRules: [
          'words',
          'typo',
          'proximity',
          'attribute',
          'sort',
          'exactness'
        ],
      });

      console.log('Meilisearch indexes initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Meilisearch indexes:', error);
    }
  }
}

export const searchService = new MeilisearchService();
