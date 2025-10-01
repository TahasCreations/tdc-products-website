import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '../../../../lib/search/meilisearch';
import { trackEvent, AnalyticsEvent } from '../../../../lib/analytics/events';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters, sort, page, limit, storeId } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Track search event
    trackEvent(AnalyticsEvent.SEARCH_SUBMIT, {
      query,
      filters,
      sort,
      storeId,
    });

    // Perform search
    const results = await searchService.search({
      query: query.trim(),
      filters,
      sort: sort || 'relevance',
      page: page || 1,
      limit: limit || 12,
      storeId,
    });

    return NextResponse.json(results);

  } catch (error) {
    console.error('Search query error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const rating = searchParams.get('rating');
    const inStock = searchParams.get('inStock');
    const sort = searchParams.get('sort');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Build filters
    const filters: any = {};
    if (category) filters.category = category;
    if (priceMin) filters.priceMin = parseFloat(priceMin);
    if (priceMax) filters.priceMax = parseFloat(priceMax);
    if (rating) filters.rating = parseFloat(rating);
    if (inStock === 'true') filters.inStock = true;

    // Track search event
    trackEvent(AnalyticsEvent.SEARCH_SUBMIT, {
      query,
      filters,
      sort,
    });

    // Perform search
    const results = await searchService.search({
      query,
      filters,
      sort: sort || 'relevance',
      page,
      limit,
    });

    return NextResponse.json(results);

  } catch (error) {
    console.error('Search query error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
