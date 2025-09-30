import React from 'react';
import { FeatureName } from '@tdc/domain';

interface FeatureLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: FeatureName;
  currentPlan?: string;
  requiredPlan?: string;
  onUpgrade: () => void;
}

export default function FeatureLockModal({
  isOpen,
  onClose,
  feature,
  currentPlan = 'Free',
  requiredPlan = 'CustomDomainPro',
  onUpgrade
}: FeatureLockModalProps) {
  if (!isOpen) return null;

  const getFeatureInfo = (feature: FeatureName) => {
    const featureInfo: Record<FeatureName, {
      title: string;
      description: string;
      icon: string;
      benefits: string[];
    }> = {
      [FeatureName.CUSTOM_DOMAINS]: {
        title: 'Custom Domains',
        description: 'Connect your own domain to your store for a professional look',
        icon: '🌐',
        benefits: [
          'Use your own domain (e.g., mystore.com)',
          'Professional branding',
          'Better SEO performance',
          'Custom SSL certificates',
          'Up to 5 domains'
        ]
      },
      [FeatureName.PAGE_BUILDER]: {
        title: 'Page Builder',
        description: 'Create custom pages with drag-and-drop interface',
        icon: '📄',
        benefits: [
          'Drag-and-drop page builder',
          'Custom layouts and blocks',
          'Mobile-responsive design',
          'SEO optimization',
          'Unlimited custom pages'
        ]
      },
      [FeatureName.ADVANCED_ANALYTICS]: {
        title: 'Advanced Analytics',
        description: 'Get detailed insights about your store performance',
        icon: '📊',
        benefits: [
          'Real-time analytics dashboard',
          'Custom reports',
          'Conversion tracking',
          'Customer behavior analysis',
          'Export data to CSV/PDF'
        ]
      },
      [FeatureName.PRIORITY_SUPPORT]: {
        title: 'Priority Support',
        description: 'Get faster response times and dedicated support',
        icon: '🎧',
        benefits: [
          '24/7 priority support',
          'Dedicated account manager',
          'Phone and email support',
          'Faster response times',
          'Priority feature requests'
        ]
      },
      [FeatureName.API_ACCESS]: {
        title: 'API Access',
        description: 'Integrate with external services using our API',
        icon: '🔌',
        benefits: [
          'RESTful API access',
          'Webhook support',
          'Rate limiting',
          'API documentation',
          'SDK libraries'
        ]
      },
      [FeatureName.WEBHOOKS]: {
        title: 'Webhooks',
        description: 'Get real-time notifications about events in your store',
        icon: '🔗',
        benefits: [
          'Real-time event notifications',
          'Custom webhook endpoints',
          'Retry mechanisms',
          'Event filtering',
          'HMAC security'
        ]
      },
      [FeatureName.MULTI_STORE]: {
        title: 'Multi-Store',
        description: 'Manage multiple stores from a single dashboard',
        icon: '🏪',
        benefits: [
          'Manage multiple stores',
          'Centralized dashboard',
          'Cross-store analytics',
          'Bulk operations',
          'Up to 10 stores'
        ]
      },
      [FeatureName.CUSTOM_THEMES]: {
        title: 'Custom Themes',
        description: 'Create and customize your store themes',
        icon: '🎨',
        benefits: [
          'Custom theme editor',
          'Color and typography controls',
          'Layout customization',
          'Theme templates',
          'CSS/JS customization'
        ]
      },
      [FeatureName.UNLIMITED_PRODUCTS]: {
        title: 'Unlimited Products',
        description: 'Add unlimited products to your store',
        icon: '📦',
        benefits: [
          'No product limit',
          'Bulk product import',
          'Product variants',
          'Inventory management',
          'Product categories'
        ]
      },
      [FeatureName.UNLIMITED_ORDERS]: {
        title: 'Unlimited Orders',
        description: 'Process unlimited orders without restrictions',
        icon: '🛒',
        benefits: [
          'No order limit',
          'Order management',
          'Customer tracking',
          'Order analytics',
          'Export capabilities'
        ]
      }
    };

    return featureInfo[feature] || {
      title: feature,
      description: 'This feature requires a higher plan',
      icon: '🔒',
      benefits: []
    };
  };

  const featureInfo = getFeatureInfo(feature);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-4xl mr-4">{featureInfo.icon}</span>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{featureInfo.title}</h3>
                <p className="text-gray-600">{featureInfo.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Current vs Required Plan */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  This feature requires <strong>{requiredPlan}</strong> plan
                </p>
                <p className="text-sm text-yellow-700">
                  You are currently on the <strong>{currentPlan}</strong> plan
                </p>
              </div>
            </div>
          </div>

          {/* Feature Benefits */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">What you'll get with {requiredPlan}:</h4>
            <ul className="space-y-3">
              {featureInfo.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-lg font-semibold text-blue-900">{requiredPlan}</h5>
                <p className="text-blue-700">Starting at $99/month</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600">30-day free trial</p>
                <p className="text-sm text-blue-600">Cancel anytime</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={onUpgrade}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Upgrade to {requiredPlan}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

