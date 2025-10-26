"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Puzzle,
  Plug,
  CheckCircle,
  AlertCircle,
  Settings,
  Trash2,
  Sync,
  ExternalLink
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  icon: string;
  color: string;
}

export const IntegrationsHub: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Sync products with Shopify store',
      category: 'E-Commerce',
      status: 'inactive',
      icon: '🛍️',
      color: 'green',
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows',
      category: 'Automation',
      status: 'active',
      icon: '⚡',
      color: 'purple',
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Email marketing integration',
      category: 'Marketing',
      status: 'active',
      icon: '📧',
      color: 'orange',
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team notifications',
      category: 'Communication',
      status: 'inactive',
      icon: '💬',
      color: 'blue',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Customer messaging',
      category: 'CRM',
      status: 'inactive',
      icon: '📱',
      color: 'green',
    },
    {
      id: 'instagram',
      name: 'Instagram Shop',
      description: 'Social commerce',
      category: 'Social',
      status: 'inactive',
      icon: '📸',
      color: 'pink',
    },
  ]);

  const handleConnect = (id: string) => {
    setIntegrations(prev =>
      prev.map(int => int.id === id ? { ...int, status: 'active' } : int)
    );
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev =>
      prev.map(int => int.id === id ? { ...int, status: 'inactive' } : int)
    );
  };

  const handleSync = (id: string) => {
    // Trigger sync
    console.log(`Syncing ${id}...`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Puzzle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Integrations Hub</h2>
            <p className="text-sm text-gray-600">Connect your favorite tools</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Integrations', value: integrations.length, color: 'blue' },
          { label: 'Active', value: integrations.filter(i => i.status === 'active').length, color: 'green' },
          { label: 'Available', value: integrations.filter(i => i.status === 'inactive').length, color: 'gray' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
            <div className={`text-3xl font-bold ${
              stat.color === 'blue' ? 'text-blue-600' :
              stat.color === 'green' ? 'text-green-600' :
              'text-gray-600'
            }`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border-2 border-gray-200 hover:border-purple-500 transition-all p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{integration.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{integration.name}</h3>
                  <div className="text-xs text-gray-500">{integration.category}</div>
                </div>
              </div>
              {integration.status === 'active' && (
                <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

            {/* Actions */}
            <div className="flex gap-2">
              {integration.status === 'active' ? (
                <>
                  <button
                    onClick={() => handleSync(integration.id)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Sync className="w-4 h-4" />
                    Sync
                  </button>
                  <button
                    onClick={() => handleDisconnect(integration.id)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Disconnect"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleConnect(integration.id)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <Plug className="w-4 h-4" />
                  Connect
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Add */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Need a Custom Integration?</h3>
            <p className="text-sm text-gray-600">Contact us to add your preferred tool</p>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Request Integration
          </button>
        </div>
      </div>
    </div>
  );
};

