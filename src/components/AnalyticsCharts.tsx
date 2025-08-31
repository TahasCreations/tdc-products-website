'use client';

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartProps {
  data: any[];
  title: string;
  height?: number;
}

// Günlük sipariş trendi grafiği
export const DailyOrdersChart: React.FC<ChartProps> = ({ data, title, height = 300 }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('tr-TR')}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString('tr-TR')}
            formatter={(value: any) => [value, 'Sipariş Sayısı']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#667eea" 
            strokeWidth={2}
            dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Günlük satış trendi grafiği
export const DailySalesChart: React.FC<ChartProps> = ({ data, title, height = 300 }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('tr-TR')}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString('tr-TR')}
            formatter={(value: any) => [`₺${value.toLocaleString('tr-TR')}`, 'Gelir']}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#28a745" 
            fill="#28a745" 
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Haftalık satış grafiği
export const WeeklySalesChart: React.FC<ChartProps> = ({ data, title, height = 300 }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="week" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('tr-TR')}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString('tr-TR')}
            formatter={(value: any) => [`₺${value.toLocaleString('tr-TR')}`, 'Gelir']}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#007bff" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Aylık satış grafiği
export const MonthlySalesChart: React.FC<ChartProps> = ({ data, title, height = 300 }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tickFormatter={(value) => {
              const [year, month] = value.split('-');
              return `${month}/${year}`;
            }}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => {
              const [year, month] = value.split('-');
              return `${month}/${year}`;
            }}
            formatter={(value: any) => [`₺${value.toLocaleString('tr-TR')}`, 'Gelir']}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#6f42c1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Sipariş durumu dağılımı pasta grafiği
export const OrderStatusChart: React.FC<ChartProps> = ({ data, title, height = 300 }) => {
  const COLORS = ['#28a745', '#007bff', '#ffc107', '#dc3545', '#6c757d'];

  const statusLabels: { [key: string]: string } = {
    pending: 'Beklemede',
    confirmed: 'Onaylandı',
    shipped: 'Kargoda',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal Edildi'
  };

  const chartData = data.map(item => ({
    ...item,
    name: statusLabels[item.status] || item.status
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => [value, 'Sipariş Sayısı']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Kategori satışları grafiği
export const CategorySalesChart: React.FC<ChartProps> = ({ data, title, height = 300 }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="category" type="category" width={100} />
          <Tooltip 
            formatter={(value: any) => [`₺${value.toLocaleString('tr-TR')}`, 'Gelir']}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#e83e8c" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Stok durumu grafiği
export const StockStatusChart: React.FC<{ data: any; title: string; height?: number }> = ({ 
  data, 
  title, 
  height = 300 
}) => {
  const COLORS = ['#28a745', '#ffc107', '#dc3545'];

  const chartData = [
    { name: 'Stokta', value: data.inStock, color: COLORS[0] },
    { name: 'Düşük Stok', value: data.lowStock, color: COLORS[1] },
    { name: 'Stok Tükendi', value: data.outOfStock, color: COLORS[2] }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => [value, 'Ürün Sayısı']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Müşteri aktivite grafiği
export const CustomerActivityChart: React.FC<{ data: any; title: string; height?: number }> = ({ 
  data, 
  title, 
  height = 300 
}) => {
  const COLORS = ['#28a745', '#ffc107', '#6c757d'];

  const chartData = [
    { name: 'Aktif', value: data.active, color: COLORS[0] },
    { name: 'Orta', value: data.moderate, color: COLORS[1] },
    { name: 'Pasif', value: data.inactive, color: COLORS[2] }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => [value, 'Müşteri Sayısı']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// İstatistik kartı bileşeni
export const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: string;
  color: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}> = ({ title, value, icon, color, change, changeType = 'neutral' }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive': return 'ri-arrow-up-line';
      case 'negative': return 'ri-arrow-down-line';
      default: return 'ri-minus-line';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${getChangeColor()}`}>
              <i className={`${getChangeIcon()} mr-1`}></i>
              {change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <i className={`${icon} text-2xl text-white`}></i>
        </div>
      </div>
    </div>
  );
};

// Tablo bileşeni
export const AnalyticsTable: React.FC<{
  title: string;
  data: any[];
  columns: { key: string; label: string; render?: (value: any, row: any) => React.ReactNode }[];
}> = ({ title, data, columns }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
