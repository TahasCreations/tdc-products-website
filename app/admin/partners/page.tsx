"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Store,
  Mail,
  Phone,
  MapPin,
  ClipboardList,
  Truck,
  ShieldAlert,
  Search,
  RefreshCw,
  X,
} from "lucide-react";

type ApplicationStatus = "pending" | "approved" | "rejected";

type SellerType = "individual" | "company";
type SellerTypeFilter = "all" | SellerType;

type StatusFilter = "all" | ApplicationStatus;
type TypeFilter = "all" | "seller" | "influencer";

type BulkAction = "approve" | "reject";

interface SellerApplication {
  id: string;
  status: ApplicationStatus;
  sellerType: SellerType;
  storeName: string;
  storeSlug: string;
  description: string;
  storeCategory: string;
  businessYears: string | null;
  contactName: string;
  contactEmail: string;
  phone: string;
  whatsapp: string | null;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  taxId: string;
  taxOffice: string;
  iban: string;
  bankName: string;
  shippingPref: string | null;
  cargoCompanies: string[];
  preparationTime: string | null;
  returnPolicy: string | null;
  returnAddress: string | null;
  statusReason?: string | null;
  createdAt: string;
  processedAt?: string | null;
  processedBy?: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    roles: string | null;
    createdAt: string;
  };
}

type Application = SellerApplication & { type: "seller" };

type FetchParams = {
  status?: StatusFilter;
  type?: TypeFilter;
  sellerType?: SellerTypeFilter;
  q?: string;
  signal?: AbortSignal;
  showLoader?: boolean;
};

const SELLER_TYPE_OPTIONS: Array<{ value: SellerTypeFilter; label: string }> = [
  { value: "all", label: "Satıcı tipi (tümü)" },
  { value: "individual", label: "Bireysel" },
  { value: "company", label: "Kurumsal" },
];

const formatDate = (value: string) => new Date(value).toLocaleDateString("tr-TR");
const formatDateTime = (value: string) => new Date(value).toLocaleString("tr-TR");

export default function PartnersPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("seller");
  const [sellerTypeFilter, setSellerTypeFilter] = useState<SellerTypeFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const fetchApplications = useCallback(
    async (params?: FetchParams) => {
      const { showLoader = true, signal } = params ?? {};

      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setIsRefreshing(true);
        }

        const query = new URLSearchParams();

        if (params?.status && params.status !== "all") {
          query.set("status", params.status);
        }
        if (params?.type && params.type !== "all") {
          query.set("type", params.type);
        }
        if (params?.sellerType && params.sellerType !== "all") {
          query.set("sellerType", params.sellerType);
        }
        if (params?.q) {
          query.set("q", params.q);
        }

        const queryString = query.toString();
        const response = await fetch(
          `/api/admin/seller-applications${queryString ? `?${queryString}` : ""}`,
          {
            credentials: "include",
            signal,
          },
        );

        const json = await response.json();

        if (!response.ok && response.status !== 207) {
          throw new Error(json.error || "Başvurular yüklenemedi");
        }

        const data: SellerApplication[] = json.data ?? [];

        setApplications(
          data.map((application) => ({
            ...application,
            type: "seller",
            cargoCompanies: application.cargoCompanies ?? [],
          })),
        );
        setTotalCount(json.meta?.total ?? data.length ?? 0);
        setSelectedIds([]);
      } catch (error) {
        if ((error as Error)?.name === "AbortError") {
          return;
        }

        console.error("Başvurular yüklenirken hata:", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Başvurular alınırken bir hata oluştu.",
        );
      } finally {
        if (showLoader) {
          setLoading(false);
        } else {
          setIsRefreshing(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);

    return () => {
      window.clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();
    fetchApplications({
      status: filter,
      type: typeFilter,
      sellerType: sellerTypeFilter,
      q: debouncedSearch,
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [fetchApplications, filter, typeFilter, sellerTypeFilter, debouncedSearch]);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => applications.some((app) => app.id === id)));
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const statusMatch = filter === "all" || app.status === filter;
      const typeMatch = typeFilter === "all" || app.type === typeFilter;
      const sellerTypeMatch = sellerTypeFilter === "all" || app.sellerType === sellerTypeFilter;
      return statusMatch && typeMatch && sellerTypeMatch;
    });
  }, [applications, filter, typeFilter, sellerTypeFilter]);

  const totalSelected = selectedIds.length;
  const allSelected =
    filteredApplications.length > 0 &&
    filteredApplications.every((application) => selectedIds.includes(application.id));

  const toggleSelection = (applicationId: string) => {
    setSelectedIds((prev) =>
      prev.includes(applicationId)
        ? prev.filter((id) => id !== applicationId)
        : [...prev, applicationId],
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApplications.map((application) => application.id));
    }
  };

  const currentFilters = useMemo(
    () => ({
      status: filter,
      type: typeFilter,
      sellerType: sellerTypeFilter,
      q: debouncedSearch,
    }),
    [filter, typeFilter, sellerTypeFilter, debouncedSearch],
  );

  const handleManualRefresh = async () => {
    resetMessages();
    await fetchApplications({ ...currentFilters, showLoader: false });
  };

  const handleApprove = async (applicationId: string) => {
    if (!window.confirm("Başvuruyu onaylamak istediğinize emin misiniz?")) {
      return;
    }

    try {
      resetMessages();
      setProcessingId(applicationId);

      const response = await fetch(
        `/api/admin/seller-applications/${applicationId}/approve`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Başvuru onaylanamadı.");
      }

      setSuccessMessage(json.message || "Başvuru onaylandı.");
      setSelectedIds((prev) => prev.filter((id) => id !== applicationId));
      await fetchApplications({ ...currentFilters });
    } catch (error) {
      console.error("Onaylama hatası:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Onaylama sırasında bir hata oluştu.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    const reason = window.prompt("Reddetme gerekçesi (opsiyonel):");

    if (reason === null) {
      return;
    }

    try {
      resetMessages();
      setProcessingId(applicationId);

      const response = await fetch(
        `/api/admin/seller-applications/${applicationId}/reject`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Başvuru reddedilemedi.");
      }

      setSuccessMessage(json.message || "Başvuru reddedildi.");
      setSelectedIds((prev) => prev.filter((id) => id !== applicationId));
      await fetchApplications({ ...currentFilters });
    } catch (error) {
      console.error("Reddetme hatası:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Reddetme sırasında bir hata oluştu.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleBulkAction = async (action: BulkAction) => {
    if (totalSelected === 0) {
      return;
    }

    let rejectionReason: string | undefined;

    if (action === "approve") {
      const confirmed = window.confirm(
        `${totalSelected} başvuruyu onaylamak istediğinize emin misiniz?`,
      );
      if (!confirmed) {
        return;
      }
    } else {
      const promptResult = window.prompt(
        `${totalSelected} başvuruyu reddetmek üzeresiniz. Opsiyonel bir gerekçe girin (iptal için Vazgeç).`,
      );
      if (promptResult === null) {
        return;
      }
      rejectionReason = promptResult || undefined;
    }

    try {
      resetMessages();
      setBulkProcessing(true);

      const response = await fetch("/api/admin/seller-applications/bulk", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: selectedIds, reason: rejectionReason }),
      });

      const json = await response.json();

      if (!response.ok && response.status !== 207) {
        throw new Error(json.error || "Toplu işlem tamamlanamadı.");
      }

      const summary = json.summary ?? { successCount: 0, skippedCount: 0, errorCount: 0 };
      const details = `${totalSelected} başvurudan ${summary.successCount} işlem tamamlandı, ${summary.skippedCount} zaten işlenmiş, ${summary.errorCount} hata.`;

      if (summary.errorCount > 0) {
        const errored = (json.results || [])
          .filter((result: { status: string }) => result.status === "error")
          .map((result: { id: string; message: string }) => `${result.id}: ${result.message}`);

        setErrorMessage(
          errored.length > 0
            ? `${details} Hatalar: ${errored.join("; ")}`
            : `${details} Bazı başvurular işlenemedi.`,
        );

        if (summary.successCount > 0 || summary.skippedCount > 0) {
          setSuccessMessage(details);
        }
      } else {
        setSuccessMessage(details);
      }

      await fetchApplications({ ...currentFilters });
      setSelectedIds([]);
    } catch (error) {
      console.error("Toplu işlem hatası:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Toplu işlem sırasında bir hata oluştu.",
      );
    } finally {
      setBulkProcessing(false);
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CBA135]" />
      </div>
    );
  }

  const anyProcessing = processingId !== null || bulkProcessing;
  const hasSelections = totalSelected > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Başvuru Yönetimi</h1>
            <p className="text-gray-600">Satıcı başvurularını inceleyin, onaylayın veya reddedin</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600">
              Toplam başvuru: <span className="font-semibold text-gray-900">{totalCount}</span>
            </div>
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={loading || isRefreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#CBA135] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRefreshing ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#CBA135]" />
                  Yenileniyor
                </span>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Yenile
                </>
              )}
            </button>
          </div>
        </motion.div>

        {(errorMessage || successMessage) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 rounded-xl border px-4 py-3 ${
              errorMessage
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-green-50 border-green-200 text-green-700"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium">{errorMessage ?? successMessage}</p>
              <button
                type="button"
                onClick={resetMessages}
                className="text-xs font-semibold uppercase tracking-wide"
              >
                Kapat
              </button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Mağaza adı, iletişim bilgisi, vergi no veya şehir ile ara"
                  className="w-full rounded-lg border border-gray-300 pl-9 pr-10 py-2 text-sm focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-100 p-1 text-gray-500 hover:bg-gray-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value as StatusFilter)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
              >
                <option value="all">Tümü</option>
                <option value="pending">Beklemede</option>
                <option value="approved">Onaylandı</option>
                <option value="rejected">Reddedildi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Satıcı Tipi</label>
              <select
                value={sellerTypeFilter}
                onChange={(event) => setSellerTypeFilter(event.target.value as SellerTypeFilter)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
              >
                {SELLER_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {hasSelections && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
          >
            <p className="font-medium">
              {totalSelected} başvuru seçildi. Toplu aksiyon uygulayabilirsiniz.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleBulkAction("approve")}
                disabled={anyProcessing}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {bulkProcessing ? "İşleniyor…" : "Seçilileri Onayla"}
              </button>
              <button
                type="button"
                onClick={() => handleBulkAction("reject")}
                disabled={anyProcessing}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {bulkProcessing ? "İşleniyor…" : "Seçilileri Reddet"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
              >
                Seçimi Temizle
              </button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <User className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Başvuru Bulunamadı</h3>
              <p className="text-gray-600">Seçilen kriterlere uygun başvuru bulunmuyor.</p>
            </div>
          ) : (
            filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-[#CBA135] focus:ring-[#CBA135]"
                    checked={selectedIds.includes(application.id)}
                    onChange={() => toggleSelection(application.id)}
                    aria-label="Başvuruyu seç"
                  />

                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-4">
                      {getTypeIcon(application.type)}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {application.storeName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {getTypeText(application.type)} Başvurusu
                            </p>
                          </div>
                          <div className="ml-auto flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm">
                            {getStatusIcon(application.status)}
                            <span className="font-medium text-gray-700">
                              {getStatusText(application.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>
                          {application.contactName} · {application.user.name ?? "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(application.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        <span>{application.storeSlug}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-3">Mağaza Bilgileri</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                        <p>
                          <strong>Satıcı Tipi:</strong> {application.sellerType === "company" ? "Kurumsal" : "Bireysel"}
                        </p>
                        <p>
                          <strong>Kategori:</strong> {application.storeCategory}
                        </p>
                        <p>
                          <strong>Vergi / TC:</strong> {application.taxId}
                        </p>
                        <p>
                          <strong>Vergi Dairesi:</strong> {application.taxOffice}
                        </p>
                        <p>
                          <strong>IBAN:</strong> {application.iban}
                        </p>
                        <p>
                          <strong>Banka:</strong> {application.bankName}
                        </p>
                        <p>
                          <strong>Deneyim:</strong> {application.businessYears ?? "Belirtilmedi"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-3">İletişim & Adres</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{application.contactEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{application.phone}</span>
                        </div>
                        {application.whatsapp && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-500" />
                            <span>{application.whatsapp}</span>
                          </div>
                        )}
                        <div className="flex items-start gap-2 md:col-span-2">
                          <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                          <span>
                            {application.address}
                            <br />
                            {application.postalCode} {application.district} / {application.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-3">Lojistik ve Politikalar</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                        <p className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-gray-500" />
                          <span>
                            <strong>Kargo Hazırlık:</strong> {application.preparationTime ?? "Belirtilmedi"}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-gray-500" />
                          <span>
                            <strong>İade Politikası:</strong> {application.returnPolicy ?? "Belirtilmedi"}
                          </span>
                        </p>
                        <div className="md:col-span-2">
                          <strong>Kargo Firmaları:</strong> {application.cargoCompanies.length > 0 ? application.cargoCompanies.join(", ") : "Belirtilmedi"}
                        </div>
                        {application.returnAddress && (
                          <div className="md:col-span-2">
                            <strong>İade Adresi:</strong> {application.returnAddress}
                          </div>
                        )}
                      </div>
                    </div>

                    {application.status === "rejected" && application.statusReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-sm text-red-700">
                        <div className="flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 mt-0.5" />
                          <div>
                            <strong>Reddetme Gerekçesi:</strong>
                            <p>{application.statusReason}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      {application.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(application.id)}
                            disabled={anyProcessing}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {processingId === application.id ? "İşleniyor…" : "Onayla"}
                          </button>
                          <button
                            onClick={() => handleReject(application.id)}
                            disabled={anyProcessing}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {processingId === application.id ? "İşleniyor…" : "Reddet"}
                          </button>
                        </>
                      )}

                      {application.processedAt && (
                        <p className="text-xs text-gray-500">
                          İşleyen: {application.processedBy ?? "—"} · {formatDateTime(application.processedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {filteredApplications.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#CBA135] focus:ring-[#CBA135]"
                checked={allSelected}
                onChange={toggleSelectAll}
              />
              <span>Sayfadaki tüm başvuruları seç</span>
            </div>
            <span>
              Gösterilen başvurular: <strong>{filteredApplications.length}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusIcon(status: string) {
  switch (status) {
    case "approved":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "rejected":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-yellow-500" />;
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "approved":
      return "Onaylandı";
    case "rejected":
      return "Reddedildi";
    default:
      return "Beklemede";
  }
}

function getTypeIcon(type: string) {
  if (type === "seller") {
    return <Store className="w-5 h-5 text-blue-500" />;
  }
  return <User className="w-5 h-5 text-gray-500" />;
}

function getTypeText(type: string) {
  switch (type) {
    case "seller":
      return "Satıcı";
    case "influencer":
      return "Influencer";
    default:
      return "Bilinmiyor";
  }
}
