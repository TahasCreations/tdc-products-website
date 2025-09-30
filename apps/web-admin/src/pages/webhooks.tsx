import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  Trash2, 
  RefreshCw, 
  Eye, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react';

interface WebhookSubscription {
  id: string;
  name: string;
  description?: string;
  url: string;
  events: string[];
  isActive: boolean;
  isHealthy: boolean;
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  lastDeliveryAt?: string;
  consecutiveFailures: number;
  createdAt: string;
}

interface WebhookDelivery {
  id: string;
  subscriptionId: string;
  eventType: string;
  status: 'PENDING' | 'SENDING' | 'DELIVERED' | 'FAILED' | 'RETRYING' | 'CANCELLED' | 'EXPIRED';
  httpStatus?: number;
  attemptCount: number;
  maxRetries: number;
  duration?: number;
  errorMessage?: string;
  createdAt: string;
}

interface WebhookStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  healthySubscriptions: number;
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  pendingDeliveries: number;
  averageDeliveryTime: number;
  successRate: number;
  eventsByType: Record<string, number>;
  deliveriesByStatus: Record<string, number>;
}

const WebhookManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<WebhookSubscription[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [stats, setStats] = useState<WebhookStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<WebhookSubscription | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Form state for creating subscription
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    description: '',
    url: '',
    secret: '',
    events: [] as string[],
    verifySsl: true,
    includeHeaders: true,
    maxRetries: 3,
    retryDelay: 1000,
    retryBackoff: 2.0,
    timeout: 30000
  });

  const eventTypes = [
    'order.created',
    'order.updated',
    'order.cancelled',
    'order.completed',
    'order.paid',
    'order.settled',
    'product.created',
    'product.updated',
    'product.deleted',
    'product.flagged',
    'customer.created',
    'customer.updated',
    'seller.created',
    'seller.updated',
    'payment.created',
    'payment.completed',
    'payment.failed',
    'settlement.created',
    'settlement.completed'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subscriptionsRes, deliveriesRes, statsRes] = await Promise.all([
        fetch('/api/webhooks/subscriptions'),
        fetch('/api/webhooks/deliveries?limit=50'),
        fetch('/api/webhooks/stats')
      ]);

      const subscriptionsData = await subscriptionsRes.json();
      const deliveriesData = await deliveriesRes.json();
      const statsData = await statsRes.json();

      if (subscriptionsData.success) {
        setSubscriptions(subscriptionsData.data);
      }
      if (deliveriesData.success) {
        setDeliveries(deliveriesData.data);
      }
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Error fetching webhook data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async () => {
    try {
      const response = await fetch('/api/webhooks/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'default-tenant'
        },
        body: JSON.stringify(newSubscription)
      });

      const data = await response.json();
      if (data.success) {
        setSubscriptions([...subscriptions, data.data]);
        setIsCreateDialogOpen(false);
        setNewSubscription({
          name: '',
          description: '',
          url: '',
          secret: '',
          events: [],
          verifySsl: true,
          includeHeaders: true,
          maxRetries: 3,
          retryDelay: 1000,
          retryBackoff: 2.0,
          timeout: 30000
        });
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  const testSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetch(`/api/webhooks/subscriptions/${subscriptionId}/test`, {
        method: 'POST',
        headers: {
          'X-Tenant-ID': 'default-tenant'
        }
      });

      const data = await response.json();
      if (data.success) {
        setTestResult(data.data);
        setIsTestDialogOpen(true);
      }
    } catch (error) {
      console.error('Error testing subscription:', error);
    }
  };

  const toggleSubscription = async (subscriptionId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/webhooks/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'default-tenant'
        },
        body: JSON.stringify({ isActive: !isActive })
      });

      const data = await response.json();
      if (data.success) {
        setSubscriptions(subscriptions.map(sub => 
          sub.id === subscriptionId ? { ...sub, isActive: !isActive } : sub
        ));
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  const deleteSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;

    try {
      const response = await fetch(`/api/webhooks/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'X-Tenant-ID': 'default-tenant'
        }
      });

      const data = await response.json();
      if (data.success) {
        setSubscriptions(subscriptions.filter(sub => sub.id !== subscriptionId));
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAILED':
      case 'EXPIRED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'SENDING':
      case 'RETRYING':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      DELIVERED: 'default',
      FAILED: 'destructive',
      EXPIRED: 'destructive',
      PENDING: 'secondary',
      SENDING: 'outline',
      RETRYING: 'outline',
      CANCELLED: 'secondary'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Webhook Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Subscription
        </Button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
                  <p className="text-2xl font-bold">{stats.totalSubscriptions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                  <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                  <p className="text-2xl font-bold">{stats.totalDeliveries}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="subscriptions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead>Deliveries</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{subscription.name}</p>
                          {subscription.description && (
                            <p className="text-sm text-gray-500">{subscription.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {subscription.url}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {subscription.events.slice(0, 2).map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                          {subscription.events.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{subscription.events.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={subscription.isActive}
                            onCheckedChange={() => toggleSubscription(subscription.id, subscription.isActive)}
                          />
                          <span className="text-sm">
                            {subscription.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {subscription.isHealthy ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">
                            {subscription.isHealthy ? 'Healthy' : 'Unhealthy'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>Total: {subscription.totalDeliveries}</p>
                          <p className="text-green-600">✓ {subscription.successfulDeliveries}</p>
                          <p className="text-red-600">✗ {subscription.failedDeliveries}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testSubscription(subscription.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedSubscription(subscription)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteSubscription(subscription.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries">
          <Card>
            <CardHeader>
              <CardTitle>Recent Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {delivery.eventType}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(delivery.status)}
                          {getStatusBadge(delivery.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {delivery.attemptCount}/{delivery.maxRetries}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {delivery.duration ? `${delivery.duration}ms` : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(delivery.createdAt).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {delivery.status === 'FAILED' && (
                            <Button size="sm" variant="outline">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventTypes.map((eventType) => (
                  <div key={eventType} className="p-4 border rounded-lg">
                    <code className="text-sm font-mono">{eventType}</code>
                    <p className="text-sm text-gray-500 mt-1">
                      {stats?.eventsByType[eventType] || 0} deliveries
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Subscription Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Webhook Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newSubscription.name}
                onChange={(e) => setNewSubscription({ ...newSubscription, name: e.target.value })}
                placeholder="My Webhook Subscription"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newSubscription.description}
                onChange={(e) => setNewSubscription({ ...newSubscription, description: e.target.value })}
                placeholder="Description of this webhook subscription"
              />
            </div>
            <div>
              <Label htmlFor="url">Webhook URL</Label>
              <Input
                id="url"
                type="url"
                value={newSubscription.url}
                onChange={(e) => setNewSubscription({ ...newSubscription, url: e.target.value })}
                placeholder="https://example.com/webhook"
              />
            </div>
            <div>
              <Label htmlFor="secret">Secret</Label>
              <Input
                id="secret"
                type="password"
                value={newSubscription.secret}
                onChange={(e) => setNewSubscription({ ...newSubscription, secret: e.target.value })}
                placeholder="Your webhook secret"
              />
            </div>
            <div>
              <Label>Events</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                {eventTypes.map((eventType) => (
                  <label key={eventType} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newSubscription.events.includes(eventType)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewSubscription({
                            ...newSubscription,
                            events: [...newSubscription.events, eventType]
                          });
                        } else {
                          setNewSubscription({
                            ...newSubscription,
                            events: newSubscription.events.filter(e => e !== eventType)
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{eventType}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxRetries">Max Retries</Label>
                <Input
                  id="maxRetries"
                  type="number"
                  min="0"
                  max="10"
                  value={newSubscription.maxRetries}
                  onChange={(e) => setNewSubscription({ ...newSubscription, maxRetries: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="timeout">Timeout (ms)</Label>
                <Input
                  id="timeout"
                  type="number"
                  min="1000"
                  max="300000"
                  value={newSubscription.timeout}
                  onChange={(e) => setNewSubscription({ ...newSubscription, timeout: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newSubscription.verifySsl}
                  onChange={(e) => setNewSubscription({ ...newSubscription, verifySsl: e.target.checked })}
                />
                <span className="text-sm">Verify SSL</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newSubscription.includeHeaders}
                  onChange={(e) => setNewSubscription({ ...newSubscription, includeHeaders: e.target.checked })}
                />
                <span className="text-sm">Include Headers</span>
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createSubscription}>
                Create Subscription
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Test Result Dialog */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Result</DialogTitle>
          </DialogHeader>
          {testResult && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {testResult.success ? 'Test webhook sent successfully!' : 'Test webhook failed to send.'}
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <p><strong>Status:</strong> {testResult.success ? 'Success' : 'Failed'}</p>
                {testResult.httpStatus && <p><strong>HTTP Status:</strong> {testResult.httpStatus}</p>}
                {testResult.duration && <p><strong>Duration:</strong> {testResult.duration}ms</p>}
                {testResult.errorMessage && <p><strong>Error:</strong> {testResult.errorMessage}</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebhookManagement;

