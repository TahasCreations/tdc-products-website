"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const Schema = z.object({
  storeName: z.string().min(2, "Mağaza adı en az 2 karakter olmalı"),
  taxId: z.string().min(5, "Vergi numarası en az 5 karakter olmalı"),
  iban: z.string().min(10, "IBAN en az 10 karakter olmalı"),
  shippingPref: z.string().min(2, "Kargo tercihi seçmelisiniz"),
  agreement: z.boolean().refine(Boolean, "Sözleşmeyi onaylayın"),
});

export default function SellerApplyPage() {
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
      const response = await fetch("/api/partners/seller/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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
            Satıcı başvurunuz başarıyla gönderildi. İnceleme sürecinden sonra size e-posta ile bilgi verilecektir.
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
        <h1 className="text-3xl font-bold mb-2">Satıcı Ol</h1>
        <p className="text-gray-600">
          TDC Market'te ürünlerinizi satarak gelir elde edin. Başvurunuz onaylandıktan sonra 
          satıcı panelinize erişim sağlayabilirsiniz.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mağaza Adı *
          </label>
          <input 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent" 
            placeholder="Mağaza adınızı girin"
            {...register("storeName")} 
          />
          {errors.storeName && (
            <p className="text-red-500 text-sm mt-1">{errors.storeName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vergi Numarası *
          </label>
          <input 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent" 
            placeholder="Vergi numaranızı girin"
            {...register("taxId")} 
          />
          {errors.taxId && (
            <p className="text-red-500 text-sm mt-1">{errors.taxId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IBAN *
          </label>
          <input 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent" 
            placeholder="TR00 0000 0000 0000 0000 0000 00"
            {...register("iban")} 
          />
          {errors.iban && (
            <p className="text-red-500 text-sm mt-1">{errors.iban.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kargo Tercihi *
          </label>
          <select 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
            {...register("shippingPref")}
          >
            <option value="">Kargo firması seçin</option>
            <option value="Yurtiçi">Yurtiçi Kargo</option>
            <option value="Aras">Aras Kargo</option>
            <option value="MNG">MNG Kargo</option>
            <option value="PTT">PTT Kargo</option>
            <option value="Sürat">Sürat Kargo</option>
          </select>
          {errors.shippingPref && (
            <p className="text-red-500 text-sm mt-1">{errors.shippingPref.message}</p>
          )}
        </div>

        <div className="flex items-start gap-3">
          <input 
            type="checkbox" 
            className="mt-1"
            {...register("agreement")} 
          />
          <label className="text-sm text-gray-600">
            <span className="text-red-500">*</span> Satıcı sözleşmesini okudum ve kabul ediyorum. 
            Tüm yasal yükümlülüklerimi yerine getireceğimi beyan ederim.
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
