"use client";

import { useMemo, useState, useTransition } from "react";
import { motion } from "framer-motion";

type SellerOrderItem = {
  id: string;
  productId: string;
  title: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
  image: string | null;
  status: string;
  trackingCode: string | null;
  trackingCarrier: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  sellerNotes: string | null;
};

export type SellerOrder = {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  customerName: string | null;
  customerEmail: string | null;
  total: number;
  items: SellerOrderItem[];
};

interface SellerOrdersContentProps {
  initialOrders: SellerOrder[];
  storeName: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Beklemede",
  processing: "Hazırlanıyor",
  paid: "Ödendi",
  shipped: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  paid: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
});

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("tr-TR");
}

export default function SellerOrdersContent({ initialOrders, storeName }: SellerOrdersContentProps) {
  const [orders, setOrders] = useState<SellerOrder[]>(initialOrders);
  const [isPending, startTransition] = useTransition();

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((order) => order.status === "pending" || order.status === "processing").length;
    const shipped = orders.filter((order) => order.status === "shipped").length;
    const delivered = orders.filter((order) => order.status === "delivered").length;

    return { total, pending, shipped, delivered };
  }, [orders]);

  const handleUpdateStatus = (orderId: string, status: "processing" | "shipped" | "delivered") => {
    let trackingCode: string | undefined;
    let trackingCarrier: string | undefined;

    if (status === "shipped") {
      trackingCode = window.prompt("Kargo takip numarası (opsiyonel):") || undefined;
      trackingCarrier = window.prompt("Kargo firması (opsiyonel):") || undefined;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/seller/orders/${orderId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            trackingCode: trackingCode?.trim() || undefined,
            trackingCarrier: trackingCarrier?.trim() || undefined,
          }),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(errorBody.error || "İşlem başarısız.");
        }

        const json = await response.json();
        const updatedOrder = json.data as SellerOrder;

        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? { ...order, ...updatedOrder } : order)),
        );
      } catch (error: any) {
        console.error("Order status update error:", error);
        window.alert(error.message || "Sipariş güncellenirken hata oluştu.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sipariş Yönetimi</h1>
          <p className="text-gray-600">{storeName} mağazanızın siparişlerini yönetin</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Toplam Sipariş" value={stats.total} color="text-gray-900" />
          <StatCard title="Bekleyen / Hazırlanıyor" value={stats.pending} color="text-yellow-600" />
          <StatCard title="Kargoda" value={stats.shipped} color="text-blue-600" />
          <StatCard title="Teslim Edildi" value={stats.delivered} color="text-green-600" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Siparişler</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <div key={order.id} className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">#{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">
                      {order.customerName || "İsimsiz"} ({order.customerEmail || "E-posta yok"})
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <p className="text-lg font-bold text-gray-900">{currencyFormatter.format(order.total)}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-14 h-14 rounded-lg object-cover" />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                            IMG
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            {item.qty} adet × {currencyFormatter.format(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-1 text-sm text-gray-600">
                        <span>
                          Durum:{" "}
                          <span className="font-medium text-gray-800">
                            {STATUS_LABELS[item.status] ?? item.status}
                          </span>
                        </span>
                        {item.trackingCode && (
                          <span>
                            Takip: <span className="font-medium">{item.trackingCode}</span>
                          </span>
                        )}
                        {item.trackingCarrier && <span>Kargo: {item.trackingCarrier}</span>}
                        {item.shippedAt && <span>Kargoya verildi: {formatDate(item.shippedAt)}</span>}
                        {item.deliveredAt && <span>Teslim: {formatDate(item.deliveredAt)}</span>}
                        <p className="text-base font-semibold text-gray-900">
                          {currencyFormatter.format(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    disabled={isPending}
                    onClick={() => handleUpdateStatus(order.id, "processing")}
                  >
                    Hazırlanıyor
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    disabled={isPending}
                    onClick={() => handleUpdateStatus(order.id, "shipped")}
                  >
                    Kargoya Ver
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                    disabled={isPending}
                    onClick={() => handleUpdateStatus(order.id, "delivered")}
                  >
                    Teslim Edildi
                  </button>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz sipariş yok</h3>
                <p className="text-gray-500">Ürünlerinizi ekleyerek ilk siparişinizi bekleyin</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </motion.div>
  );
}




