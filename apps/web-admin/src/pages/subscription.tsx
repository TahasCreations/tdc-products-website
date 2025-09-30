import React, { useState, useEffect } from 'react';
import { SubscriptionStatus, BillingCycle, FeatureName } from '@tdc/domain';

interface SubscriptionPageProps {
  tenantId: string;
}

export default function SubscriptionPage({ tenantId }: SubscriptionPageProps) {
  const [subscription, setSubscription] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  useEffect(() => {
    loadSubscriptionData();
  }, [tenantId]);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      
      // Load current subscription
      const subscriptionResponse = await fetch(`/api/subscriptions/current?tenantId=${tenantId}`);
      const subscriptionData = await subscriptionResponse.json();
      setSubscription(subscriptionData);

      // Load available plans
      const plansResponse = await fetch(`/api/subscriptions/plans?tenantId=${tenantId}`);
      const plansData = await plansResponse.json();
      setPlans(plansData);
    } catch (error) {
      console.error('Error loading subscription data:', error);
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/subscriptions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId,
          planId,
          provider: 'stripe' // or 'iyzico'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.checkoutUrl) {
          // Redirect to payment
          window.location.href = result.checkoutUrl;
        } else {
          setSuccess('Subscription created successfully!');
          loadSubscriptionData();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to subscribe');
      }
    } catch (error) {
      setError('Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId,
          subscriptionId: subscription.id
        }),
      });

      if (response.ok) {
        setSuccess('Subscription canceled successfully!');
        loadSubscriptionData();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      setError('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: SubscriptionStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'TRIALING':
        return 'bg-blue-100 text-blue-800';
      case 'PAST_DUE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      case 'UNPAID':
        return 'bg-red-100 text-red-800';
      case 'INCOMPLETE':
        return 'bg-gray-100 text-gray-800';
      case 'INCOMPLETE_EXPIRED':
        return 'bg-red-100 text-red-800';
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price / 100);
  };

  const getFeatureIcon = (feature: string) => {
    const icons: Record<string, string> = {
      [FeatureName.CUSTOM_DOMAINS]: '🌐',
      [FeatureName.PAGE_BUILDER]: '📄',
      [FeatureName.ADVANCED_ANALYTICS]: '📊',
      [FeatureName.PRIORITY_SUPPORT]: '🎧',
      [FeatureName.API_ACCESS]: '🔌',
      [FeatureName.WEBHOOKS]: '🔗',
      [FeatureName.MULTI_STORE]: '🏪',
      [FeatureName.CUSTOM_THEMES]: '🎨',
      [FeatureName.UNLIMITED_PRODUCTS]: '📦',
      [FeatureName.UNLIMITED_ORDERS]: '🛒'
    };
    return icons[feature] || '✅';
  };

  const getFeatureName = (feature: string) => {
    const names: Record<string, string> = {
      [FeatureName.CUSTOM_DOMAINS]: 'Custom Domains',
      [FeatureName.PAGE_BUILDER]: 'Page Builder',
      [FeatureName.ADVANCED_ANALYTICS]: 'Advanced Analytics',
      [FeatureName.PRIORITY_SUPPORT]: 'Priority Support',
      [FeatureName.API_ACCESS]: 'API Access',
      [FeatureName.WEBHOOKS]: 'Webhooks',
      [FeatureName.MULTI_STORE]: 'Multi-Store',
      [FeatureName.CUSTOM_THEMES]: 'Custom Themes',
      [FeatureName.UNLIMITED_PRODUCTS]: 'Unlimited Products',
      [FeatureName.UNLIMITED_ORDERS]: 'Unlimited Orders'
    };
    return names[feature] || feature;
  };

  if (loading && !subscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your subscription plan and billing
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Subscription */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h3>
                
                {subscription ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Plan</span>
                        <span className="text-sm font-semibold text-gray-900">{subscription.planName}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-medium text-gray-500">Status</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                          {subscription.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-medium text-gray-500">Price</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(subscription.price, subscription.currency)} / {subscription.billingCycle.toLowerCase()}
                        </span>
                      </div>
                      {subscription.nextBillingDate && (
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-medium text-gray-500">Next Billing</span>
                          <span className="text-sm text-gray-900">
                            {new Date(subscription.nextBillingDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={handleCancel}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No active subscription</p>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Choose a Plan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Available Plans */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Available Plans</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {plans.map((plan) => (
                    <div key={plan.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold text-gray-900">{plan.displayName}</h4>
                        <div className="text-2xl font-bold text-gray-900">
                          {formatPrice(plan.price, plan.currency)}
                          <span className="text-sm font-normal text-gray-500">/{plan.billingCycle.toLowerCase()}</span>
                        </div>
                      </div>
                      
                      {plan.description && (
                        <p className="text-gray-600 mb-4">{plan.description}</p>
                      )}

                      <div className="space-y-2 mb-6">
                        {Object.entries(plan.features).map(([feature, config]: [string, any]) => (
                          <div key={feature} className="flex items-center">
                            <span className="text-lg mr-2">{getFeatureIcon(feature)}</span>
                            <span className="text-sm text-gray-700">
                              {getFeatureName(feature)}
                              {config.limit && (
                                <span className="text-gray-500 ml-1">
                                  ({config.limit === null ? 'Unlimited' : config.limit})
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={loading || (subscription && subscription.planId === plan.id)}
                        className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                          subscription && subscription.planId === plan.id
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {subscription && subscription.planId === plan.id
                          ? 'Current Plan'
                          : 'Subscribe'
                        }
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Usage */}
        {subscription && subscription.entitlements && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Feature Usage</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subscription.entitlements.map((entitlement: any) => (
                    <div key={entitlement.feature} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {getFeatureName(entitlement.feature)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          entitlement.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {entitlement.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      
                      {entitlement.limit && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Usage</span>
                            <span>{entitlement.used} / {entitlement.limit}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.min((entitlement.used / entitlement.limit) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

