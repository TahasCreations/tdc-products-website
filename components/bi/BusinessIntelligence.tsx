"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  FileText,
  DownloadCloud,
  Zap
} from 'lucide-react';

export const BusinessIntelligence: React.FC = () => {
  const [selectedKPI, setSelectedKPI] = useState<string>('revenue');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const kpis = [
    { id: 'revenue', name: 'Total Revenue', value: '$450,000', target: '$500,000', progress: 90, trend: 'up', change: '+12.5%' },
    { id: 'customers', name: 'Active Customers', value: '12,500', target: '15,000', progress: 83, trend: 'up', change: '+8.3%' },
    { id: 'orders', name: 'Total Orders', value: '3,400', target: '4,000', progress: 85, trend: 'up', change: '+15.2%' },
    { id: 'aov', name: 'Avg Order Value', value: '$132.35', target: '$150', progress: 88, trend: 'stable', change: '-2.1%' },
    { id: 'conversion', name: 'Conversion Rate', value: '3.2%', target: '4.0%', progress: 80, trend: 'down', change: '-5.0%' },
  ];

  const reports = [
    { name: 'Sales Report', type: 'sales', format: 'pdf' },
    { name: 'Customer Report', type: 'customers', format: 'excel' },
    { name: 'Product Report', type: 'products', format: 'csv' },
    { name: 'Financial Report', type: 'financial', format: 'pdf' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Intelligence</h2>
          <p className="text-sm text-gray-600">Data-driven insights for your business</p>
        </div>
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">{kpi.name}</span>
              <span className={`text-xs font-semibold flex items-center gap-1 ${
                kpi.trend === 'up' ? 'text-green-600' :
                kpi.trend === 'down' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'} {kpi.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{kpi.value}</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  kpi.progress >= 90 ? 'bg-green-600' :
                  kpi.progress >= 70 ? 'bg-blue-600' :
                  'bg-yellow-600'
                }`}
                style={{ width: `${kpi.progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">Target: {kpi.target}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Revenue Trend</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart will be rendered here</p>
          </div>
        </div>

        {/* Customer Growth */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Customer Growth</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart will be rendered here</p>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Reports</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Create Report
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{report.name}</div>
                  <div className="text-xs text-gray-500">Last generated: 2 hours ago</div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

