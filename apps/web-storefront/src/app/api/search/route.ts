import { NextRequest, NextResponse } from 'next/server';
import { container } from '@tdc/infra';
import { SearchQuery } from '@tdc/domain';
import { z } from 'zod';

// Validation schema
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validatedData = SearchRequestSchema.parse(body);
    
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

    return NextResponse.json({
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
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Search query failed',
      },
      { status: 400 }
    );
  }
}


