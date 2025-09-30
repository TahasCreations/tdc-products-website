/**
 * Admin Insights Dashboard
 * Comprehensive analytics and insights for administrators
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
import { Calendar, Download, RefreshCw, TrendingUp, Users, ShoppingCart, DollarSign, Eye } from 'lucide-react';

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

interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  cancelledSubscriptions: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AdminInsightsPage() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [selectedSeller, setSelectedSeller] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [snapshots, setSnapshots] = useState<SnapshotData[]>([]);
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics[]>([]);
  const [competitorAnalyses, setCompetitorAnalyses] = useState<CompetitorAnalysis[]>([]);
  const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStats | null>(null);
  const [summary, setSummary] = useState<any>(null);

  // Fetch insights data
  const fetchInsightsData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        tenantId: 'admin-tenant',
        ...(selectedSeller !== 'all' && { sellerId: selectedSeller }),
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

      // Fetch competitor analyses
      const competitorsResponse = await fetch(`/api/insights/competitors?${params}`);
      const competitorsData = await competitorsResponse.json();
      setCompetitorAnalyses(competitorsData.data || []);

      // Fetch subscription stats
      const subscriptionResponse = await fetch(`/api/insights/subscriptions/stats?tenantId=admin-tenant`);
      const subscriptionData = await subscriptionResponse.json();
      setSubscriptionStats(subscriptionData.data || null);

      // Fetch summary
      const summaryResponse = await fetch(`/api/insights/snapshots/summary?${params}`);
      const summaryData = await summaryResponse.json();
      setSummary(summaryData.data || null);
    } catch (error) {
      console.error('Error fetching insights data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsightsData();
  }, [dateRange, selectedSeller]);

  // Generate revenue trend data
  const revenueTrendData = snapshots.map(snapshot => ({
    date: new Date(snapshot.snapshotDate).toLocaleDateString(),
    revenue: Number(snapshot.totalRevenue),
    orders: snapshot.totalOrders,
    conversion: snapshot.conversionRate,
  }));

  // Generate top products data
  const topProductsData = productAnalytics
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
    .map(product => ({
      name: `Product ${product.productId.slice(-4)}`,
      revenue: Number(product.revenue),
      orders: product.orders,
      conversion: product.conversionRate,
    }));

  // Generate plan distribution data
  const planDistributionData = subscriptionStats ? [
    { name: 'Free', value: subscriptionStats.totalSubscriptions - subscriptionStats.activeSubscriptions },
    { name: 'Basic', value: Math.floor(subscriptionStats.activeSubscriptions * 0.4) },
    { name: 'Pro', value: Math.floor(subscriptionStats.activeSubscriptions * 0.5) },
    { name: 'Enterprise', value: Math.floor(subscriptionStats.activeSubscriptions * 0.1) },
  ] : [];

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
          <h1 className="text-3xl font-bold">Insights Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for your platform
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <Label htmlFor="seller">Seller</Label>
              <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                <SelectTrigger>
                  <SelectValue placeholder="Select seller" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sellers</SelectItem>
                  <SelectItem value="seller-1">Seller 1</SelectItem>
                  <SelectItem value="seller-2">Seller 2</SelectItem>
                </SelectContent>
              </Select>
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
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Revenue and orders over time</CardDescription>
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
                <CardDescription>Best performing products by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProductsData}>
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
                  <BarChart data={topProductsData}>
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
                  <BarChart data={topProductsData}>
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
        </TabsContent>

        {/* Competitors Tab */}
        <TabsContent value="competitors" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Market Share Comparison</CardTitle>
                <CardDescription>Competitor market share</CardDescription>
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
                <CardDescription>Average prices by competitor</CardDescription>
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
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
                <CardDescription>Subscription plan distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={planDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {planDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Stats</CardTitle>
                <CardDescription>Key subscription metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Subscriptions:</span>
                    <span className="font-bold">{subscriptionStats?.totalSubscriptions || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Subscriptions:</span>
                    <span className="font-bold text-green-600">{subscriptionStats?.activeSubscriptions || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trial Subscriptions:</span>
                    <span className="font-bold text-blue-600">{subscriptionStats?.trialSubscriptions || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancelled Subscriptions:</span>
                    <span className="font-bold text-red-600">{subscriptionStats?.cancelledSubscriptions || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Revenue:</span>
                    <span className="font-bold">₺{Number(subscriptionStats?.totalRevenue || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Revenue:</span>
                    <span className="font-bold">₺{Number(subscriptionStats?.monthlyRevenue || 0).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

