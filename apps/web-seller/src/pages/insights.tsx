/**
 * Seller Insights Dashboard
 * Analytics and insights for individual sellers
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Calendar, Download, RefreshCw, TrendingUp, Users, ShoppingCart, DollarSign, Eye, Star } from 'lucide-react';

interface SnapshotData {
  id: string;
  snapshotDate: string;
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  sessionDuration: number;
  topProducts: any[];
  topCategories: any[];
  topPriceRanges: any[];
  topTags: any[];
}

interface ProductAnalytics {
  id: string;
  productId: string;
  views: number;
  clicks: number;
  orders: number;
  revenue: number;
  conversionRate: number;
  averagePrice: number;
  topTags: string[];
  categoryRank: number;
  overallRank: number;
  searchRank: number;
}

interface CompetitorAnalysis {
  id: string;
  competitorName: string;
  competitorType: string;
  marketShare: number;
  totalProducts: number;
  averagePrice: number;
  commonProducts: number;
  priceAdvantage: number;
  trafficEstimate: number;
  conversionRate: number;
  customerSatisfaction: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function SellerInsightsPage() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [snapshots, setSnapshots] = useState<SnapshotData[]>([]);
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics[]>([]);
  const [competitorAnalyses, setCompetitorAnalyses] = useState<CompetitorAnalysis[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [topCategories, setTopCategories] = useState<any[]>([]);
  const [topPriceRanges, setTopPriceRanges] = useState<any[]>([]);
  const [topTags, setTopTags] = useState<any[]>([]);

  // Mock seller ID - in real app, this would come from auth context
  const sellerId = 'seller-123';

  // Fetch insights data
  const fetchInsightsData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        tenantId: 'seller-tenant',
        sellerId: sellerId,
        start: dateRange.start,
        end: dateRange.end,
      });

      // Fetch snapshots
      const snapshotsResponse = await fetch(`/api/insights/snapshots?${params}`);
      const snapshotsData = await snapshotsResponse.json();
      setSnapshots(snapshotsData.data || []);

      // Fetch product analytics
      const analyticsResponse = await fetch(`/api/insights/products/analytics?${params}`);
      const analyticsData = await analyticsResponse.json();
      setProductAnalytics(analyticsData.data || []);

      // Fetch competitor analyses (Pro feature)
      const competitorsResponse = await fetch(`/api/insights/competitors?${params}`);
      const competitorsData = await competitorsResponse.json();
      setCompetitorAnalyses(competitorsData.data || []);

      // Fetch summary
      const summaryResponse = await fetch(`/api/insights/snapshots/summary?${params}`);
      const summaryData = await summaryResponse.json();
      setSummary(summaryData.data || null);

      // Fetch top products
      const topProductsResponse = await fetch(`/api/insights/products/top?${params}`);
      const topProductsData = await topProductsResponse.json();
      setTopProducts(topProductsData.data || []);

      // Fetch top categories
      const topCategoriesResponse = await fetch(`/api/insights/products/categories?${params}`);
      const topCategoriesData = await topCategoriesResponse.json();
      setTopCategories(topCategoriesData.data || []);

      // Fetch top price ranges
      const topPriceRangesResponse = await fetch(`/api/insights/products/price-ranges?${params}`);
      const topPriceRangesData = await topPriceRangesResponse.json();
      setTopPriceRanges(topPriceRangesData.data || []);

      // Fetch top tags
      const topTagsResponse = await fetch(`/api/insights/products/tags?${params}`);
      const topTagsData = await topTagsResponse.json();
      setTopTags(topTagsData.data || []);
    } catch (error) {
      console.error('Error fetching insights data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsightsData();
  }, [dateRange]);

  // Generate revenue trend data
  const revenueTrendData = snapshots.map(snapshot => ({
    date: new Date(snapshot.snapshotDate).toLocaleDateString(),
    revenue: Number(snapshot.totalRevenue),
    orders: snapshot.totalOrders,
    conversion: snapshot.conversionRate,
  }));

  // Generate product performance data
  const productPerformanceData = productAnalytics
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
    .map(product => ({
      name: `Product ${product.productId.slice(-4)}`,
      revenue: Number(product.revenue),
      orders: product.orders,
      conversion: product.conversionRate,
      views: product.views,
      clicks: product.clicks,
    }));

  // Generate category performance data
  const categoryPerformanceData = topCategories.map(category => ({
    name: category.name,
    revenue: category.revenue,
    orders: category.orders,
    products: category.products,
  }));

  // Generate price range performance data
  const priceRangeData = topPriceRanges.map(range => ({
    name: range.range,
    revenue: range.revenue,
    orders: range.orders,
    products: range.products,
  }));

  // Generate tag performance data
  const tagPerformanceData = topTags.map(tag => ({
    name: tag.name,
    revenue: tag.revenue,
    orders: tag.orders,
    products: tag.products,
  }));

  // Generate competitor comparison data
  const competitorComparisonData = competitorAnalyses.map(competitor => ({
    name: competitor.competitorName,
    marketShare: competitor.marketShare,
    products: competitor.totalProducts,
    avgPrice: Number(competitor.averagePrice),
    satisfaction: competitor.customerSatisfaction,
  }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Insights</h1>
          <p className="text-muted-foreground">
            Analytics and insights for your products and sales
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchInsightsData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₺{Number(summary.totalRevenue).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.totalOrders.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +15.3% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.averageConversionRate?.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.activeProducts.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +8.2% from last month
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Your revenue and orders over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Your best performing products</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Revenue by product</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
                <CardDescription>Product conversion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversion" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Product Rankings */}
          <Card>
            <CardHeader>
              <CardTitle>Product Rankings</CardTitle>
              <CardDescription>How your products rank in different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productAnalytics.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">Product {product.productId.slice(-4)}</p>
                        <p className="text-sm text-muted-foreground">
                          Revenue: ₺{Number(product.revenue).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Category Rank: #{product.categoryRank || 'N/A'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Overall Rank: #{product.overallRank || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Revenue by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Price Range Performance</CardTitle>
                <CardDescription>Revenue by price range</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priceRangeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tag Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Tag Performance</CardTitle>
              <CardDescription>Revenue by product tags</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tagPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitors Tab */}
        <TabsContent value="competitors" className="space-y-4">
          {competitorAnalyses.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Market Share Comparison</CardTitle>
                  <CardDescription>Your market share vs competitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={competitorComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="marketShare" fill="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Price Comparison</CardTitle>
                  <CardDescription>Average prices vs competitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={competitorComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgPrice" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
                <CardDescription>Pro feature - Upgrade to access competitor insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Pro Feature</h3>
                  <p className="text-muted-foreground mb-4">
                    Competitor analysis is available for Pro subscribers. Upgrade your plan to access detailed competitor insights.
                  </p>
                  <Button>Upgrade to Pro</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

