"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

type PayoutEntry = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  meta?: Record<string, any> | null;
  createdAt: string;
  processedAt: string | null;
};

type FinancialSnapshot = {
  revenueTotal: number;
  revenueDelivered: number;
  pendingPayoutAmount: number;
  paidPayoutAmount: number;
  availableBalance: number;
};

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
});

export default function PayoutsReportPage() {
  const [entries, setEntries] = useState<PayoutEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [financials, setFinancials] = useState<FinancialSnapshot | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchData(page, statusFilter);
  }, [page, statusFilter]);

  const fetchData = async (page: number, status: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), pageSize: "20" });
      if (status !== "all") params.append("status", status);

      const response = await fetch(`/api/seller/payouts?${params.toString()}`);
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Ödeme kayıtları alınamadı.");
      }

      const json = await response.json();
      setEntries(json.data);
      setTotalPages(json.meta.totalPages);
      setFinancials(json.meta.financials);
    } catch (error: any) {
      console.error("Error fetching payouts data:", error);
      window.alert(error.message || "Ödemeler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = () => {
    if (!financials || financials.availableBalance <= 0) {
      window.alert("Talep edilebilir bakiye bulunmuyor.");
      return;
    }

    const input = window
      .prompt(
        `Talep edilecek tutarı girin (maksimum ${currencyFormatter.format(financials.availableBalance)}). Boş bırakılırsa tamamı talep edilir.`,
      )
      ?.trim();

    let amount: number | undefined;
    if (input && input.length > 0) {
      const parsed = Number.parseFloat(input.replace(",", "."));
      if (Number.isNaN(parsed) || parsed <= 0) {
        window.alert("Geçerli bir tutar girin.");
        return;
      }
      amount = parsed;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/seller/payouts/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error || "Ödeme isteği oluşturulamadı.");
        }

        window.alert("Ödeme isteğiniz oluşturuldu. Finans ekibi en kısa sürede işleyecektir.");
        fetchData(1, statusFilter);
        setPage(1);
      } catch (error: any) {
        console.error("Payout request error:", error);
        window.alert(error.message || "Ödeme isteği oluşturulamadı.");
      }
    });
  };

  const totals = useMemo(() => {
    const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
    return { count: entries.length, totalAmount, average: entries.length ? totalAmount / entries.length : 0 };
  }, [entries]);

  const renderStatusTag = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      scheduled: { label: "Planlandı", className: "bg-yellow-100 text-yellow-700" },
      processing: { label: "İşleniyor", className: "bg-blue-100 text-blue-700" },
      paid: { label: "Ödendi", className: "bg-green-100 text-green-700" },
      failed: { label: "Başarısız", className: "bg-red-100 text-red-700" },
    };

    const info = map[status] ?? { label: status, className: "bg-gray-100 text-gray-600" };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${info.className}`}>{info.label}</span>;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg" />
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ödeme Raporları</h1>
          <p className="text-sm text-gray-500">Planlanan ve tamamlanan tüm ödemelerinizi görüntüleyin.</p>
        </div>
        <button
          onClick={handleRequestPayout}
          disabled={isPending}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          Ödeme Talep Et
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard title="Kullanılabilir Bakiye" value={financials ? currencyFormatter.format(financials.availableBalance) : "₺0,00"} tone="text-emerald-600" />
        <SummaryCard title="Bekleyen Ödemeler" value={financials ? currencyFormatter.format(financials.pendingPayoutAmount) : "₺0,00"} tone="text-yellow-600" />
        <SummaryCard title="Toplam Ödendi" value={financials ? currencyFormatter.format(financials.paidPayoutAmount) : "₺0,00"} tone="text-blue-600" />
        <SummaryCard title="Ortalama Ödeme" value={currencyFormatter.format(totals.average)} tone="text-purple-600" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Durum</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tümü</option>
              <option value="scheduled">Planlandı</option>
              <option value="processing">İşleniyor</option>
              <option value="paid">Ödendi</option>
              <option value="failed">Başarısız</option>
            </select>
          </div>

          <button
            onClick={() => handleExport(entries)}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
          >
            CSV İndir
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Ödeme Detayları</h2>
          <span className="text-sm text-gray-500">
            {entries.length} kayıt · Toplam {currencyFormatter.format(totals.totalAmount)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>Tarih</Th>
                <Th>Tutar</Th>
                <Th>Durum</Th>
                <Th>Not</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <Td>{new Date(entry.createdAt).toLocaleString("tr-TR")}</Td>
                  <Td>{currencyFormatter.format(entry.amount)}</Td>
                  <Td>{renderStatusTag(entry.status)}</Td>
                  <Td>{entry.meta?.note || entry.meta?.reference || "-"}</Td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm text-gray-500">
                    Henüz ödeme kaydı bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 disabled:opacity-50"
            >
              Önceki
            </button>
            <span className="text-sm text-gray-500">
              Sayfa {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 disabled:opacity-50"
            >
              Sonraki
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value, tone }: { title: string; value: string; tone: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`text-2xl font-bold mt-2 ${tone}`}>{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{children}</td>;
}

function handleExport(entries: PayoutEntry[]) {
  if (entries.length === 0) {
    window.alert("Aktarılacak kayıt bulunmuyor.");
    return;
  }

  const rows = [
    ["Tarih", "Tutar", "Durum", "Not"],
    ...entries.map((entry) => [
      new Date(entry.createdAt).toLocaleString("tr-TR"),
      entry.amount.toFixed(2),
      entry.status,
      entry.meta?.note || entry.meta?.reference || "",
    ]),
  ];

  const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  const link = document.createElement("a");
  link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
  link.download = `payouts-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

