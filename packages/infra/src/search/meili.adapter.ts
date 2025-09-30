import { 
  SearchPort, 
  SearchDocument, 
  SearchQuery, 
  SearchResult, 
  IndexOptions, 
  IndexResult 
} from '@tdc/domain';
import { validateEnv } from '@tdc/config';

export class MeiliAdapter implements SearchPort {
  private readonly meiliClient: any;
  private readonly apiKey: string;
  private readonly host: string;

  constructor() {
    const env = validateEnv();
    this.host = env.MEILI_HOST || 'http://localhost:7700';
    this.apiKey = env.MEILI_API_KEY || '';
    
    // MeiliSearch client would be imported here
    // import { MeiliSearch } from 'meilisearch';
    // this.meiliClient = new MeiliSearch({ host: this.host, apiKey: this.apiKey });
    
    // For now, we'll create a mock client
    this.meiliClient = {
      index: (indexName: string) => ({
        addDocuments: async (documents: any[]) => ({ taskUid: Date.now() }),
        search: async (query: string, options: any) => ({
          hits: [],
          totalHits: 0,
          processingTimeMs: 0,
          facetDistribution: {}
        }),
        deleteDocument: async (id: string) => ({ taskUid: Date.now() }),
        updateDocuments: async (documents: any[]) => ({ taskUid: Date.now() }),
        getStats: async () => ({ numberOfDocuments: 0, isIndexing: false }),
        delete: async () => ({ taskUid: Date.now() })
      }),
      createIndex: async (uid: string, options: any) => ({ taskUid: Date.now() }),
      deleteIndex: async (uid: string) => ({ taskUid: Date.now() }),
      health: async () => ({ status: 'available' })
    };
  }

  async indexDocument(document: SearchDocument): Promise<IndexResult> {
    try {
      const index = this.meiliClient.index(document.index);
      const result = await index.addDocuments([document.content]);
      
      return {
        success: true,
        index: document.index,
        message: `Document indexed with task ID: ${result.taskUid}`
      };
    } catch (error) {
      return {
        success: false,
        index: document.index,
        message: error instanceof Error ? error.message : 'Indexing failed'
      };
    }
  }

  async indexDocuments(documents: SearchDocument[]): Promise<IndexResult> {
    try {
      if (documents.length === 0) {
        return {
          success: true,
          index: '',
          message: 'No documents to index'
        };
      }

      const indexName = documents[0].index;
      const index = this.meiliClient.index(indexName);
      const contents = documents.map(doc => doc.content);
      
      const result = await index.addDocuments(contents);
      
      return {
        success: true,
        index: indexName,
        message: `Indexed ${documents.length} documents with task ID: ${result.taskUid}`
      };
    } catch (error) {
      return {
        success: false,
        index: documents[0]?.index || '',
        message: error instanceof Error ? error.message : 'Bulk indexing failed'
      };
    }
  }

  async search(query: SearchQuery): Promise<SearchResult> {
    try {
      const index = this.meiliClient.index(query.index);
      
      const searchOptions = {
        q: query.query,
        limit: query.limit || 20,
        offset: query.offset || 0,
        sort: query.sort?.map(s => `${s.field}:${s.direction}`),
        facetsDistribution: query.facets,
        filter: query.filters ? this.buildFilter(query.filters) : undefined,
      };

      const result = await index.search(query.query, searchOptions);
      
      const hits: SearchDocument[] = result.hits.map((hit: any) => ({
        id: hit.id || hit.objectID,
        index: query.index,
        content: hit,
        createdAt: new Date(hit.createdAt || Date.now()),
        updatedAt: new Date(hit.updatedAt || Date.now())
      }));

      return {
        hits,
        total: result.totalHits || 0,
        facets: result.facetDistribution,
        took: result.processingTimeMs || 0
      };
    } catch (error) {
      throw new Error(`MeiliSearch query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteDocument(index: string, id: string): Promise<IndexResult> {
    try {
      const meiliIndex = this.meiliClient.index(index);
      const result = await meiliIndex.deleteDocument(id);
      
      return {
        success: true,
        index,
        message: `Document deleted with task ID: ${result.taskUid}`
      };
    } catch (error) {
      return {
        success: false,
        index,
        message: error instanceof Error ? error.message : 'Document deletion failed'
      };
    }
  }

  async updateDocument(document: SearchDocument): Promise<IndexResult> {
    try {
      const index = this.meiliClient.index(document.index);
      const result = await index.updateDocuments([document.content]);
      
      return {
        success: true,
        index: document.index,
        message: `Document updated with task ID: ${result.taskUid}`
      };
    } catch (error) {
      return {
        success: false,
        index: document.index,
        message: error instanceof Error ? error.message : 'Document update failed'
      };
    }
  }

  async createIndex(options: IndexOptions): Promise<IndexResult> {
    try {
      const result = await this.meiliClient.createIndex(options.index, options.settings);
      
      return {
        success: true,
        index: options.index,
        message: `Index created with task ID: ${result.taskUid}`
      };
    } catch (error) {
      return {
        success: false,
        index: options.index,
        message: error instanceof Error ? error.message : 'Index creation failed'
      };
    }
  }

  async deleteIndex(index: string): Promise<IndexResult> {
    try {
      const result = await this.meiliClient.deleteIndex(index);
      
      return {
        success: true,
        index,
        message: `Index deleted with task ID: ${result.taskUid}`
      };
    } catch (error) {
      return {
        success: false,
        index,
        message: error instanceof Error ? error.message : 'Index deletion failed'
      };
    }
  }

  async getIndexStats(index: string): Promise<Record<string, any>> {
    try {
      const meiliIndex = this.meiliClient.index(index);
      const stats = await meiliIndex.getStats();
      
      return {
        numberOfDocuments: stats.numberOfDocuments || 0,
        isIndexing: stats.isIndexing || false,
        fieldDistribution: stats.fieldDistribution || {},
        lastUpdate: stats.lastUpdate || null
      };
    } catch (error) {
      throw new Error(`Failed to get index stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const health = await this.meiliClient.health();
      return health.status === 'available';
    } catch (error) {
      return false;
    }
  }

  private buildFilter(filters: Record<string, any>): string {
    // Convert filters to MeiliSearch filter format
    const filterParts: string[] = [];
    
    for (const [field, value] of Object.entries(filters)) {
      if (Array.isArray(value)) {
        filterParts.push(`${field} IN [${value.map(v => `"${v}"`).join(', ')}]`);
      } else if (typeof value === 'string') {
        filterParts.push(`${field} = "${value}"`);
      } else if (typeof value === 'number') {
        filterParts.push(`${field} = ${value}`);
      } else if (typeof value === 'boolean') {
        filterParts.push(`${field} = ${value}`);
      }
    }
    
    return filterParts.join(' AND ');
  }
}



