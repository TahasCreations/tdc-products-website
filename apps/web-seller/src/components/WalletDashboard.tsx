/**
 * Seller Wallet Dashboard Component
 * Manages wallet balance, transactions, and ad spending
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
  Wallet, 
  Plus, 
  Minus, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Banknote, 
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

interface WalletData {
  id: string;
  balance: number;
  currency: string;
  isActive: boolean;
  dailySpendLimit?: number;
  monthlySpendLimit?: number;
  totalSpent: number;
  totalDeposited: number;
  lastSpentAt?: string;
  lastDepositedAt?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  isSuspended: boolean;
  suspensionReason?: string;
}

interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'SPEND' | 'REFUND' | 'BONUS' | 'PENALTY';
  amount: number;
  currency: string;
  balanceBefore: number;
  balanceAfter: number;
  description?: string;
  reference?: string;
  campaignId?: string;
  adId?: string;
  paymentMethod?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  processedAt?: string;
  failedAt?: string;
  failureReason?: string;
  createdAt: string;
}

interface WalletDashboardProps {
  sellerId: string;
  tenantId: string;
}

export function WalletDashboard({ sellerId, tenantId }: WalletDashboardProps) {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('');
  const [withdrawDescription, setWithdrawDescription] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadWalletData();
  }, [sellerId, tenantId]);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [walletResponse, transactionsResponse] = await Promise.all([
        fetch(`/api/ad-campaign/wallets/seller/${sellerId}?tenantId=${tenantId}`),
        fetch(`/api/ad-campaign/wallets/${wallet?.id}/transactions?tenantId=${tenantId}`)
      ]);

      if (walletResponse.ok) {
        const walletData = await walletResponse.json();
        setWallet(walletData.data);
      }

      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData.data);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
      setError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!wallet || !depositAmount || !depositMethod) return;

    try {
      const response = await fetch(`/api/ad-campaign/wallets/${wallet.id}/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(depositAmount),
          paymentMethod: depositMethod,
          reference: `DEP_${Date.now()}`
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Deposit successful');
        setDepositAmount('');
        setDepositMethod('');
        setShowDepositModal(false);
        loadWalletData();
      } else {
        setError(result.error || 'Deposit failed');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      setError('Deposit failed');
    }
  };

  const handleWithdraw = async () => {
    if (!wallet || !withdrawAmount) return;

    try {
      const response = await fetch(`/api/ad-campaign/wallets/${wallet.id}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          description: withdrawDescription || 'Withdrawal from wallet'
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Withdrawal successful');
        setWithdrawAmount('');
        setWithdrawDescription('');
        setShowWithdrawModal(false);
        loadWalletData();
      } else {
        setError(result.error || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      setError('Withdrawal failed');
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'WITHDRAWAL':
        return <Minus className="h-4 w-4 text-red-500" />;
      case 'SPEND':
        return <TrendingDown className="h-4 w-4 text-orange-500" />;
      case 'REFUND':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'BONUS':
        return <Banknote className="h-4 w-4 text-purple-500" />;
      case 'PENALTY':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionStatus = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'PROCESSING':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline">Cancelled</Badge>;
      case 'REFUNDED':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Refunded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="text-center py-8">
        <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Wallet Found</h3>
        <p className="text-gray-600 mb-4">You need to create a wallet to manage your ad spending.</p>
        <Button onClick={() => loadWalletData()}>
          Create Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <X className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto pl-3"
            >
              <X className="h-5 w-5 text-red-400" />
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
              <X className="h-5 w-5 text-green-400" />
            </button>
          </div>
        </div>
      )}

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(wallet.balance, wallet.currency)}</div>
            <p className="text-xs text-muted-foreground">
              Available for ad spending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposited</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(wallet.totalDeposited, wallet.currency)}</div>
            <p className="text-xs text-muted-foreground">
              All-time deposits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(wallet.totalSpent, wallet.currency)}</div>
            <p className="text-xs text-muted-foreground">
              On ad campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <div className="h-4 w-4">
              {wallet.status === 'ACTIVE' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={wallet.status === 'ACTIVE' ? 'default' : 'destructive'}>
                {wallet.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {wallet.isSuspended ? wallet.suspensionReason : 'Wallet is active'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Spending Limits */}
      {(wallet.dailySpendLimit || wallet.monthlySpendLimit) && (
        <Card>
          <CardHeader>
            <CardTitle>Spending Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wallet.dailySpendLimit && (
                <div>
                  <Label className="text-sm font-medium">Daily Limit</Label>
                  <p className="text-2xl font-bold">{formatCurrency(wallet.dailySpendLimit, wallet.currency)}</p>
                </div>
              )}
              {wallet.monthlySpendLimit && (
                <div>
                  <Label className="text-sm font-medium">Monthly Limit</Label>
                  <p className="text-2xl font-bold">{formatCurrency(wallet.monthlySpendLimit, wallet.currency)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button 
          onClick={() => setShowDepositModal(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Deposit Money
        </Button>
        <Button 
          onClick={() => setShowWithdrawModal(true)}
          variant="outline"
        >
          <Minus className="h-4 w-4 mr-2" />
          Withdraw Money
        </Button>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="deposits">Deposits</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              <TabsTrigger value="spending">Spending</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        transaction.type === 'DEPOSIT' || transaction.type === 'REFUND' || transaction.type === 'BONUS'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'DEPOSIT' || transaction.type === 'REFUND' || transaction.type === 'BONUS' ? '+' : '-'}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Balance: {formatCurrency(transaction.balanceAfter, transaction.currency)}
                      </p>
                      {getTransactionStatus(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="deposits" className="space-y-4">
              <div className="space-y-2">
                {transactions.filter(t => t.type === 'DEPOSIT').map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        +{formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Balance: {formatCurrency(transaction.balanceAfter, transaction.currency)}
                      </p>
                      {getTransactionStatus(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="withdrawals" className="space-y-4">
              <div className="space-y-2">
                {transactions.filter(t => t.type === 'WITHDRAWAL').map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">
                        -{formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Balance: {formatCurrency(transaction.balanceAfter, transaction.currency)}
                      </p>
                      {getTransactionStatus(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="spending" className="space-y-4">
              <div className="space-y-2">
                {transactions.filter(t => t.type === 'SPEND').map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-orange-600">
                        -{formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Balance: {formatCurrency(transaction.balanceAfter, transaction.currency)}
                      </p>
                      {getTransactionStatus(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Deposit Money</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="depositAmount">Amount</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label htmlFor="depositMethod">Payment Method</Label>
                <Select value={depositMethod} onValueChange={setDepositMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleDeposit} className="flex-1">
                  Deposit
                </Button>
                <Button variant="outline" onClick={() => setShowDepositModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Withdraw Money</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="withdrawAmount">Amount</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label htmlFor="withdrawDescription">Description</Label>
                <Input
                  id="withdrawDescription"
                  value={withdrawDescription}
                  onChange={(e) => setWithdrawDescription(e.target.value)}
                  placeholder="Optional description"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleWithdraw} className="flex-1">
                  Withdraw
                </Button>
                <Button variant="outline" onClick={() => setShowWithdrawModal(false)}>
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

