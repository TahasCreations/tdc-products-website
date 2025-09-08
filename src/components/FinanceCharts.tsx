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
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Gider',
        data: monthlyData.map(item => item.expenses),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Net Kar',
        data: monthlyData.map(item => item.profit),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
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

  // Kar-Zarar Bar Chart
  const profitLossData = {
    labels: ['Gelir', 'Gider', 'Net Kar'],
    datasets: [
      {
        data: [
          financeData.totalRevenue + financeData.totalOrders,
          financeData.totalExpenses,
          financeData.netProfit
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          financeData.netProfit >= 0 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          financeData.netProfit >= 0 ? 'rgb(59, 130, 246)' : 'rgb(239, 68, 68)'
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
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Toplam Gelir</p>
              <p className="text-2xl font-bold">
                {formatCurrency(financeData.totalRevenue + financeData.totalOrders)}
              </p>
            </div>
            <i className="ri-money-dollar-circle-line text-3xl text-green-200"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Toplam Gider</p>
              <p className="text-2xl font-bold">
                {formatCurrency(financeData.totalExpenses)}
              </p>
            </div>
            <i className="ri-money-dollar-box-line text-3xl text-red-200"></i>
          </div>
        </div>

        <div className={`p-6 rounded-lg text-white ${
          financeData.netProfit >= 0 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
            : 'bg-gradient-to-r from-red-500 to-red-600'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${financeData.netProfit >= 0 ? 'text-blue-100' : 'text-red-100'}`}>
                Net Kar
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(financeData.netProfit)}
              </p>
            </div>
            <i className={`text-3xl ${
              financeData.netProfit >= 0 
                ? 'ri-trending-up-line text-blue-200' 
                : 'ri-trending-down-line text-red-200'
            }`}></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Kar Marjı</p>
              <p className="text-2xl font-bold">
                %{financeData.profitMargin}
              </p>
            </div>
            <i className="ri-percent-line text-3xl text-purple-200"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
