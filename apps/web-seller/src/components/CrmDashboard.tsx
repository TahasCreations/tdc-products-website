/**
 * Seller CRM Dashboard Component
 * Manages customer segments, campaigns, and communication
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
  Users, 
  Mail, 
  MessageSquare, 
  Phone, 
  Plus, 
  Play, 
  Pause, 
  Square,
  BarChart3,
  Target,
  Send,
  Edit,
  Trash2,
  Eye,
  Filter,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Segment {
  id: string;
  name: string;
  description?: string;
  segmentType: string;
  status: string;
  customerCount: number;
  isDynamic: boolean;
  updateFrequency: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Campaign {
  id: string;
  name: string;
  description?: string;
  campaignType: string;
  status: string;
  messageType: string;
  deliveryMethod: string;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalConverted: number;
  deliveryRate?: number;
  openRate?: number;
  clickRate?: number;
  conversionRate?: number;
  createdAt: string;
  updatedAt: string;
}

interface Template {
  id: string;
  name: string;
  description?: string;
  templateType: string;
  messageType: string;
  deliveryMethod: string;
  subject?: string;
  content: string;
  variables: string[];
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CrmDashboardProps {
  sellerId: string;
  tenantId: string;
}

export function CrmDashboard({ sellerId, tenantId }: CrmDashboardProps) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Form states
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    loadCrmData();
  }, [sellerId, tenantId]);

  const loadCrmData = async () => {
    try {
      setLoading(true);
      const [segmentsRes, campaignsRes, templatesRes] = await Promise.all([
        fetch(`/api/crm/segments?tenantId=${tenantId}&sellerId=${sellerId}`),
        fetch(`/api/crm/campaigns?tenantId=${tenantId}&sellerId=${sellerId}`),
        fetch(`/api/crm/templates?tenantId=${tenantId}&sellerId=${sellerId}`)
      ]);

      if (segmentsRes.ok) {
        const segmentsData = await segmentsRes.json();
        setSegments(segmentsData.data.segments);
      }

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData.data.campaigns);
      }

      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        setTemplates(templatesData.data);
      }
    } catch (error) {
      console.error('Error loading CRM data:', error);
      setError('Failed to load CRM data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSegment = async (segmentData: any) => {
    try {
      const response = await fetch('/api/crm/segments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...segmentData,
          tenantId,
          sellerId
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Segment created successfully');
        setShowSegmentModal(false);
        loadCrmData();
      } else {
        setError(result.error || 'Failed to create segment');
      }
    } catch (error) {
      console.error('Create segment error:', error);
      setError('Failed to create segment');
    }
  };

  const handleCreateCampaign = async (campaignData: any) => {
    try {
      const response = await fetch('/api/crm/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...campaignData,
          tenantId,
          sellerId
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Campaign created successfully');
        setShowCampaignModal(false);
        loadCrmData();
      } else {
        setError(result.error || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Create campaign error:', error);
      setError('Failed to create campaign');
    }
  };

  const handleCreateTemplate = async (templateData: any) => {
    try {
      const response = await fetch('/api/crm/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...templateData,
          tenantId,
          sellerId
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Template created successfully');
        setShowTemplateModal(false);
        loadCrmData();
      } else {
        setError(result.error || 'Failed to create template');
      }
    } catch (error) {
      console.error('Create template error:', error);
      setError('Failed to create template');
    }
  };

  const handleCampaignAction = async (campaignId: string, action: string) => {
    try {
      const response = await fetch(`/api/crm/campaigns/${campaignId}/${action}`, {
        method: 'POST'
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(`Campaign ${action}ed successfully`);
        loadCrmData();
      } else {
        setError(result.error || `Failed to ${action} campaign`);
      }
    } catch (error) {
      console.error(`${action} campaign error:`, error);
      setError(`Failed to ${action} campaign`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'RUNNING':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PAUSED':
      case 'SCHEDULED':
        return 'bg-yellow-100 text-yellow-800';
      case 'DRAFT':
      case 'PENDING_APPROVAL':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'RUNNING':
        return <CheckCircle className="h-4 w-4" />;
      case 'PAUSED':
        return <Pause className="h-4 w-4" />;
      case 'SCHEDULED':
        return <Clock className="h-4 w-4" />;
      case 'DRAFT':
        return <Edit className="h-4 w-4" />;
      case 'CANCELLED':
      case 'FAILED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading CRM data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
          <p className="text-gray-600">Manage customer segments, campaigns, and communication</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => loadCrmData()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto pl-3"
            >
              <XCircle className="h-5 w-5 text-red-400" />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto pl-3"
            >
              <XCircle className="h-5 w-5 text-green-400" />
            </button>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Segments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{segments.length}</div>
            <p className="text-xs text-muted-foreground">
              Customer segments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.status === 'RUNNING').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(campaigns.reduce((sum, c) => sum + c.totalSent, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Messages sent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">
              Communication templates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Segments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Recent Segments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {segments.slice(0, 5).map(segment => (
                    <div key={segment.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{segment.name}</p>
                        <p className="text-sm text-gray-600">{segment.customerCount} customers</p>
                      </div>
                      <Badge className={getStatusColor(segment.status)}>
                        {segment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Recent Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {campaigns.slice(0, 5).map(campaign => (
                    <div key={campaign.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatNumber(campaign.totalSent)} sent, {formatPercentage(campaign.openRate || 0)} open rate
                        </p>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Segments Tab */}
        <TabsContent value="segments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Customer Segments</h2>
            <Button onClick={() => setShowSegmentModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Segment
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {segments.map(segment => (
              <Card key={segment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{segment.name}</CardTitle>
                    <Badge className={getStatusColor(segment.status)}>
                      {segment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{segment.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Customers:</span>
                      <span className="text-sm">{formatNumber(segment.customerCount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Type:</span>
                      <span className="text-sm">{segment.segmentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Updated:</span>
                      <span className="text-sm">{formatDate(segment.updatedAt)}</span>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Campaigns</h2>
            <Button onClick={() => setShowCampaignModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>

          <div className="space-y-4">
            {campaigns.map(campaign => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <p className="text-sm text-gray-600">{campaign.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <div className="flex space-x-1">
                        {campaign.status === 'DRAFT' && (
                          <Button size="sm" onClick={() => handleCampaignAction(campaign.id, 'start')}>
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {campaign.status === 'RUNNING' && (
                          <Button size="sm" onClick={() => handleCampaignAction(campaign.id, 'pause')}>
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        {campaign.status === 'PAUSED' && (
                          <Button size="sm" onClick={() => handleCampaignAction(campaign.id, 'resume')}>
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sent</p>
                      <p className="text-lg font-semibold">{formatNumber(campaign.totalSent)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Delivered</p>
                      <p className="text-lg font-semibold">{formatNumber(campaign.totalDelivered)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Open Rate</p>
                      <p className="text-lg font-semibold">{formatPercentage(campaign.openRate || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Click Rate</p>
                      <p className="text-lg font-semibold">{formatPercentage(campaign.clickRate || 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Templates</h2>
            <Button onClick={() => setShowTemplateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant={template.isActive ? 'default' : 'secondary'}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Type:</span>
                      <span className="text-sm">{template.templateType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Method:</span>
                      <span className="text-sm">{template.deliveryMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Usage:</span>
                      <span className="text-sm">{formatNumber(template.usageCount)}</span>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals would be implemented here */}
      {/* Segment Creation Modal */}
      {showSegmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Create Segment</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="segmentName">Name</Label>
                <Input id="segmentName" placeholder="Enter segment name" />
              </div>
              <div>
                <Label htmlFor="segmentDescription">Description</Label>
                <Input id="segmentDescription" placeholder="Enter segment description" />
              </div>
              <div>
                <Label htmlFor="segmentType">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select segment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MANUAL">Manual</SelectItem>
                    <SelectItem value="DYNAMIC">Dynamic</SelectItem>
                    <SelectItem value="BEHAVIORAL">Behavioral</SelectItem>
                    <SelectItem value="DEMOGRAPHIC">Demographic</SelectItem>
                    <SelectItem value="GEOGRAPHIC">Geographic</SelectItem>
                    <SelectItem value="PURCHASE">Purchase</SelectItem>
                    <SelectItem value="ENGAGEMENT">Engagement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setShowSegmentModal(false)} className="flex-1">
                  Create
                </Button>
                <Button variant="outline" onClick={() => setShowSegmentModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Creation Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Create Campaign</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaignName">Name</Label>
                <Input id="campaignName" placeholder="Enter campaign name" />
              </div>
              <div>
                <Label htmlFor="campaignType">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMAIL">Email</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                    <SelectItem value="PUSH">Push Notification</SelectItem>
                    <SelectItem value="COUPON">Coupon</SelectItem>
                    <SelectItem value="PROMOTIONAL">Promotional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="campaignContent">Content</Label>
                <Input id="campaignContent" placeholder="Enter campaign content" />
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setShowCampaignModal(false)} className="flex-1">
                  Create
                </Button>
                <Button variant="outline" onClick={() => setShowCampaignModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Creation Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Create Template</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="templateName">Name</Label>
                <Input id="templateName" placeholder="Enter template name" />
              </div>
              <div>
                <Label htmlFor="templateType">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMAIL">Email</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                    <SelectItem value="PUSH">Push Notification</SelectItem>
                    <SelectItem value="COUPON">Coupon</SelectItem>
                    <SelectItem value="WELCOME">Welcome</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="templateContent">Content</Label>
                <Input id="templateContent" placeholder="Enter template content" />
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setShowTemplateModal(false)} className="flex-1">
                  Create
                </Button>
                <Button variant="outline" onClick={() => setShowTemplateModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

