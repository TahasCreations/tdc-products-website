'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface FinanceChartsProps {
  financeData: {
    totalRevenue: number;
    totalExpenses: number;
    totalOrders: number;
    netProfit: number;
    profitMargin: number;
    expensesByCategory: Record<string, number>;
    period: {
      month: string;
      year: string;
      startDate: string;
      endDate: string;
    };
  };
  monthlyData?: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
}

export default function FinanceCharts({ financeData, monthlyData }: FinanceChartsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getCategoryName = (category: string) => {
    const categoryNames: Record<string, string> = {
      'vergi': 'Vergiler',
      'maas': 'Maaşlar',
      'sgk': 'SGK Primleri',
      'kira': 'Kira',
      'elektrik': 'Elektrik',
      'su': 'Su',
      'internet': 'İnternet',
      'diger': 'Diğer'
    };
    return categoryNames[category] || category;
  };

  // Gider Kategorileri Doughnut Chart
  const expensesChartData = {
    labels: Object.keys(financeData.expensesByCategory).map(getCategoryName),
    datasets: [
      {
        data: Object.values(financeData.expensesByCategory),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const expensesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Gider Kategorileri Dağılımı',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(value)} (%${percentage})`;
          }
        }
      }
    }
  };

  // Aylık Trend Chart (eğer veri varsa)
  const monthlyChartData = monthlyData ? {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Gelir',
        data: monthlyData.map(item => item.revenue),
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.4
      },
      {
        label: 'Gider',
        data: monthlyData.map(item => item.expenses),
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.4
      },
      {
        label: 'Kar',
        data: monthlyData.map(item => item.profit),
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4
      }
    ]
  } : null;

  const monthlyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Aylık Finansal Trend',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  // Kar-Zarar Analizi Bar Chart
  const profitLossData = {
    labels: ['Gelir', 'Gider', 'Net Kar'],
    datasets: [
      {
        label: 'Tutar (₺)',
        data: [
          financeData.totalRevenue,
          financeData.totalExpenses,
          financeData.netProfit
        ],
        backgroundColor: [
          '#4BC0C0',
          '#FF6384',
          financeData.netProfit >= 0 ? '#36A2EB' : '#FF6384'
        ],
        borderColor: [
          '#4BC0C0',
          '#FF6384',
          financeData.netProfit >= 0 ? '#36A2EB' : '#FF6384'
        ],
        borderWidth: 2
      }
    ]
  };

  const profitLossOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Kar-Zarar Analizi',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Kar-Zarar Analizi */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="h-96">
          <Bar data={profitLossData} options={profitLossOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gider Kategorileri */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-96">
            <Doughnut data={expensesChartData} options={expensesChartOptions} />
          </div>
        </div>

        {/* Aylık Trend (eğer veri varsa) */}
        {monthlyChartData && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-96">
              <Line data={monthlyChartData} options={monthlyChartOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Finansal Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(financeData.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <i className="ri-money-dollar-box-line text-2xl text-red-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(financeData.totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${financeData.netProfit >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
              <i className={`ri-line-chart-line text-2xl ${financeData.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Kar</p>
              <p className={`text-2xl font-semibold ${financeData.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(financeData.netProfit)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <i className="ri-percent-line text-2xl text-purple-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Kar Marjı</p>
              <p className="text-2xl font-semibold text-gray-900">
                %{financeData.profitMargin.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}