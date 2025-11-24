"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Users2,
  Mail,
  Phone,
  Search,
  RefreshCw,
  X,
  Sparkles,
  Globe,
  Heart,
  BarChart2,
  Link as LinkIcon,
  FileText,
  ShieldAlert,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "Tümü" },
  { value: "pending", label: "Beklemede" },
  { value: "approved", label: "Onaylandı" },
  { value: "rejected", label: "Reddedildi" },
] as const;

type ApplicationStatus = "pending" | "approved" | "rejected";
type StatusFilter = (typeof STATUS_OPTIONS)[number]["value"];
type PlatformFilter = "all" | "instagram" | "tiktok" | "youtube" | "website" | "other";

type BulkAction = "approve" | "reject";

type JsonRecord = Record<string, unknown> | null;

type InfluencerApplication = {
  id: string;
  status: ApplicationStatus;
  statusReason?: string | null;
  category?: string | null;
  primaryPlatform?: string | null;
  postingFrequency?: string | null;
  followerEst?: number | null;
  avgViews?: number | null;
  avgLikes?: number | null;
  collaborationTypes: string[];
  profile: JsonRecord;
  socialLinks: Record<string, string | undefined> | null;
  audience: JsonRecord;
  performance: JsonRecord;
  preferences: JsonRecord;
  portfolio?: string | null;
  pastCollaborations?: string | null;
  notes?: string | null;
  consents: JsonRecord;
  agreement: boolean;
  communicationConsent: boolean;
  dataProcessingConsent: boolean;
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
};

type FetchParams = {
  status?: StatusFilter;
  platform?: PlatformFilter;
  category?: string | null;
  q?: string;
  signal?: AbortSignal;
  showLoader?: boolean;
};

const PLATFORM_OPTIONS: Array<{ value: PlatformFilter; label: string }> = [
  { value: "all", label: "Platform (tümü)" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "website", label: "Website" },
  { value: "other", label: "Diğer" },
];

const formatDate = (value: string) => new Date(value).toLocaleDateString("tr-TR");
const formatDateTime = (value: string) => new Date(value).toLocaleString("tr-TR");
const formatNumber = (value?: number | null) =>
  typeof value === "number" && Number.isFinite(value) ? value.toLocaleString("tr-TR") : "—";

const PLATFORM_KEYS = ["instagram", "tiktok", "youtube", "website", "twitter"];

function normalizeSocialLinks(source: Record<string, string | undefined> | null | undefined) {
  if (!source) return {} as Record<string, string>;
  return Object.fromEntries(
    Object.entries(source)
      .filter(([_, value]) => typeof value === "string" && value.trim().length > 0)
      .map(([key, value]) => [key, (value ?? "").trim()]),
  );
}

function getStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.length > 0);
  }
  return [];
}

function getAudienceValue(record: JsonRecord, key: string): string | null {
  if (!record || typeof record !== "object") {
    return null;
  }
  const value = record[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

export default function InfluencerApplicationsPage() {
  const [applications, setApplications] = useState<InfluencerApplication[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
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
        if (params?.platform && params.platform !== "all") {
          query.set("platform", params.platform);
        }
        if (params?.category && params.category !== "all") {
          query.set("category", params.category);
        }
        if (params?.q) {
          query.set("q", params.q);
        }

        const response = await fetch(
          `/api/admin/influencer-applications${query.toString() ? `?${query.toString()}` : ""}`,
          {
            credentials: "include",
            signal,
          },
        );

        const json = await response.json();

        if (!response.ok && response.status !== 207) {
          throw new Error(json.error || "Başvurular yüklenemedi");
        }

        const data: InfluencerApplication[] = (json.data ?? []).map((item: any) => ({
          ...item,
          socialLinks: normalizeSocialLinks(item.socialLinks),
          collaborationTypes: getStringArray(item.collaborationTypes),
        }));

        setApplications(data);
        setTotalCount(json.meta?.total ?? data.length ?? 0);
        setSelectedIds([]);
      } catch (error) {
        if ((error as Error)?.name === "AbortError") {
          return;
        }

        console.error("Influencer başvuruları yüklenirken hata:", error);
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
    return () => window.clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();
    fetchApplications({
      status: statusFilter,
      platform: platformFilter,
      category: categoryFilter,
      q: debouncedSearch,
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [fetchApplications, statusFilter, platformFilter, categoryFilter, debouncedSearch]);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => applications.some((app) => app.id === id)));
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const statusMatch = statusFilter === "all" || application.status === statusFilter;
      const platformMatch =
        platformFilter === "all" || (application.primaryPlatform ?? "other") === platformFilter;
      const categoryMatch = categoryFilter === "all" || application.category === categoryFilter;
      return statusMatch && platformMatch && categoryMatch;
    });
  }, [applications, statusFilter, platformFilter, categoryFilter]);

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
      status: statusFilter,
      platform: platformFilter,
      category: categoryFilter,
      q: debouncedSearch,
    }),
    [statusFilter, platformFilter, categoryFilter, debouncedSearch],
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
        `/api/admin/influencer-applications/${applicationId}/approve`,
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
        `/api/admin/influencer-applications/${applicationId}/reject`,
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

      const response = await fetch("/api/admin/influencer-applications/bulk", {
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

  const stats = useMemo(() => {
    const pending = applications.filter((app) => app.status === "pending").length;
    const approved = applications.filter((app) => app.status === "approved").length;
    const rejected = applications.filter((app) => app.status === "rejected").length;
    return { total: applications.length, pending, approved, rejected };
  }, [applications]);

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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Influencer Başvuruları</h1>
              <p className="text-gray-600">Influencer başvurularını inceleyin, onaylayın veya reddedin</p>
            </div>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <StatCard title="Toplam Başvuru" value={stats.total} icon={<Users2 className="w-6 h-6 text-blue-500" />} />
          <StatCard title="Bekleyen" value={stats.pending} variant="warning" icon={<Clock className="w-6 h-6 text-yellow-500" />} />
          <StatCard title="Onaylanan" value={stats.approved} variant="success" icon={<CheckCircle className="w-6 h-6 text-green-500" />} />
          <StatCard title="Reddedilen" value={stats.rejected} variant="danger" icon={<XCircle className="w-6 h-6 text-red-500" />} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="İsim, e-posta veya notlarla ara"
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
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                value={platformFilter}
                onChange={(event) => setPlatformFilter(event.target.value as PlatformFilter)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
              >
                {PLATFORM_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
              >
                <option value="all">Kategori (tümü)</option>
                {Array.from(new Set(applications.map((app) => app.category).filter(Boolean))).map(
                  (category) => (
                    <option key={category} value={category!}>
                      {category}
                    </option>
                  ),
                )}
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
            <p className="font-medium">{totalSelected} başvuru seçildi. Toplu aksiyon uygulayabilirsiniz.</p>
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
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Başvuru Bulunamadı</h3>
              <p className="text-gray-600">Seçilen kriterlere uygun influencer başvurusu bulunmuyor.</p>
            </div>
          ) : (
            filteredApplications.map((application, index) => {
              const profile = (application.profile ?? {}) as Record<string, unknown>;
              const audience = application.audience ?? {};
              const performance = application.performance ?? {};
              const socialLinks = normalizeSocialLinks(application.socialLinks);
              const totalFollowers = application.followerEst ?? null;

              const audienceAge = getAudienceValue(audience, "audienceAge");
              const audienceGender = getAudienceValue(audience, "audienceGender");
              const topCountries = getAudienceValue(audience, "topCountries");

              const avgEngagement =
                application.followerEst && application.followerEst > 0 && application.avgLikes
                  ? Number(((application.avgLikes / application.followerEst) * 100).toFixed(2))
                  : null;

              const statusBadgeClass =
                application.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : application.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700";

              return (
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
                      <div className="flex flex-wrap items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {(profile.fullName as string) || application.user.name || "İsimsiz Influencer"}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            {application.user.email ?? "—"}
                          </div>
                          {typeof profile.phone === "string" && profile.phone.trim().length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              {profile.phone as string}
                            </div>
                          )}
                        </div>
                        <div className={`ml-auto flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${statusBadgeClass}`}>
                          {application.status === "approved" && <CheckCircle className="w-4 h-4" />}
                          {application.status === "rejected" && <XCircle className="w-4 h-4" />}
                          {application.status === "pending" && <Clock className="w-4 h-4" />}
                          {application.status === "approved"
                            ? "Onaylandı"
                            : application.status === "rejected"
                            ? "Reddedildi"
                            : "Beklemede"}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-purple-600" /> Sosyal Medya
                          </h4>
                          <div className="space-y-2 text-sm text-gray-700">
                            {PLATFORM_KEYS.filter((key) => socialLinks[key]).length === 0 && (
                              <p className="text-gray-500">Sosyal medya bağlantısı paylaşılmamış.</p>
                            )}
                            {PLATFORM_KEYS.filter((key) => socialLinks[key]).map((key) => (
                              <a
                                key={key}
                                href={socialLinks[key]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                              >
                                <LinkIcon className="w-4 h-4" />
                                <span className="capitalize">{key}</span>
                              </a>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-pink-600" /> Performans
                          </h4>
                          <div className="space-y-2 text-sm text-gray-700">
                            <MetricRow label="Takipçi" value={formatNumber(totalFollowers)} />
                            <MetricRow label="Ortalama Görüntülenme" value={formatNumber(application.avgViews)} />
                            <MetricRow label="Ortalama Beğeni" value={formatNumber(application.avgLikes)} />
                            <MetricRow
                              label="Etkileşim Oranı"
                              value={avgEngagement !== null ? `${avgEngagement}%` : "—"}
                            />
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-amber-600" /> Kategoriler & Notlar
                          </h4>
                          <div className="space-y-2 text-sm text-gray-700">
                            <MetricRow label="Kategori" value={application.category ?? "—"} />
                            <MetricRow label="Ana Platform" value={application.primaryPlatform ?? "—"} />
                            <MetricRow label="Paylaşım Sıklığı" value={application.postingFrequency ?? "—"} />
                            {application.collaborationTypes.length > 0 && (
                              <MetricRow
                                label="İşbirliği Türleri"
                                value={application.collaborationTypes.join(", ")}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Users2 className="w-4 h-4 text-sky-600" /> Kitle Bilgileri
                          </h4>
                          <div className="space-y-2 text-sm text-gray-700">
                            <MetricRow label="Yaş Aralığı" value={audienceAge ?? "—"} />
                            <MetricRow label="Cinsiyet Dağılımı" value={audienceGender ?? "—"} />
                            <MetricRow label="Önde Gelen Ülkeler" value={topCountries ?? "—"} />
                          </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-rose-600" /> Diğer Bilgiler
                          </h4>
                          <div className="space-y-2 text-sm text-gray-700">
                            <MetricRow label="Portföy" value={application.portfolio ?? "—"} isLink />
                            <MetricRow label="Önceki İşbirlikleri" value={application.pastCollaborations ?? "—"} />
                            <MetricRow label="Notlar" value={application.notes ?? "—"} />
                          </div>
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

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Başvuru: {formatDate(application.createdAt)}
                          </div>
                          {application.processedAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> İşleyen: {application.processedBy ?? "—"} · {formatDateTime(application.processedAt)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
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

type StatCardProps = {
  title: string;
  value: number;
  variant?: "success" | "warning" | "danger";
  icon: React.ReactNode;
};

function StatCard({ title, value, variant, icon }: StatCardProps) {
  const variants: Record<NonNullable<StatCardProps["variant"]>, string> = {
    success: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    danger: "bg-red-50 border-red-200",
  };

  const baseClass = "bg-white border border-gray-200";
  const variantClass = variant ? variants[variant] : baseClass;

  return (
    <div className={`${baseClass} ${variant ? variantClass : ""} rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}

type MetricRowProps = {
  label: string;
  value: string;
  isLink?: boolean;
};

function MetricRow({ label, value, isLink }: MetricRowProps) {
  const content = isLink && value && value !== "—" ? (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
    >
      {value}
      <LinkIcon className="w-3 h-3" />
    </a>
  ) : (
    value || "—"
  );

  return (
    <div className="flex items-start gap-2">
      <span className="text-gray-500 min-w-[140px] text-xs uppercase tracking-wide">{label}</span>
      <span className="text-gray-800 text-sm font-medium break-words flex-1">{content}</span>
    </div>
  );
}

