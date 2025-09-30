/**
 * Admin Loyalty Dashboard
 * Manages loyalty points, tiers, and analytics
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Star, 
  Users, 
  TrendingUp, 
  Gift, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3
} from 'lucide-react';

interface LoyaltyTier {
  id: string;
  name: string;
  description?: string;
  level: number;
  color?: string;
  icon?: string;
  minPoints: number;
  maxPoints?: number;
  benefits?: any[];
  discountRate?: number;
  freeShipping: boolean;
  prioritySupport: boolean;
  exclusiveAccess: boolean;
  earningMultiplier: number;
  bonusCategories: string[];
  redemptionRate?: number;
  maxRedemptionRate?: number;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LoyaltyAnalytics {
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  totalPointsExpired: number;
  activeCustomers: number;
  tierDistribution: { tier: string; count: number }[];
  redemptionRate: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
}

interface CustomerPoints {
  id: string;
  customerId: string;
  points: number;
  totalEarned: number;
  totalRedeemed: number;
  totalExpired: number;
  currentTierId?: string;
  tierPoints: number;
  nextTierId?: string;
  nextTierPoints?: number;
  status: string;
  lastEarnedAt?: string;
  lastRedeemedAt?: string;
  lastExpiredAt?: string;
  tierUpgradedAt?: string;
  tierDowngradedAt?: string;
  pointsExpire: boolean;
  expirationDays?: number;
  nextExpirationAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function LoyaltyDashboard() {
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [analytics, setAnalytics] = useState<LoyaltyAnalytics | null>(null);
  const [customers, setCustomers] = useState<CustomerPoints[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<LoyaltyTier | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tierToDelete, setTierToDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 1,
    color: '#3B82F6',
    icon: '',
    minPoints: 0,
    maxPoints: '',
    benefits: [] as any[],
    discountRate: '',
    freeShipping: false,
    prioritySupport: false,
    exclusiveAccess: false,
    earningMultiplier: 1.0,
    bonusCategories: [] as string[],
    redemptionRate: '',
    maxRedemptionRate: '',
    isActive: true,
    isDefault: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tiersRes, analyticsRes, customersRes] = await Promise.all([
        fetch('/api/loyalty/tiers'),
        fetch('/api/loyalty/analytics'),
        fetch('/api/loyalty/customers?limit=100'),
      ]);

      if (tiersRes.ok) {
        const tiersData = await tiersRes.json();
        setTiers(tiersData.data);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData.data);
      }

      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setCustomers(customersData.data);
      }
    } catch (error) {
      console.error('Error loading loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTier = async () => {
    try {
      const response = await fetch('/api/loyalty/tiers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          maxPoints: formData.maxPoints ? parseInt(formData.maxPoints) : undefined,
          discountRate: formData.discountRate ? parseFloat(formData.discountRate) : undefined,
          redemptionRate: formData.redemptionRate ? parseFloat(formData.redemptionRate) : undefined,
          maxRedemptionRate: formData.maxRedemptionRate ? parseFloat(formData.maxRedemptionRate) : undefined,
        }),
      });

      if (response.ok) {
        await loadData();
        setIsCreateDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating tier:', error);
    }
  };

  const handleEditTier = async () => {
    if (!selectedTier) return;

    try {
      const response = await fetch(`/api/loyalty/tiers/${selectedTier.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          maxPoints: formData.maxPoints ? parseInt(formData.maxPoints) : undefined,
          discountRate: formData.discountRate ? parseFloat(formData.discountRate) : undefined,
          redemptionRate: formData.redemptionRate ? parseFloat(formData.redemptionRate) : undefined,
          maxRedemptionRate: formData.maxRedemptionRate ? parseFloat(formData.maxRedemptionRate) : undefined,
        }),
      });

      if (response.ok) {
        await loadData();
        setIsEditDialogOpen(false);
        setSelectedTier(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating tier:', error);
    }
  };

  const handleDeleteTier = async () => {
    if (!tierToDelete) return;

    try {
      const response = await fetch(`/api/loyalty/tiers/${tierToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadData();
        setIsDeleteDialogOpen(false);
        setTierToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting tier:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      level: 1,
      color: '#3B82F6',
      icon: '',
      minPoints: 0,
      maxPoints: '',
      benefits: [],
      discountRate: '',
      freeShipping: false,
      prioritySupport: false,
      exclusiveAccess: false,
      earningMultiplier: 1.0,
      bonusCategories: [],
      redemptionRate: '',
      maxRedemptionRate: '',
      isActive: true,
      isDefault: false,
    });
  };

  const openEditDialog = (tier: LoyaltyTier) => {
    setSelectedTier(tier);
    setFormData({
      name: tier.name,
      description: tier.description || '',
      level: tier.level,
      color: tier.color || '#3B82F6',
      icon: tier.icon || '',
      minPoints: tier.minPoints,
      maxPoints: tier.maxPoints?.toString() || '',
      benefits: tier.benefits || [],
      discountRate: tier.discountRate?.toString() || '',
      freeShipping: tier.freeShipping,
      prioritySupport: tier.prioritySupport,
      exclusiveAccess: tier.exclusiveAccess,
      earningMultiplier: tier.earningMultiplier,
      bonusCategories: tier.bonusCategories || [],
      redemptionRate: tier.redemptionRate?.toString() || '',
      maxRedemptionRate: tier.maxRedemptionRate?.toString() || '',
      isActive: tier.isActive,
      isDefault: tier.isDefault,
    });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading loyalty data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loyalty Management</h1>
          <p className="text-gray-600">Manage loyalty points, tiers, and customer rewards</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Tier
        </Button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points Earned</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalPointsEarned.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeCustomers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">With loyalty points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Redemption Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.redemptionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Points redeemed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averageOrderValue.toFixed(2)} TRY</div>
              <p className="text-xs text-muted-foreground">Per order</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="tiers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tiers">Tiers</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Tiers Tab */}
        <TabsContent value="tiers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Tiers</CardTitle>
              <CardDescription>Manage customer loyalty tiers and benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Points Range</TableHead>
                    <TableHead>Benefits</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tiers.map((tier) => (
                    <TableRow key={tier.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {tier.icon && <span className="text-lg">{tier.icon}</span>}
                          <div>
                            <div className="font-medium">{tier.name}</div>
                            {tier.description && (
                              <div className="text-sm text-gray-500">{tier.description}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Level {tier.level}</Badge>
                      </TableCell>
                      <TableCell>
                        {tier.minPoints.toLocaleString()}
                        {tier.maxPoints ? ` - ${tier.maxPoints.toLocaleString()}` : '+'}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {tier.discountRate && (
                            <Badge variant="secondary">{tier.discountRate}% discount</Badge>
                          )}
                          {tier.freeShipping && <Badge variant="secondary">Free shipping</Badge>}
                          {tier.prioritySupport && <Badge variant="secondary">Priority support</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant={tier.isActive ? 'default' : 'secondary'}>
                            {tier.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {tier.isDefault && <Badge variant="outline">Default</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(tier)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTierToDelete(tier.id);
                              setIsDeleteDialogOpen(true);
                            }}
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

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Points</CardTitle>
              <CardDescription>View and manage customer loyalty points</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Total Earned</TableHead>
                    <TableHead>Total Redeemed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.customerId}</TableCell>
                      <TableCell>
                        <div className="text-lg font-bold">{customer.points.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>{customer.totalEarned.toLocaleString()}</TableCell>
                      <TableCell>{customer.totalRedeemed.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={customer.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {customer.lastEarnedAt && (
                          <div className="text-sm text-gray-500">
                            Earned: {new Date(customer.lastEarnedAt).toLocaleDateString()}
                          </div>
                        )}
                        {customer.lastRedeemedAt && (
                          <div className="text-sm text-gray-500">
                            Redeemed: {new Date(customer.lastRedeemedAt).toLocaleDateString()}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tier Distribution</CardTitle>
                  <CardDescription>Customer distribution across tiers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.tierDistribution.map((tier, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{tier.tier || 'No Tier'}</span>
                          <span>{tier.count} customers</span>
                        </div>
                        <Progress 
                          value={(tier.count / analytics.activeCustomers) * 100} 
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Points Summary</CardTitle>
                  <CardDescription>Points earned, redeemed, and expired</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Earned</span>
                      <span className="font-bold text-green-600">
                        +{analytics.totalPointsEarned.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Redeemed</span>
                      <span className="font-bold text-blue-600">
                        -{analytics.totalPointsRedeemed.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Expired</span>
                      <span className="font-bold text-red-600">
                        -{analytics.totalPointsExpired.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Lifetime Value</span>
                      <span className="font-bold">
                        {analytics.customerLifetimeValue.toFixed(2)} TRY
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Settings</CardTitle>
              <CardDescription>Configure loyalty program settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Default Points Expiration (days)</Label>
                  <Input type="number" placeholder="365" />
                </div>
                <div className="space-y-2">
                  <Label>Default Earning Rate (points per TRY)</Label>
                  <Input type="number" step="0.01" placeholder="1.0" />
                </div>
                <div className="space-y-2">
                  <Label>Default Redemption Rate (TRY per point)</Label>
                  <Input type="number" step="0.001" placeholder="0.01" />
                </div>
                <div className="space-y-2">
                  <Label>Max Redemption Rate (%)</Label>
                  <Input type="number" step="1" placeholder="50" />
                </div>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Tier Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Loyalty Tier</DialogTitle>
            <DialogDescription>
              Create a new loyalty tier with specific benefits and requirements
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tier Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Gold Member"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Input
                  id="level"
                  type="number"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the benefits of this tier"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minPoints">Minimum Points</Label>
                <Input
                  id="minPoints"
                  type="number"
                  value={formData.minPoints}
                  onChange={(e) => setFormData({ ...formData, minPoints: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPoints">Maximum Points (optional)</Label>
                <Input
                  id="maxPoints"
                  type="number"
                  value={formData.maxPoints}
                  onChange={(e) => setFormData({ ...formData, maxPoints: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., ⭐"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountRate">Discount Rate (%)</Label>
                <Input
                  id="discountRate"
                  type="number"
                  step="0.1"
                  value={formData.discountRate}
                  onChange={(e) => setFormData({ ...formData, discountRate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="earningMultiplier">Earning Multiplier</Label>
                <Input
                  id="earningMultiplier"
                  type="number"
                  step="0.1"
                  value={formData.earningMultiplier}
                  onChange={(e) => setFormData({ ...formData, earningMultiplier: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="freeShipping"
                  checked={formData.freeShipping}
                  onCheckedChange={(checked) => setFormData({ ...formData, freeShipping: checked })}
                />
                <Label htmlFor="freeShipping">Free Shipping</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="prioritySupport"
                  checked={formData.prioritySupport}
                  onCheckedChange={(checked) => setFormData({ ...formData, prioritySupport: checked })}
                />
                <Label htmlFor="prioritySupport">Priority Support</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="exclusiveAccess"
                  checked={formData.exclusiveAccess}
                  onCheckedChange={(checked) => setFormData({ ...formData, exclusiveAccess: checked })}
                />
                <Label htmlFor="exclusiveAccess">Exclusive Access</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                />
                <Label htmlFor="isDefault">Default Tier</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTier}>Create Tier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Loyalty Tier</DialogTitle>
            <DialogDescription>
              Update the loyalty tier settings and benefits
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Same form fields as create dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Tier Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Gold Member"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-level">Level</Label>
                <Input
                  id="edit-level"
                  type="number"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                />
              </div>
            </div>
            {/* ... other form fields ... */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTier}>Update Tier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Tier Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Loyalty Tier</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this loyalty tier? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTier}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

