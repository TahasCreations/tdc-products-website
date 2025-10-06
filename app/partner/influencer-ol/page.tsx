"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const Schema = z.object({
  instagram: z.string().url("Geçerli bir Instagram URL'i girin").optional().or(z.literal("")),
  tiktok: z.string().url("Geçerli bir TikTok URL'i girin").optional().or(z.literal("")),
  youtube: z.string().url("Geçerli bir YouTube URL'i girin").optional().or(z.literal("")),
  website: z.string().url("Geçerli bir website URL'i girin").optional().or(z.literal("")),
  followerEst: z.coerce.number().int().nonnegative("Takipçi sayısı pozitif olmalı").optional(),
  category: z.string().optional(),
  agreement: z.boolean().refine(Boolean, "Sözleşmeyi onaylayın"),
}).refine(v => v.instagram || v.tiktok || v.youtube || v.website, {
  message: "En az bir sosyal medya hesabı veya website girmelisiniz",
  path: ["instagram"],
});

export default function InfluencerApplyPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset 
  } = useForm({
    resolver: zodResolver(Schema),
    defaultValues: { agreement: false },
  });

  async function onSubmit(values: any) {
    try {
      const payload = {
        socialLinks: {
          instagram: values.instagram || undefined,
          tiktok: values.tiktok || undefined,
          youtube: values.youtube || undefined,
          website: values.website || undefined,
        },
        followerEst: values.followerEst || null,
        category: values.category || null,
        agreement: values.agreement,
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

  if (isSubmitted) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold mb-4 text-green-600">Başvurunuz Alındı!</h1>
          <p className="text-gray-600 mb-6">
            Influencer başvurunuz başarıyla gönderildi. İnceleme sürecinden sonra size e-posta ile bilgi verilecektir.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Yeni Başvuru
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Influencer Ol</h1>
        <p className="text-gray-600">
          TDC Market'te markalarımızla işbirliği yaparak gelir elde edin. Başvurunuz onaylandıktan sonra 
          influencer panelinize erişim sağlayabilirsiniz.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sosyal Medya Hesapları</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent" 
                placeholder="https://instagram.com/kullaniciadi"
                {...register("instagram")} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TikTok
              </label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent" 
                placeholder="https://tiktok.com/@kullaniciadi"
                {...register("tiktok")} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube
              </label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent" 
                placeholder="https://youtube.com/@kanaladi"
                {...register("youtube")} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website/Blog
              </label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent" 
                placeholder="https://website.com"
                {...register("website")} 
              />
            </div>
          </div>
          {errors.instagram && (
            <p className="text-red-500 text-sm mt-2">{errors.instagram.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Toplam Takipçi Sayısı (Tahmini)
          </label>
          <input 
            type="number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent" 
            placeholder="Örnek: 10000"
            {...register("followerEst")} 
          />
          {errors.followerEst && (
            <p className="text-red-500 text-sm mt-1">{errors.followerEst.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori/Niş
          </label>
          <input 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent" 
            placeholder="Moda, Teknoloji, Lifestyle, Güzellik, Fitness..."
            {...register("category")} 
          />
          <p className="text-gray-500 text-sm mt-1">
            Hangi konularda içerik ürettiğinizi belirtin
          </p>
        </div>

        <div className="flex items-start gap-3">
          <input 
            type="checkbox" 
            className="mt-1"
            {...register("agreement")} 
          />
          <label className="text-sm text-gray-600">
            <span className="text-red-500">*</span> Influencer sözleşmesini okudum ve kabul ediyorum. 
            Marka işbirlikleri için belirlenen kurallara uyacağımı beyan ederim.
          </label>
        </div>
        {errors.agreement && (
          <p className="text-red-500 text-sm">{errors.agreement.message}</p>
        )}

        <button 
          type="submit"
          disabled={isSubmitting} 
          className="w-full px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
        </button>
      </form>
    </main>
  );
}
