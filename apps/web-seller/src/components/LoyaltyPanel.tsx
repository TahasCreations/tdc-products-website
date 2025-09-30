/**
 * Seller Loyalty Panel
 * Allows sellers to view and manage their loyalty program participation
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Gift, 
  TrendingUp, 
  Users, 
  Settings,
  BarChart3,
  Eye,
  Download
} from 'lucide-react';

interface LoyaltyStatus {
  points: number;
  tier: string | null;
  nextTier: string | null;
  pointsToNextTier: number;
  canRedeem: boolean;
  maxRedemption: number;
}

interface LoyaltyTransaction {
  id: string;
  type: string;
  points: number;
  description: string;
  orderId?: string;
  createdAt: string;
  status: string;
}

interface LoyaltyAnalytics {
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  activeCustomers: number;
  redemptionRate: number;
  averageOrderValue: number;
  tierDistribution: { tier: string; count: number }[];
}

interface CostSharingInfo {
  platformShare: number;
  sellerShare: number;
  customerShare: number;
  totalLoyaltyCost: number;
  sellerLoyaltyCost: number;
}

export default function LoyaltyPanel() {
  const [loyaltyStatus, setLoyaltyStatus] = useState<LoyaltyStatus | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [analytics, setAnalytics] = useState<LoyaltyAnalytics | null>(null);
  const [costSharing, setCostSharing] = useState<CostSharingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoyaltyData();
  }, []);

  const loadLoyaltyData = async () => {
    try {
      setLoading(true);
      
      // Get seller's loyalty status
      const statusRes = await fetch('/api/loyalty/sellers/me/status');
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setLoyaltyStatus(statusData.data);
      }

      // Get loyalty transactions
      const transactionsRes = await fetch('/api/loyalty/sellers/me/transactions?limit=50');
      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData.data);
      }

      // Get loyalty analytics
      const analyticsRes = await fetch('/api/loyalty/sellers/me/analytics');
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData.data);
      }

      // Get cost sharing information
      const costSharingRes = await fetch('/api/loyalty/sellers/me/cost-sharing');
      if (costSharingRes.ok) {
        const costSharingData = await costSharingRes.json();
        setCostSharing(costSharingData.data);
      }

    } catch (error) {
      console.error('Error loading loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportTransactions = async () => {
    try {
      const response = await fetch('/api/loyalty/sellers/me/transactions/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `loyalty-transactions-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting transactions:', error);
    }
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
          <h1 className="text-3xl font-bold">Loyalty Program</h1>
          <p className="text-gray-600">Manage your participation in the loyalty program</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportTransactions}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      {loyaltyStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Points</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loyaltyStatus.points.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Available points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loyaltyStatus.tier || 'No Tier'}
              </div>
              <p className="text-xs text-muted-foreground">Loyalty level</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Tier</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loyaltyStatus.pointsToNextTier.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Points to {loyaltyStatus.nextTier || 'next tier'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Max Redemption</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loyaltyStatus.maxRedemption.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Points per order</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tier Progress */}
      {loyaltyStatus && loyaltyStatus.nextTier && (
        <Card>
          <CardHeader>
            <CardTitle>Tier Progress</CardTitle>
            <CardDescription>
              Progress towards the next loyalty tier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Current: {loyaltyStatus.tier}</span>
                <span>Next: {loyaltyStatus.nextTier}</span>
              </div>
              <Progress 
                value={(loyaltyStatus.points / (loyaltyStatus.points + loyaltyStatus.pointsToNextTier)) * 100} 
                className="h-3"
              />
              <div className="text-center text-sm text-gray-600">
                {loyaltyStatus.pointsToNextTier} points needed for next tier
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="cost-sharing">Cost Sharing</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Benefits</CardTitle>
                <CardDescription>Benefits available at your current tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Earn points on every sale</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Redeem points for discounts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Priority customer support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Exclusive promotions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest loyalty transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{transaction.description}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {transaction.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your loyalty point transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.type}</Badge>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points}
                        </span>
                      </TableCell>
                      <TableCell>
                        {transaction.orderId ? (
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            {transaction.orderId.slice(-8)}
                          </Button>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
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
                  <CardTitle>Points Summary</CardTitle>
                  <CardDescription>Your loyalty points performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Points Earned</span>
                      <span className="font-bold text-green-600">
                        +{analytics.totalPointsEarned.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Points Redeemed</span>
                      <span className="font-bold text-blue-600">
                        -{analytics.totalPointsRedeemed.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Redemption Rate</span>
                      <span className="font-bold">
                        {analytics.redemptionRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Customers</span>
                      <span className="font-bold">
                        {analytics.activeCustomers.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Distribution</CardTitle>
                  <CardDescription>Your customers by loyalty tier</CardDescription>
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
            </div>
          )}
        </TabsContent>

        {/* Cost Sharing Tab */}
        <TabsContent value="cost-sharing" className="space-y-6">
          {costSharing && (
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Cost Sharing</CardTitle>
                <CardDescription>
                  How loyalty program costs are shared between platform and sellers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {costSharing.platformShare}%
                      </div>
                      <div className="text-sm text-gray-600">Platform Share</div>
                      <div className="text-xs text-gray-500">
                        {costSharing.totalLoyaltyCost * (costSharing.platformShare / 100)} TRY
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {costSharing.sellerShare}%
                      </div>
                      <div className="text-sm text-gray-600">Your Share</div>
                      <div className="text-xs text-gray-500">
                        {costSharing.sellerLoyaltyCost} TRY
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {costSharing.customerShare}%
                      </div>
                      <div className="text-sm text-gray-600">Customer Share</div>
                      <div className="text-xs text-gray-500">
                        {costSharing.totalLoyaltyCost * (costSharing.customerShare / 100)} TRY
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">How it works:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• When customers redeem loyalty points, the discount cost is shared</li>
                      <li>• Platform covers {costSharing.platformShare}% of the cost</li>
                      <li>• You cover {costSharing.sellerShare}% of the cost</li>
                      <li>• Customer covers {costSharing.customerShare}% of the cost</li>
                      <li>• This encourages customer loyalty while sharing the cost burden</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-800">Benefits for you:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Increased customer retention and repeat purchases</li>
                      <li>• Higher average order values from loyal customers</li>
                      <li>• Reduced customer acquisition costs</li>
                      <li>• Platform shares the cost burden with you</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

