/**
 * Ad Campaign Reports Dashboard Component
 * Comprehensive reporting and analytics for ad campaigns
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  ShoppingCart, 
  DollarSign,
  Target,
  Users,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface CampaignReport {
  campaignId: string;
  campaignName: string;
  dateRange: {
    start: string;
    end: string;
  };
  summary: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    revenue: number;
    ctr: number;
    cpc: number;
    cpm: number;
    cpa: number;
    roas: number;
  };
  insights: string[];
  recommendations: string[];
  additionalData?: {
    topKeywords?: string[];
    topLocations?: string[];
    deviceBreakdown?: Record<string, number>;
    hourlyBreakdown?: Record<string, number>;
  };
}

interface SlotReport {
  slotType: string;
  totalImpressions: number;
  totalClicks: number;
  totalRevenue: number;
  averageCtr: number;
  averageCpc: number;
}

interface AdCampaignReportsProps {
  tenantId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AdCampaignReports({ tenantId }: AdCampaignReportsProps) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [report, setReport] = useState<CampaignReport | null>(null);
  const [slotReports, setSlotReports] = useState<SlotReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCampaigns();
    loadSlotReports();
  }, [tenantId]);

  useEffect(() => {
    if (selectedCampaign) {
      loadCampaignReport(selectedCampaign);
    }
  }, [selectedCampaign, dateRange]);

  const loadCampaigns = async () => {
    try {
      const response = await fetch(`/api/ad-campaign/campaigns?tenantId=${tenantId}&limit=100`);
      const data = await response.json();
      
      if (data.success) {
        setCampaigns(data.data.campaigns);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
      setError('Failed to load campaigns');
    }
  };

  const loadCampaignReport = async (campaignId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/ad-campaign/campaigns/${campaignId}/reports?dateFrom=${dateRange.start}&dateTo=${dateRange.end}`
      );
      const data = await response.json();
      
      if (data.success) {
        setReport(data.data);
      } else {
        setError(data.error || 'Failed to load campaign report');
      }
    } catch (error) {
      console.error('Error loading campaign report:', error);
      setError('Failed to load campaign report');
    } finally {
      setLoading(false);
    }
  };

  const loadSlotReports = async () => {
    try {
      const slotTypes = [
        'SEARCH_TOP', 'SEARCH_SIDE', 'SEARCH_BOTTOM',
        'CATEGORY_TOP', 'CATEGORY_SIDE', 'PRODUCT_TOP',
        'PRODUCT_SIDE', 'HOME_BANNER', 'HOME_SIDEBAR'
      ];

      const reports = await Promise.all(
        slotTypes.map(async (slotType) => {
          const response = await fetch(
            `/api/ad-campaign/slots/${slotType}/statistics?tenantId=${tenantId}&dateFrom=${dateRange.start}&dateTo=${dateRange.end}`
          );
          const data = await response.json();
          
          if (data.success) {
            return {
              slotType,
              ...data.data
            };
          }
          return null;
        })
      );

      setSlotReports(reports.filter(Boolean) as SlotReport[]);
    } catch (error) {
      console.error('Error loading slot reports:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`;
  };

  const getPerformanceColor = (value: number, type: 'ctr' | 'cpc' | 'roas') => {
    switch (type) {
      case 'ctr':
        return value > 5 ? 'text-green-600' : value > 2 ? 'text-yellow-600' : 'text-red-600';
      case 'cpc':
        return value < 1 ? 'text-green-600' : value < 2 ? 'text-yellow-600' : 'text-red-600';
      case 'roas':
        return value > 4 ? 'text-green-600' : value > 2 ? 'text-yellow-600' : 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const generateChartData = () => {
    if (!report) return [];

    const days = Math.ceil((new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (1000 * 60 * 60 * 24));
    const data = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(dateRange.start);
      date.setDate(date.getDate() + i);
      
      // Mock data - in real implementation, this would come from the API
      data.push({
        date: date.toISOString().split('T')[0],
        impressions: Math.floor(Math.random() * 1000) + 500,
        clicks: Math.floor(Math.random() * 100) + 50,
        conversions: Math.floor(Math.random() * 10) + 5,
        spend: Math.floor(Math.random() * 500) + 200,
        revenue: Math.floor(Math.random() * 1000) + 500
      });
    }

    return data;
  };

  const generateDeviceData = () => {
    if (!report?.additionalData?.deviceBreakdown) {
      return [
        { name: 'Mobile', value: 60, color: '#0088FE' },
        { name: 'Desktop', value: 30, color: '#00C49F' },
        { name: 'Tablet', value: 10, color: '#FFBB28' }
      ];
    }

    return Object.entries(report.additionalData.deviceBreakdown).map(([device, value], index) => ({
      name: device,
      value,
      color: COLORS[index % COLORS.length]
    }));
  };

  const generateSlotData = () => {
    return slotReports.map(slot => ({
      name: slot.slotType.replace('_', ' '),
      impressions: slot.totalImpressions,
      clicks: slot.totalClicks,
      revenue: slot.totalRevenue,
      ctr: slot.averageCtr
    }));
  };

  const exportReport = () => {
    if (!report) return;

    const csvContent = [
      ['Metric', 'Value'],
      ['Campaign', report.campaignName],
      ['Date Range', `${report.dateRange.start} to ${report.dateRange.end}`],
      ['Impressions', report.summary.impressions.toString()],
      ['Clicks', report.summary.clicks.toString()],
      ['Conversions', report.summary.conversions.toString()],
      ['Spend', report.summary.spend.toString()],
      ['Revenue', report.summary.revenue.toString()],
      ['CTR', report.summary.ctr.toString()],
      ['CPC', report.summary.cpc.toString()],
      ['CPM', report.summary.cpm.toString()],
      ['CPA', report.summary.cpa.toString()],
      ['ROAS', report.summary.roas.toString()]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-report-${report.campaignId}-${dateRange.start}-${dateRange.end}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ad Campaign Reports</h1>
          <p className="text-gray-600">Comprehensive analytics and performance insights</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => loadCampaigns()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {report && (
            <Button onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="campaign">Campaign</Label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => selectedCampaign && loadCampaignReport(selectedCampaign)} className="w-full">
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Generating report...</p>
          </div>
        </div>
      )}

      {report && (
        <div className="space-y-6">
          {/* Campaign Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(report.summary.impressions)}</div>
                <p className="text-xs text-muted-foreground">
                  Total ad views
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(report.summary.clicks)}</div>
                <p className="text-xs text-muted-foreground">
                  Total clicks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(report.summary.conversions)}</div>
                <p className="text-xs text-muted-foreground">
                  Total conversions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spend</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(report.summary.spend)}</div>
                <p className="text-xs text-muted-foreground">
                  Total ad spend
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(report.summary.revenue)}</div>
                <p className="text-xs text-muted-foreground">
                  Total revenue
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getPerformanceColor(report.summary.ctr, 'ctr')}`}>
                  {formatPercentage(report.summary.ctr)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Clicks per impression
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Cost Per Click</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getPerformanceColor(report.summary.cpc, 'cpc')}`}>
                  {formatCurrency(report.summary.cpc)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average cost per click
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Cost Per Mille</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(report.summary.cpm)}</div>
                <p className="text-xs text-muted-foreground">
                  Cost per 1000 impressions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Return on Ad Spend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getPerformanceColor(report.summary.roas, 'roas')}`}>
                  {report.summary.roas.toFixed(2)}x
                </div>
                <p className="text-xs text-muted-foreground">
                  Revenue per ad spend
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="slots">Slots</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={generateChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="impressions" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="clicks" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                      <Area type="monotone" dataKey="conversions" stackId="3" stroke="#ffc658" fill="#ffc658" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue vs Spend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={generateChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="spend" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={generateDeviceData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {generateDeviceData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="slots" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Slot Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={generateSlotData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="impressions" fill="#8884d8" />
                      <Bar dataKey="clicks" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Insights and Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.insights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Slot Reports Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Slot Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Slot Type</th>
                  <th className="text-right p-2">Impressions</th>
                  <th className="text-right p-2">Clicks</th>
                  <th className="text-right p-2">CTR</th>
                  <th className="text-right p-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {slotReports.map((slot, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{slot.slotType.replace('_', ' ')}</td>
                    <td className="p-2 text-right">{formatNumber(slot.totalImpressions)}</td>
                    <td className="p-2 text-right">{formatNumber(slot.totalClicks)}</td>
                    <td className="p-2 text-right">{formatPercentage(slot.averageCtr)}</td>
                    <td className="p-2 text-right">{formatCurrency(slot.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

