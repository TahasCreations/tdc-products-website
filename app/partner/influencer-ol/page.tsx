"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

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
    { key: 'profile', title: 'Profil & Sosyal', icon: '👤' },
    { key: 'audience', title: 'Kitle & Performans', icon: '📈' },
    { key: 'preferences', title: 'Tercihler & Portföy', icon: '🎯' },
    { key: 'consents', title: 'Onaylar & Gönder', icon: '✅' },
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
    // Validate step-specific fields before proceeding
    let fieldsToValidate: string[] = [];
    if (currentStep === 0) {
      fieldsToValidate = [
        'fullName', 'phone', 'country', 'city',
        'instagram', 'tiktok', 'youtube', 'website',
      ];
    } else if (currentStep === 1) {
      fieldsToValidate = [
        'followerEst', 'avgViews', 'avgLikes', 'audienceAge', 'audienceGender', 'topCountries',
        'primaryPlatform', 'postingFrequency',
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = [
        'category', 'collaborationTypes', 'compensationPreference', 'portfolio', 'pastCollaborations', 'notes',
      ];
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
      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-10 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Başvurunuz Alındı</h1>
            <p className="text-emerald-50">
              Influencer başvurunuz başarıyla gönderildi. İnceleme sonrasında e‑posta ile bilgilendireceğiz.
            </p>
          </div>
          <div className="p-8 text-center">
            <button 
              onClick={() => setIsSubmitted(false)}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Yeni Başvuru Oluştur
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 bg-[linear-gradient(180deg,rgba(244,244,248,0.9)_0%,rgba(255,255,255,1)_40%)]">
      {/* Hero */}
      <section className="mb-10 rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 shadow-lg">
        <div className="px-8 py-12 md:px-12 md:py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-sm mb-4">
              <span className="text-purple-600">Yeni</span>
              <span className="text-purple-600">Influencer Programı</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-gray-900">
              TDC Market ile işbirliği yapın, kitlenizle gelir yaratın
            </h1>
            <p className="text-black max-w-2xl">
              Markalarımızla içerik ortaklıkları kurun, özel kampanyalara katılın ve satıştan pay alın. Hızlı başvuru, şeffaf kazanç.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-black">
                <li className="flex items-center gap-2"><span>✅</span><span>Satıştan performans bazlı gelir</span></li>
                <li className="flex items-center gap-2"><span>✅</span><span>Özel indirim kodları</span></li>
                <li className="flex items-center gap-2"><span>✅</span><span>Kişiselleştirilmiş linkler</span></li>
                <li className="flex items-center gap-2"><span>✅</span><span>Aylık performans raporları</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Steps and FAQ */}
        <section className="space-y-6 lg:sticky lg:top-24 self-start">
          {/* Stepper */}
          <div className="rounded-xl border border-gray-200 bg-white/90 backdrop-blur p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, idx) => (
                <div key={step.key} className="flex-1 flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${idx <= currentStep ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-1 mx-2 flex-1 rounded ${idx < currentStep ? 'bg-purple-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-black">
              <span>{steps[currentStep].icon}</span>
              <span className="font-medium">{steps[currentStep].title}</span>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white/90 backdrop-blur p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>🧭</span>
              <span>Nasıl çalışır?</span>
            </h2>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="h-7 w-7 flex items-center justify-center rounded-full bg-gray-900 text-white text-sm">1</span>
                <div>
                  <p className="font-medium text-gray-900">Başvurunuzu gönderin</p>
                  <p className="text-black text-sm">Sosyal hesaplarınızı ve nişinizi paylaşın.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-7 w-7 flex items-center justify-center rounded-full bg-gray-900 text-white text-sm">2</span>
                <div>
                  <p className="font-medium text-gray-900">Onay ve kurulum</p>
                  <p className="text-black text-sm">Özel link ve indirim kodunuz tanımlanır.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-7 w-7 flex items-center justify-center rounded-full bg-gray-900 text-white text-sm">3</span>
                <div>
                  <p className="font-medium text-gray-900">Paylaş ve kazan</p>
                  <p className="text-black text-sm">Satışlar üzerinden performans payı kazanın.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white/90 backdrop-blur p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>❓</span>
              <span>Sık sorulanlar</span>
            </h2>
            <div className="space-y-4 text-sm text-black">
              <div>
                <p className="font-medium text-gray-900">Minimum takipçi şartı var mı?</p>
                <p className="text-black">Belirli bir alt limit yok; kitle uyumu ve içerik kalitesine bakıyoruz.</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Ödeme modeli nedir?</p>
                <p className="text-black">Satıştan performans bazlı komisyon + dönemsel kampanya bonusları.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Form Card */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur shadow-xl p-6 lg:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <span>📝</span>
              <span>Başvuru Formu</span>
            </h2>
            <p className="text-black text-sm mb-6">Temel bilgilerinizi paylaşın; 24‑72 saat içinde dönüş yapıyoruz.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Profile */}
              {currentStep === 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <span>👤</span>
                  <span>Profil Bilgileri</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Ad Soyad</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">👤</span>
                      <input 
                        className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black placeholder-black"
                        placeholder="Adınız Soyadınız"
                        {...register("fullName")} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Telefon</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">📞</span>
                      <input 
                        className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-black"
                        placeholder="+90 5xx xxx xx xx"
                        {...register("phone")} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Ülke</label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-black"
                      placeholder="Türkiye"
                      {...register("country")} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Şehir</label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-black"
                      placeholder="İstanbul"
                      {...register("city")} 
                    />
                  </div>
                </div>
              </div>
              )}
              {currentStep === 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <span>🌐</span>
                  <span>Sosyal Medya Hesapları</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Instagram</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">📸</span>
                      <input 
                        className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-black" 
                        placeholder="https://instagram.com/kullaniciadi"
                        {...register("instagram")} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">TikTok</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">🎵</span>
                      <input 
                        className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-black" 
                        placeholder="https://tiktok.com/@kullaniciadi"
                        {...register("tiktok")} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">YouTube</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">▶️</span>
                      <input 
                        className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-black" 
                        placeholder="https://youtube.com/@kanaladi"
                        {...register("youtube")} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Website/Blog</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">🔗</span>
                      <input 
                        className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-black" 
                        placeholder="https://website.com"
                        {...register("website")} 
                      />
                    </div>
                  </div>
                </div>
                {errors.instagram && (
                  <p className="text-red-500 text-sm mt-2">{errors.instagram.message}</p>
                )}
              </div>
              )}

              {/* Audience & Metrics */}
              {currentStep === 1 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <span>📈</span>
                  <span>Kitle ve Metrikler</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Toplam Takipçi (Tahmini)</label>
                    <input 
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent placeholder-black" 
                      placeholder="10000"
                      {...register("followerEst")} 
                    />
                    {errors.followerEst && (
                      <p className="text-red-500 text-sm mt-1">{errors.followerEst.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Ortalama Görüntüleme/Sayı</label>
                    <input 
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent placeholder-black" 
                      placeholder="5000"
                      {...register("avgViews")} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Ortalama Beğeni/Sayı</label>
                    <input 
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent placeholder-black" 
                      placeholder="300"
                      {...register("avgLikes")} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Kitle Yaş Aralığı</label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent placeholder-black" 
                      placeholder="18-24, 25-34 ..."
                      {...register("audienceAge")} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Kitle Cinsiyet Dağılımı</label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent placeholder-black" 
                      placeholder="%60 Kadın / %40 Erkek"
                      {...register("audienceGender")} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">En Çok Takipçi Ülkeleri</label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent placeholder-black" 
                      placeholder="TR, DE, NL"
                      {...register("topCountries")} 
                    />
                  </div>
                </div>
              </div>
              )}

              {/* Performance & Platforms */}
              {currentStep === 1 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <span>🚀</span>
                  <span>Performans ve Platformlar</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Ana Platform</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent text-black"
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
                    <label className="block text-sm font-medium text-black mb-1">Paylaşım Sıklığı</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent text-black"
                      {...register("postingFrequency")}
                    >
                      <option value="">Seçiniz</option>
                      <option value="daily">Günlük</option>
                      <option value="weekly">Haftalık</option>
                      <option value="biweekly">İki Haftada Bir</option>
                      <option value="monthly">Aylık</option>
                    </select>
                  </div>
                </div>
              </div>
              )}

              {/* Preferences */}
              {currentStep === 2 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <span>🎯</span>
                  <span>Tercihler</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Kategori/Niş</label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-400" 
                      placeholder="Moda, Teknoloji, Lifestyle, Güzellik, Fitness..."
                      {...register("category")} 
                    />
                    <p className="text-black text-xs mt-1">Hangi konularda içerik ürettiğinizi belirtin</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">İşbirliği Türleri</label>
                    <div className="grid grid-cols-2 gap-2 text-sm text-black">
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" value="sponsored" {...register("collaborationTypes")} /> Sponsorlu İçerik
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" value="affiliate" {...register("collaborationTypes")} /> Affiliate
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" value="giveaway" {...register("collaborationTypes")} /> Çekiliş
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" value="review" {...register("collaborationTypes")} /> Ürün İncelemesi
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-black mb-1">Ücret Tercihi</label>
                    <div className="grid grid-cols-3 gap-2 text-sm text-black">
                      <label className="inline-flex items-center gap-2">
                        <input type="radio" value="fixed" {...register("compensationPreference")} /> Sabit Ücret
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="radio" value="performance" {...register("compensationPreference")} /> Performans Bazlı
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="radio" value="hybrid" {...register("compensationPreference")} /> Hibrit
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Portfolio & Notes */}
              {currentStep === 2 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <span>🗂️</span>
                  <span>Portföy ve Notlar</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Portföy URL</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">📁</span>
                      <input 
                        className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black placeholder-gray-400" 
                        placeholder="https://behance.net/..., Google Drive..."
                        {...register("portfolio")} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Önceki İşbirlikleri</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">🤝</span>
                      <input 
                        className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-black placeholder-gray-400" 
                        placeholder="Marka X (2024), Marka Y (2023) ..."
                        {...register("pastCollaborations")} 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-black mb-1">Ek Notlar</label>
                    <textarea 
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder-black" 
                      placeholder="Bize iletmek istediğiniz ek bilgiler..."
                      {...register("notes")} 
                    />
                  </div>
                </div>
              </div>
              )}

              {/* Consents */}
              {currentStep === 3 && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    className="mt-1"
                    {...register("agreement")} 
                  />
                  <label className="text-sm text-black">
                    <span className="text-red-500">*</span> Influencer sözleşmesini okudum ve kabul ediyorum. Marka işbirlikleri için belirlenen kurallara uyacağımı beyan ederim.
                  </label>
                </div>
                {errors.agreement && (
                  <p className="text-red-500 text-sm">{errors.agreement.message}</p>
                )}
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    className="mt-1"
                    {...register("communicationConsent")} 
                  />
                  <label className="text-sm text-black">
                    <span className="text-red-500">*</span> Başvurumla ilgili e‑posta/telefon yoluyla iletişim kurulmasına izin veriyorum.
                  </label>
                </div>
                {errors.communicationConsent && (
                  <p className="text-red-500 text-sm">{(errors as any).communicationConsent?.message}</p>
                )}
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    className="mt-1"
                    {...register("dataProcessingConsent")} 
                  />
                  <label className="text-sm text-black">
                    <span className="text-red-500">*</span> KVKK/GDPR kapsamında verilerimin işlenmesine onay veriyorum.
                  </label>
                </div>
                {errors.dataProcessingConsent && (
                  <p className="text-red-500 text-sm">{(errors as any).dataProcessingConsent?.message}</p>
                )}
              </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-3 rounded-lg border border-gray-300 text-black hover:bg-gray-50"
                  >
                    Geri
                  </button>
                )}
                {currentStep < steps.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold shadow-lg"
                  >
                    İleri
                  </button>
                )}
                {currentStep === steps.length - 1 && (
                  <button 
                    type="submit"
                    disabled={isSubmitting} 
                    className="ml-auto px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
