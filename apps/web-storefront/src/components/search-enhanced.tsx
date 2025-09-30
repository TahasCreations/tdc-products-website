/**
 * Enhanced Search Component with A/B Testing
 * Advanced search with embedding and reranking support
 */

import React, { useState, useEffect } from 'react';
import { Search, Filter, BarChart3, Zap, Brain, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchResult {
  id: string;
  content: {
    title: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    tags: string[];
    images: string[];
    _score?: number;
    _rerankingScore?: number;
    _rerankingRank?: number;
  };
  embedding?: number[];
  embeddingModel?: string;
}

interface SearchResponse {
  success: boolean;
  data: {
    hits: SearchResult[];
    total: number;
    took: number;
    searchMethod?: 'text' | 'vector' | 'hybrid';
    embeddingUsed?: boolean;
    rerankingUsed?: boolean;
    rerankingScores?: Array<{ id: string; score: number }>;
  };
  metadata: {
    searchMethod: string;
    embeddingUsed: boolean;
    rerankingUsed: boolean;
    responseTime: number;
  };
}

interface ABTestResult {
  variantA: {
    variant: 'A';
    method: 'text' | 'vector' | 'hybrid';
    results: SearchResponse['data'];
    performance: {
      responseTime: number;
      relevanceScore: number;
    };
  };
  variantB: {
    variant: 'B';
    method: 'text' | 'vector' | 'hybrid';
    results: SearchResponse['data'];
    performance: {
      responseTime: number;
      relevanceScore: number;
    };
  };
  recommendation: 'A' | 'B' | 'tie';
  testResults: {
    testName: string;
    query: string;
    timestamp: Date;
    winner: 'A' | 'B' | 'tie';
    performanceGap: number;
  };
}

interface ComparisonResult {
  query: string;
  comparison: {
    text: {
      results: SearchResponse['data'];
      method: string;
      responseTime: number;
      hitCount: number;
    };
    vector: {
      results: SearchResponse['data'];
      method: string;
      responseTime: number;
      hitCount: number;
    };
    hybrid: {
      results: SearchResponse['data'];
      method: string;
      responseTime: number;
      hitCount: number;
    };
  };
  summary: {
    fastest: string;
    mostRelevant: string;
  };
}

export default function EnhancedSearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchMethod, setSearchMethod] = useState<'text' | 'vector' | 'hybrid'>('text');
  const [useReranking, setUseReranking] = useState(false);
  const [abTestResults, setABTestResults] = useState<ABTestResult | null>(null);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult | null>(null);
  const [showABTest, setShowABTest] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: 0, max: 10000 },
    brand: '',
  });

  // Search products
  const searchProducts = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/search/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          tenantId: 'storefront-tenant',
          useEmbedding: searchMethod !== 'text',
          useReranking: useReranking,
          hybridSearch: searchMethod === 'hybrid',
          ...filters,
        }),
      });

      const data: SearchResponse = await response.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Run A/B test
  const runABTest = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/search/ab-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          tenantId: 'storefront-tenant',
          testName: `ab_test_${Date.now()}`,
        }),
      });

      const data: { success: boolean; data: ABTestResult } = await response.json();
      if (data.success) {
        setABTestResults(data.data);
        setShowABTest(true);
      }
    } catch (error) {
      console.error('A/B test error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Compare search methods
  const compareMethods = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/search/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          tenantId: 'storefront-tenant',
        }),
      });

      const data: { success: boolean; data: ComparisonResult } = await response.json();
      if (data.success) {
        setComparisonResults(data.data);
        setShowComparison(true);
      }
    } catch (error) {
      console.error('Comparison error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search on Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchProducts();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Enhanced Search</h1>
        <p className="text-muted-foreground">
          Advanced search with AI-powered embeddings and reranking
        </p>
      </div>

      {/* Search Input */}
      <Card>
        <CardHeader>
          <CardTitle>Search Products</CardTitle>
          <CardDescription>
            Use AI-powered search with embeddings and reranking for better results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg"
              />
            </div>
            <Button onClick={searchProducts} disabled={loading || !query.trim()}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Search Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search-method">Search Method</Label>
              <Select value={searchMethod} onValueChange={(value: any) => setSearchMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Search</SelectItem>
                  <SelectItem value="vector">Vector Search</SelectItem>
                  <SelectItem value="hybrid">Hybrid Search</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="reranking"
                checked={useReranking}
                onCheckedChange={setUseReranking}
              />
              <Label htmlFor="reranking">Use Reranking</Label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={runABTest} disabled={loading}>
                <BarChart3 className="h-4 w-4 mr-2" />
                A/B Test
              </Button>
              <Button variant="outline" onClick={compareMethods} disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Compare
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Found {results.total} products in {results.took}ms
              {results.searchMethod && ` using ${results.searchMethod} search`}
              {results.embeddingUsed && ' with embeddings'}
              {results.rerankingUsed && ' and reranking'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.hits.map((result, index) => (
                <Card key={result.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {result.content.images?.[0] ? (
                      <img
                        src={result.content.images[0]}
                        alt={result.content.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground">No Image</div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold line-clamp-2">{result.content.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {result.content.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">
                          ₺{result.content.price.toLocaleString()}
                        </span>
                        <Badge variant="secondary">{result.content.brand}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {result.content.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {result.content._rerankingScore && (
                        <div className="text-xs text-muted-foreground">
                          Rerank Score: {result.content._rerankingScore.toFixed(3)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* A/B Test Results */}
      {showABTest && abTestResults && (
        <Card>
          <CardHeader>
            <CardTitle>A/B Test Results</CardTitle>
            <CardDescription>
              Comparing {abTestResults.variantA.method} vs {abTestResults.variantB.method} search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="variant-a" className="space-y-4">
              <TabsList>
                <TabsTrigger value="variant-a">
                  Variant A ({abTestResults.variantA.method})
                </TabsTrigger>
                <TabsTrigger value="variant-b">
                  Variant B ({abTestResults.variantB.method})
                </TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
              </TabsList>

              <TabsContent value="variant-a">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{abTestResults.variantA.results.hits.length}</div>
                      <div className="text-sm text-muted-foreground">Results</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{abTestResults.variantA.performance.responseTime}ms</div>
                      <div className="text-sm text-muted-foreground">Response Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {(abTestResults.variantA.performance.relevanceScore * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Relevance</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {abTestResults.variantA.results.hits.slice(0, 4).map((result) => (
                      <Card key={result.id}>
                        <CardContent className="p-4">
                          <h4 className="font-semibold">{result.content.title}</h4>
                          <p className="text-sm text-muted-foreground">{result.content.brand}</p>
                          <p className="font-bold">₺{result.content.price.toLocaleString()}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="variant-b">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{abTestResults.variantB.results.hits.length}</div>
                      <div className="text-sm text-muted-foreground">Results</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{abTestResults.variantB.performance.responseTime}ms</div>
                      <div className="text-sm text-muted-foreground">Response Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {(abTestResults.variantB.performance.relevanceScore * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Relevance</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {abTestResults.variantB.results.hits.slice(0, 4).map((result) => (
                      <Card key={result.id}>
                        <CardContent className="p-4">
                          <h4 className="font-semibold">{result.content.title}</h4>
                          <p className="text-sm text-muted-foreground">{result.content.brand}</p>
                          <p className="font-bold">₺{result.content.price.toLocaleString()}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comparison">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">
                      Winner: Variant {abTestResults.recommendation}
                    </h3>
                    <p className="text-muted-foreground">
                      Performance Gap: {(abTestResults.testResults.performanceGap * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Variant A ({abTestResults.variantA.method})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Results:</span>
                            <span>{abTestResults.variantA.results.hits.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Response Time:</span>
                            <span>{abTestResults.variantA.performance.responseTime}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Relevance:</span>
                            <span>{(abTestResults.variantA.performance.relevanceScore * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Variant B ({abTestResults.variantB.method})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Results:</span>
                            <span>{abTestResults.variantB.results.hits.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Response Time:</span>
                            <span>{abTestResults.variantB.performance.responseTime}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Relevance:</span>
                            <span>{(abTestResults.variantB.performance.relevanceScore * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Comparison Results */}
      {showComparison && comparisonResults && (
        <Card>
          <CardHeader>
            <CardTitle>Search Method Comparison</CardTitle>
            <CardDescription>
              Comparing text, vector, and hybrid search methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Fastest</div>
                    <div className="font-bold">{comparisonResults.summary.fastest}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Most Relevant</div>
                    <div className="font-bold">{comparisonResults.summary.mostRelevant}</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(comparisonResults.comparison).map(([method, data]) => (
                  <Card key={method}>
                    <CardHeader>
                      <CardTitle className="capitalize">{method} Search</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Results:</span>
                          <span>{data.hitCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Response Time:</span>
                          <span>{data.responseTime}ms</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Top Results:
                        </div>
                        <div className="space-y-1">
                          {data.results.hits.slice(0, 3).map((result) => (
                            <div key={result.id} className="text-xs">
                              {result.content.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

