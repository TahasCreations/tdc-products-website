"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Instagram, Youtube, Globe, TrendingUp, Users, DollarSign, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

const Schema = z.object({
  // Profile
  fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalı").optional().or(z.literal("")),
  phone: z.string().regex(/^[+0-9\s()-]{7,}$/i, "Geçerli bir telefon girin").optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),

  // Social links
  instagram: z.string().url("Geçerli bir Instagram URL'i girin").optional().or(z.literal("")),
  tiktok: z.string().url("Geçerli bir TikTok URL'i girin").optional().or(z.literal("")),
  youtube: z.string().url("Geçerli bir YouTube URL'i girin").optional().or(z.literal("")),
  website: z.string().url("Geçerli bir website URL'i girin").optional().or(z.literal("")),

  // Audience & metrics
  followerEst: z.coerce.number().int().nonnegative("Takipçi sayısı pozitif olmalı").optional(),
  avgViews: z.coerce.number().int().nonnegative("Pozitif olmalı").optional(),
  avgLikes: z.coerce.number().int().nonnegative("Pozitif olmalı").optional(),
  audienceAge: z.string().optional().or(z.literal("")),
  audienceGender: z.string().optional().or(z.literal("")),
  topCountries: z.string().optional().or(z.literal("")),

  // Content & preferences
  category: z.string().optional().or(z.literal("")),
  primaryPlatform: z.enum(["instagram", "tiktok", "youtube", "website"]).optional(),
  postingFrequency: z.enum(["daily", "weekly", "biweekly", "monthly"]).optional(),
  collaborationTypes: z.array(z.enum(["sponsored", "affiliate", "giveaway", "review"]).optional()).optional(),
  compensationPreference: z.enum(["fixed", "performance", "hybrid"]).optional(),
  pastCollaborations: z.string().max(600, "600 karakteri aşmayın").optional().or(z.literal("")),
  portfolio: z.string().url("Geçerli bir URL girin").optional().or(z.literal("")),
  notes: z.string().max(600).optional().or(z.literal("")),

  // Consents
  agreement: z.boolean().refine(Boolean, "Sözleşmeyi onaylayın"),
  communicationConsent: z.boolean().refine(Boolean, "İletişim iznini onaylayın"),
  dataProcessingConsent: z.boolean().refine(Boolean, "KVKK/GDPR iznini onaylayın"),
}).refine(v => v.instagram || v.tiktok || v.youtube || v.website, {
  message: "En az bir sosyal medya hesabı veya website girmelisiniz",
  path: ["instagram"],
});

export default function InfluencerApplyPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { key: 'profile', title: 'Profil Bilgileri', icon: Users },
    { key: 'audience', title: 'Kitle & Performans', icon: TrendingUp },
    { key: 'preferences', title: 'Tercihler & İşbirliği', icon: DollarSign },
    { key: 'consents', title: 'Onaylar', icon: CheckCircle },
  ];
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    trigger,
    reset 
  } = useForm({
    resolver: zodResolver(Schema),
    defaultValues: { 
      agreement: false,
      communicationConsent: false,
      dataProcessingConsent: false,
    },
  });

  async function onSubmit(values: any) {
    try {
      const payload = {
        profile: {
          fullName: values.fullName || undefined,
          phone: values.phone || undefined,
          country: values.country || undefined,
          city: values.city || undefined,
        },
        socialLinks: {
          instagram: values.instagram || undefined,
          tiktok: values.tiktok || undefined,
          youtube: values.youtube || undefined,
          website: values.website || undefined,
        },
        audience: {
          followerEst: values.followerEst ?? null,
          audienceAge: values.audienceAge || null,
          audienceGender: values.audienceGender || null,
          topCountries: values.topCountries || null,
        },
        performance: {
          avgViews: values.avgViews ?? null,
          avgLikes: values.avgLikes ?? null,
          postingFrequency: values.postingFrequency || null,
          primaryPlatform: values.primaryPlatform || null,
        },
        preferences: {
          category: values.category || null,
          collaborationTypes: values.collaborationTypes || [],
          compensationPreference: values.compensationPreference || null,
        },
        portfolio: values.portfolio || null,
        pastCollaborations: values.pastCollaborations || null,
        notes: values.notes || null,
        consents: {
          agreement: values.agreement,
          communicationConsent: values.communicationConsent,
          dataProcessingConsent: values.dataProcessingConsent,
        },
      };

      const response = await fetch("/api/partners/influencer/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSubmitted(true);
        reset();
      } else {
        alert(data.error || "Bir hata oluştu");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin");
    }
  }

  async function handleNext() {
    let fieldsToValidate: string[] = [];
    if (currentStep === 0) {
      fieldsToValidate = ['fullName', 'phone', 'country', 'city', 'instagram', 'tiktok', 'youtube', 'website'];
    } else if (currentStep === 1) {
      fieldsToValidate = ['followerEst', 'avgViews', 'avgLikes', 'audienceAge', 'audienceGender', 'topCountries', 'primaryPlatform', 'postingFrequency'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['category', 'collaborationTypes', 'compensationPreference', 'portfolio', 'pastCollaborations', 'notes'];
    }
    const isValid = await trigger(fieldsToValidate as any);
    if (!isValid) return;
    setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  }

  function handleBack() {
    setCurrentStep(s => Math.max(s - 1, 0));
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-12 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-3">Başvurunuz Alındı! 🎉</h1>
            <p className="text-green-50 text-lg">
              Influencer başvurunuz başarıyla gönderildi. 24-72 saat içinde e-posta ile bilgilendireceğiz.
            </p>
          </div>
          <div className="p-8 text-center">
            <button 
              onClick={() => setIsSubmitted(false)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Anasayfaya Dön
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Influencer Ortaklık Programı</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Kitlenizle Gelir Yaratın
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              TDC Market'le işbirliği yapın, markalarla ortaklık kurun ve performans bazlı gelir elde edin
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-6"
              >
                <TrendingUp className="w-8 h-8 mb-3 mx-auto" />
                <h3 className="font-bold text-lg mb-2">Performans Bazlı Gelir</h3>
                <p className="text-white/80 text-sm">Satışlardan komisyon kazanın</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-6"
              >
                <Sparkles className="w-8 h-8 mb-3 mx-auto" />
                <h3 className="font-bold text-lg mb-2">Özel Kampanyalar</h3>
                <p className="text-white/80 text-sm">Kişiselleştirilmiş linkler ve kodlar</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-6"
              >
                <DollarSign className="w-8 h-8 mb-3 mx-auto" />
                <h3 className="font-bold text-lg mb-2">Şeffaf Raporlama</h3>
                <p className="text-white/80 text-sm">Aylık detaylı performans raporları</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, idx) => (
                <div key={step.key} className="flex items-center flex-1">
                  <div className={`flex flex-col items-center ${idx <= currentStep ? 'text-white' : 'text-white/40'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      idx <= currentStep ? 'bg-white text-purple-600 shadow-lg' : 'bg-white/20'
                    }`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium hidden md:block">{step.title}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                      idx < currentStep ? 'bg-white' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">
            {/* Step 0: Profile */}
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil Bilgileriniz</h2>
                  <p className="text-gray-600">Sizinle iletişime geçebilmemiz için temel bilgilerinizi paylaşın</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Ad Soyad</label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="Adınız Soyadınız"
                      {...register("fullName")} 
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Telefon</label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="+90 5xx xxx xx xx"
                      {...register("phone")} 
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Ülke</label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="Türkiye"
                      {...register("country")} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Şehir</label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="İstanbul"
                      {...register("city")} 
                    />
                  </div>
                </div>

                <div className="border-t pt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Instagram className="w-6 h-6 text-pink-600" />
                    Sosyal Medya Hesaplarınız
                  </h3>
                  <p className="text-gray-600 mb-6">En az bir platform bağlantısı paylaşmalısınız</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-pink-600" />
                        Instagram
                      </label>
                      <input 
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" 
                        placeholder="https://instagram.com/kullaniciadi"
                        {...register("instagram")} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        TikTok
                      </label>
                      <input 
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" 
                        placeholder="https://tiktok.com/@kullaniciadi"
                        {...register("tiktok")} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Youtube className="w-4 h-4 text-red-600" />
                        YouTube
                      </label>
                      <input 
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" 
                        placeholder="https://youtube.com/@kanaladi"
                        {...register("youtube")} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        Website/Blog
                      </label>
                      <input 
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" 
                        placeholder="https://website.com"
                        {...register("website")} 
                      />
                    </div>
                  </div>
                  {errors.instagram && <p className="text-red-500 text-sm mt-2">{errors.instagram.message}</p>}
                </div>
              </motion.div>
            )}

            {/* Step 1: Audience */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Kitle & Performans Metrikleri</h2>
                  <p className="text-gray-600">Kitleniz ve içerik performansınız hakkında bilgi verin</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Toplam Takipçi Sayısı (Tahmini)</label>
                    <input 
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="örn: 50000"
                      {...register("followerEst")} 
                    />
                    {errors.followerEst && <p className="text-red-500 text-sm mt-1">{errors.followerEst.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Ortalama Görüntüleme</label>
                    <input 
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="örn: 5000"
                      {...register("avgViews")} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Ortalama Beğeni</label>
                    <input 
                      type="number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="örn: 300"
                      {...register("avgLikes")} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Ana Platform</label>
                    <select 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      {...register("primaryPlatform")}
                    >
                      <option value="">Seçiniz</option>
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="website">Website/Blog</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Paylaşım Sıklığı</label>
                    <select 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      {...register("postingFrequency")}
                    >
                      <option value="">Seçiniz</option>
                      <option value="daily">Günlük</option>
                      <option value="weekly">Haftalık</option>
                      <option value="biweekly">İki Haftada Bir</option>
                      <option value="monthly">Aylık</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Kitle Yaş Aralığı</label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="18-24, 25-34..."
                      {...register("audienceAge")} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Cinsiyet Dağılımı</label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="%60 Kadın / %40 Erkek"
                      {...register("audienceGender")} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">En Çok Takipçi Ülkeleri</label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="TR, DE, NL"
                      {...register("topCountries")} 
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Preferences */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Tercihler & İşbirliği</h2>
                  <p className="text-gray-600">İçerik kategoriniz ve işbirliği tercihleriniz</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Kategori/Niş</label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="Moda, Teknoloji, Lifestyle, Güzellik, Fitness..."
                      {...register("category")} 
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">İşbirliği Türleri</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-600 transition-all cursor-pointer">
                        <input type="checkbox" value="sponsored" {...register("collaborationTypes")} className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Sponsorlu İçerik</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-600 transition-all cursor-pointer">
                        <input type="checkbox" value="affiliate" {...register("collaborationTypes")} className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Affiliate</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-600 transition-all cursor-pointer">
                        <input type="checkbox" value="giveaway" {...register("collaborationTypes")} className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Çekiliş</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-600 transition-all cursor-pointer">
                        <input type="checkbox" value="review" {...register("collaborationTypes")} className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Ürün İncelemesi</span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Ücret Tercihi</label>
                    <div className="grid grid-cols-3 gap-3">
                      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-600 transition-all cursor-pointer">
                        <input type="radio" value="fixed" {...register("compensationPreference")} className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Sabit Ücret</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-600 transition-all cursor-pointer">
                        <input type="radio" value="performance" {...register("compensationPreference")} className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Performans</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-600 transition-all cursor-pointer">
                        <input type="radio" value="hybrid" {...register("compensationPreference")} className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Hibrit</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Portföy URL</label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="https://behance.net/..."
                      {...register("portfolio")} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Önceki İşbirlikleri</label>
                    <input 
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="Marka X (2024), Marka Y (2023)..."
                      {...register("pastCollaborations")} 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Ek Notlar</label>
                    <textarea 
                      rows={4}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="Bize iletmek istediğiniz ek bilgiler..."
                      {...register("notes")} 
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Consents */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Son Adım: Onaylar</h2>
                  <p className="text-gray-600">Lütfen aşağıdaki onayları okuyun ve işaretleyin</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-purple-600 transition-all cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 text-purple-600"
                      {...register("agreement")} 
                    />
                    <div>
                      <span className="text-gray-900 font-medium block mb-1">
                        <span className="text-red-500">*</span> Influencer Sözleşmesi
                      </span>
                      <span className="text-gray-600 text-sm">
                        Influencer sözleşmesini okudum ve kabul ediyorum. Marka işbirlikleri için belirlenen kurallara uyacağımı beyan ederim.
                      </span>
                    </div>
                  </label>
                  {errors.agreement && <p className="text-red-500 text-sm">{errors.agreement.message}</p>}

                  <label className="flex items-start gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-purple-600 transition-all cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 text-purple-600"
                      {...register("communicationConsent")} 
                    />
                    <div>
                      <span className="text-gray-900 font-medium block mb-1">
                        <span className="text-red-500">*</span> İletişim İzni
                      </span>
                      <span className="text-gray-600 text-sm">
                        Başvurumla ilgili e-posta/telefon yoluyla iletişim kurulmasına izin veriyorum.
                      </span>
                    </div>
                  </label>
                  {errors.communicationConsent && <p className="text-red-500 text-sm">{(errors as any).communicationConsent?.message}</p>}

                  <label className="flex items-start gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-purple-600 transition-all cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 text-purple-600"
                      {...register("dataProcessingConsent")} 
                    />
                    <div>
                      <span className="text-gray-900 font-medium block mb-1">
                        <span className="text-red-500">*</span> KVKK/GDPR Onayı
                      </span>
                      <span className="text-gray-600 text-sm">
                        KVKK/GDPR kapsamında verilerimin işlenmesine onay veriyorum.
                      </span>
                    </div>
                  </label>
                  {errors.dataProcessingConsent && <p className="text-red-500 text-sm">{(errors as any).dataProcessingConsent?.message}</p>}
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center gap-4 pt-8 border-t mt-8">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Geri
                </button>
              )}
              {currentStep < steps.length - 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  İleri
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              {currentStep === steps.length - 1 && (
                <button 
                  type="submit"
                  disabled={isSubmitting} 
                  className="ml-auto px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
                  {!isSubmitting && <CheckCircle className="w-5 h-5" />}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
