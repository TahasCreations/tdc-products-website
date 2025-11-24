"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Sparkles,
  Clock,
  AlertCircle,
  Wallet,
  PiggyBank,
  Banknote,
  Eye,
} from "lucide-react";

import type { SellerDashboardData } from "@/lib/seller-dashboard";

interface SellerDashboardContentProps {
  data: SellerDashboardData;
}

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-red-100 text-red-800",
};

const PAYOUT_STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

function formatCurrency(value: number) {
  return `₺${value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleDateString("tr-TR");
}

function translateStatus(status: string) {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case "pending":
      return "Beklemede";
    case "paid":
      return "Ödendi";
    case "shipped":
      return "Kargoda";
    case "delivered":
    case "completed":
      return "Teslim Edildi";
    case "cancelled":
      return "İptal Edildi";
    case "refunded":
      return "İade";
    default:
      return status;
  }
}

export default function SellerDashboardContent({ data }: SellerDashboardContentProps) {
  const { metrics, recentOrders, lowStock, payouts } = data;

  const summaryCards = [
    {
      label: "Toplam Ürün",
      value: metrics.productCount,
      icon: Package,
      gradient: "from-blue-600 to-cyan-600",
    },
    {
      label: "Aktif Ürün",
      value: metrics.activeProductCount,
      icon: ShoppingCart,
      gradient: "from-green-600 to-emerald-600",
    },
    {
      label: "Toplam Sipariş",
      value: metrics.orderCount,
      icon: TrendingUp,
      gradient: "from-purple-600 to-pink-600",
    },
    {
      label: "Mağaza Puanı",
      value: metrics.rating.toFixed(1),
      icon: Star,
      gradient: "from-yellow-600 to-orange-600",
    },
  ];

  const financialCards = [
    {
      label: "Teslim Edilen Gelir",
      value: formatCurrency(metrics.revenueDelivered),
      icon: DollarSign,
      gradient: "from-indigo-600 to-purple-600",
    },
    {
      label: "Bekleyen Ödeme",
      value: formatCurrency(metrics.pendingPayoutAmount),
      icon: Wallet,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      label: "Ödenen Toplam",
      value: formatCurrency(metrics.paidPayoutAmount),
      icon: PiggyBank,
      gradient: "from-emerald-600 to-teal-600",
    },
    {
      label: "Kullanılabilir Bakiye",
      value: formatCurrency(metrics.availableBalance),
      icon: Banknote,
      gradient: "from-slate-600 to-slate-800",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
              Satıcı Paneli
            </h1>
            <p className="text-gray-600 mt-1">
              Hoş geldiniz, <span className="font-semibold text-indigo-600">{metrics.storeName}</span>!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{metrics.plan} Plan</span>
            </div>
            <div className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wide ${metrics.storeStatus === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {metrics.storeStatus === "approved" ? "Onaylı Mağaza" : metrics.storeStatus}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10`} />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center`}> 
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{card.label}</p>
              <p className="text-3xl font-black text-gray-900">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10`} />
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-11 h-11 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center`}> 
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Son Siparişler</h2>
            <Link
              href="/partner/seller/orders"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Tümünü Gör →
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.length === 0 && (
              <div className="text-center text-gray-500 py-8 border border-dashed border-gray-200 rounded-xl">
                Henüz siparişiniz bulunmuyor.
              </div>
            )}

            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1">#{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">
                      {order.customerName ?? "İsimsiz"} ({order.customerEmail ?? "-"})
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        ORDER_STATUS_STYLES[order.status.toLowerCase()] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {translateStatus(order.status)}
                    </span>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(order.total)}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                          IMG
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">
                          {item.qty} adet × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Düşük Stok Uyarısı</h2>
          </div>

          <div className="space-y-3">
            {lowStock.length === 0 && (
              <div className="text-center text-gray-500 py-6 border border-dashed border-gray-200 rounded-xl">
                Kritik stokta ürün bulunmuyor.
              </div>
            )}
            {lowStock.map((product) => (
              <div key={product.id} className="p-3 border border-red-100 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded-lg border border-red-100"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-red-100 text-red-500 rounded-lg flex items-center justify-center text-xs font-semibold">
                      IMG
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{product.title}</p>
                    <p className="text-xs text-gray-500 capitalize">{product.productType.toLowerCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">Stok: {product.stock}</p>
                    <p className="text-xs text-gray-500">Fiyat: {formatCurrency(product.price)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/partner/seller/products/inventory"
            className="mt-4 w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Stok Yönetimi</span>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Ödeme Geçmişi</h2>
          <Link href="/partner/seller/finance" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
            Finans Paneli →
          </Link>
        </div>

        <div className="space-y-3">
          {payouts.length === 0 && (
            <div className="text-center text-gray-500 py-6 border border-dashed border-gray-200 rounded-xl">
              Henüz ödeme kaydı bulunmuyor.
            </div>
          )}

          {payouts.map((payout) => (
            <div
              key={payout.id}
              className="p-4 border border-gray-100 rounded-xl flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm text-gray-500">{formatDate(payout.createdAt)}</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(payout.amount)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    PAYOUT_STATUS_STYLES[payout.status.toLowerCase()] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {translateStatus(payout.status)}
                </span>
                <p className="text-xs text-gray-500">
                  {payout.processedAt ? `İşlendi: ${formatDate(payout.processedAt)}` : "İşlem bekleniyor"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Link
          href="/partner/seller/products/new"
          className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all group"
        >
          <Package className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-bold">Yeni Ürün Ekle</p>
          <p className="text-sm text-white/80">Ürün yükle</p>
        </Link>

        <Link
          href="/partner/seller/marketing/campaigns"
          className="p-6 bg-gradient-to-br from-pink-600 to-rose-600 text-white rounded-2xl hover:shadow-xl transition-all group"
        >
          <TrendingUp className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-bold">Kampanya Oluştur</p>
          <p className="text-sm text-white/80">Satışları artır</p>
        </Link>

        <Link
          href="/partner/seller/analytics"
          className="p-6 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-2xl hover:shadow-xl transition-all group"
        >
          <Eye className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-bold">Analitik</p>
          <p className="text-sm text-white/80">Performansı gör</p>
        </Link>

        <Link
          href="/partner/seller/customers"
          className="p-6 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-xl transition-all group"
        >
          <Users className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-bold">Müşteriler</p>
          <p className="text-sm text-white/80">CRM yönetimi</p>
        </Link>
      </motion.div>
    </div>
  );
}


