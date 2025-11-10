"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Store, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Check,
  Building2,
  FileText,
  Truck,
  Shield,
  Globe,
  Camera,
  Upload,
  TrendingUp,
  Users,
  Package
} from 'lucide-react';

export default function SellerApplyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [sellerType, setSellerType] = useState<'individual' | 'company'>('individual');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const totalSteps = 5;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const payload: Record<string, any> = {};

    formData.forEach((value, key) => {
      if (payload[key]) {
        payload[key] = Array.isArray(payload[key])
          ? [...payload[key], value]
          : [payload[key], value];
      } else {
        payload[key] = value;
      }
    });

    const booleanFields = [
      'acceptTerms',
      'acceptCommission',
      'acceptKVKK',
      'acceptQuality',
    ] as const;

    booleanFields.forEach((field) => {
      payload[field] = payload[field] === 'on';
    });

    const cargoCompanies = payload.cargoCompanies
      ? Array.isArray(payload.cargoCompanies)
        ? payload.cargoCompanies
        : [payload.cargoCompanies]
      : [];

    const normalizedEmail =
      (payload.contactEmail as string | undefined)?.trim().toLowerCase() ??
      undefined;

    const cleanedSlug = (payload.storeSlug as string | undefined)
      ?.trim()
      .toLowerCase();

    const formattedIBAN = (payload.iban as string | undefined)
      ?.replace(/\s+/g, '')
      .toUpperCase();

    const submissionPayload = {
      ...payload,
      sellerType,
      contactEmail: normalizedEmail,
      storeSlug: cleanedSlug,
      iban: formattedIBAN,
      cargoCompanies,
    };

    try {
      const response = await fetch("/api/partners/seller/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionPayload),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/'), 3000);
      } else {
        setError(data.error || "Bir hata oluştu");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setError("Bir hata oluştu, lütfen tekrar deneyin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950/30 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🎉 Başvurunuz Alındı!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            Satıcı başvurunuz başarıyla gönderildi. Ekibimiz 1-3 iş günü içinde başvurunuzu inceleyecek ve size e-posta ile bilgi verecektir.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Sonraki Adım:</strong> E-posta kutunuzu kontrol edin. Onay sonrası satıcı panelinize erişim bilgileriniz gönderilecek.
            </p>
          </div>
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black font-bold rounded-xl hover:shadow-xl transition-all"
          >
            Ana Sayfaya Dön
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const steps = [
    { num: 1, title: 'Mağaza', icon: Store },
    { num: 2, title: 'İletişim', icon: Phone },
    { num: 3, title: 'Kimlik', icon: CreditCard },
    { num: 4, title: 'Lojistik', icon: Truck },
    { num: 5, title: 'Onay', icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950/30 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-3xl mb-4 shadow-2xl"
          >
            <Store className="w-10 h-10 text-black" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#CBA135] via-[#F4D03F] to-[#CBA135] bg-clip-text text-transparent mb-3">
            Satıcı Ol
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto">
            TDC Products'ta mağazanızı açın, ürünlerinizi satın ve <strong className="text-[#CBA135]">binlerce müşteriye</strong> ulaşın
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
              <TrendingUp className="w-6 h-6 text-[#CBA135] mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">10K+</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Aktif Alıcı</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
              <Users className="w-6 h-6 text-[#CBA135] mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">500+</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Satıcı</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
              <Package className="w-6 h-6 text-[#CBA135] mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">50K+</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ürün</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.num;
                const isCompleted = currentStep > step.num;
                
                return (
                  <div key={step.num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <motion.div
                        animate={{
                          scale: isActive ? 1.15 : 1,
                          backgroundColor: isCompleted ? '#10b981' : isActive ? '#F4D03F' : '#e5e7eb'
                        }}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-lg ${
                          isCompleted ? 'text-white' : isActive ? 'text-black' : 'text-gray-400'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-7 h-7" /> : <Icon className="w-7 h-7" />}
                      </motion.div>
                      <p className={`text-xs font-bold text-center hidden sm:block ${
                        isActive ? 'text-[#CBA135]' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                    {index < 4 && (
                      <div className={`flex-1 h-2 mx-2 rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          {/* Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 p-4"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Mağaza Bilgileri */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Mağaza Bilgileri</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mağazanızın temel bilgilerini girin</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                    <div className="flex items-start space-x-3">
                      <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>İpucu:</strong> Mağaza adınız ve açıklamanız müşterilerin sizi bulmasına yardımcı olur. Detaylı ve çekici bir açıklama yazın!
                      </p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="storeName" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      <Store className="w-4 h-4 inline mr-1" />
                      Mağaza Adı *
                    </label>
                    <input
                      type="text"
                      id="storeName"
                      name="storeName"
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all text-lg font-medium"
                      placeholder="Örn: Anime Figür Dünyası"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Check className="w-3 h-3 mr-1 text-green-500" />
                      Müşterilerin göreceği mağaza ismi
                    </p>
                  </div>

                  <div>
                    <label htmlFor="storeSlug" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      <Globe className="w-4 h-4 inline mr-1" />
                      Mağaza URL'i *
                    </label>
                    <div className="flex rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 focus-within:ring-2 focus-within:ring-[#CBA135] focus-within:border-[#CBA135]">
                      <span className="inline-flex items-center px-5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold">
                        tdcproducts.com/
                      </span>
                      <input
                        type="text"
                        id="storeSlug"
                        name="storeSlug"
                        required
                        pattern="^[a-z0-9-]+$"
                        className="flex-1 px-4 py-4 dark:bg-gray-700 dark:text-white focus:outline-none text-lg"
                        placeholder="anime-figur-dunyasi"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Check className="w-3 h-3 mr-1 text-green-500" />
                      Sadece küçük harf, rakam ve tire (-) kullanın
                    </p>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      <FileText className="w-4 h-4 inline mr-1" />
                      Mağaza Açıklaması *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={5}
                      className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all resize-none"
                      placeholder="Mağazanızı detaylı tanıtın:&#10;• Ne tür ürünler satıyorsunuz?&#10;• Hangi markalarla çalışıyorsunuz?&#10;• Neden sizi tercih etmeliler?&#10;• Özel hizmetleriniz var mı?"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Check className="w-3 h-3 mr-1 text-green-500" />
                      Minimum 100 karakter (detaylı açıklama müşteri güveni artırır)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Ana Ürün Kategorisi *
                      </label>
                      <select
                        name="storeCategory"
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg font-semibold"
                      >
                        <option value="">Kategori seçin</option>
                        <option value="figur-koleksiyon">🎭 Figür & Koleksiyon</option>
                        <option value="moda-aksesuar">👗 Moda & Aksesuar</option>
                        <option value="elektronik">📱 Elektronik</option>
                        <option value="ev-yasam">🏠 Ev & Yaşam</option>
                        <option value="sanat-hobi">🎨 Sanat & Hobi</option>
                        <option value="hediyelik">🎁 Hediyelik</option>
                        <option value="diger">📦 Diğer</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="businessYears" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Kaç Yıldır Bu İşi Yapıyorsunuz? *
                      </label>
                      <select
                        id="businessYears"
                        name="businessYears"
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg font-semibold"
                      >
                        <option value="">Deneyim seçin</option>
                        <option value="0">Yeni başlıyorum</option>
                        <option value="1">1 yıl</option>
                        <option value="2">2 yıl</option>
                        <option value="3-5">3-5 yıl</option>
                        <option value="5-10">5-10 yıl</option>
                        <option value="10+">10+ yıl</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: İletişim */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">İletişim Bilgileri</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Müşterilerinizle iletişim için</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <strong>Güvenlik:</strong> Bu bilgiler sadece sipariş takibi ve müşteri desteği için kullanılacaktır.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg"
                        placeholder="Ahmet Yılmaz"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        E-posta *
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg"
                        placeholder="0555 XXX XX XX"
                      />
                    </div>

                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        <MessageCircle className="w-4 h-4 inline mr-1" />
                        WhatsApp *
                      </label>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg"
                        placeholder="0555 XXX XX XX"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      İş Yeri Adresi *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      required
                      rows={3}
                      className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all resize-none text-lg font-medium"
                      placeholder="Mahalle, Sokak, Bina No, Daire No"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        İl *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg"
                        placeholder="İzmir"
                      />
                    </div>

                    <div>
                      <label htmlFor="district" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        İlçe *
                      </label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg"
                        placeholder="Bornova"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Posta Kodu *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg"
                        placeholder="35040"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Kimlik & Vergi */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Kimlik & Vergi</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Yasal işlemler ve ödeme alımları için</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      Satıcı Tipiniz *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.label 
                        whileHover={{ scale: 1.02 }}
                        className={`relative flex items-center p-5 border-3 rounded-2xl cursor-pointer transition-all ${
                          sellerType === 'individual'
                            ? 'border-[#CBA135] bg-gradient-to-br from-[#CBA135]/10 to-[#F4D03F]/10 shadow-lg'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="sellerType"
                          value="individual"
                          checked={sellerType === 'individual'}
                          onChange={(e) => setSellerType(e.target.value as 'individual')}
                          className="w-6 h-6 text-[#CBA135] border-gray-300 focus:ring-[#CBA135]"
                        />
                        <div className="ml-4">
                          <p className="font-bold text-lg text-gray-900 dark:text-white">Bireysel Satıcı</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Şahıs olarak satış yapacağım</p>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Kolay başvuru, hızlı onay</p>
                        </div>
                      </motion.label>

                      <motion.label 
                        whileHover={{ scale: 1.02 }}
                        className={`relative flex items-center p-5 border-3 rounded-2xl cursor-pointer transition-all ${
                          sellerType === 'company'
                            ? 'border-[#CBA135] bg-gradient-to-br from-[#CBA135]/10 to-[#F4D03F]/10 shadow-lg'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="sellerType"
                          value="company"
                          checked={sellerType === 'company'}
                          onChange={(e) => setSellerType(e.target.value as 'company')}
                          className="w-6 h-6 text-[#CBA135] border-gray-300 focus:ring-[#CBA135]"
                        />
                        <div className="ml-4">
                          <p className="font-bold text-lg text-gray-900 dark:text-white">Kurumsal Satıcı</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Şirket olarak satış yapacağım</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">✓ Fatura kesebilir, daha fazla limit</p>
                        </div>
                      </motion.label>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {sellerType === 'company' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div>
                          <label htmlFor="companyName" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            <Building2 className="w-4 h-4 inline mr-1" />
                            Şirket Ünvanı *
                          </label>
                          <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            required={sellerType === 'company'}
                            className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg"
                            placeholder="ABC Ticaret Ltd. Şti."
                          />
                        </div>

                        <div>
                          <label htmlFor="mersisNo" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            MERSİS No
                          </label>
                          <input
                            type="text"
                            id="mersisNo"
                            name="mersisNo"
                            className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg"
                            placeholder="0000000000000000"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="taxId" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        <FileText className="w-4 h-4 inline mr-1" />
                        {sellerType === 'individual' ? 'TC Kimlik No *' : 'Vergi No *'}
                      </label>
                      <input
                        type="text"
                        id="taxId"
                        name="taxId"
                        required
                        maxLength={sellerType === 'individual' ? 11 : 10}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg font-mono"
                        placeholder={sellerType === 'individual' ? '12345678901 (11 haneli)' : '1234567890 (10 haneli)'}
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {sellerType === 'individual' 
                          ? '✓ TC Kimlik numaranızı girin (11 hane)'
                          : '✓ Şirketinizin vergi numarasını girin (10 hane)'
                        }
                      </p>
                    </div>

                    <div>
                      <label htmlFor="taxOffice" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Vergi Dairesi *
                      </label>
                      <input
                        type="text"
                        id="taxOffice"
                        name="taxOffice"
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg"
                        placeholder="Bornova Vergi Dairesi"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="iban" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        <CreditCard className="w-4 h-4 inline mr-1" />
                        IBAN (Ödeme Alacağınız Hesap) *
                      </label>
                      <input
                        type="text"
                        id="iban"
                        name="iban"
                        required
                        pattern="^TR[0-9]{24}$"
                        maxLength={26}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all font-mono text-lg"
                        placeholder="TR00 0000 0000 0000 0000 0000 00"
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        ✓ Satış gelirleriniz bu hesaba haftalık olarak yatırılacak
                      </p>
                    </div>

                    <div>
                      <label htmlFor="bankName" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Banka *
                      </label>
                      <select
                        id="bankName"
                        name="bankName"
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg font-semibold"
                      >
                        <option value="">Banka seçin</option>
                        <option value="Ziraat Bankası">Ziraat Bankası</option>
                        <option value="İş Bankası">İş Bankası</option>
                        <option value="Garanti BBVA">Garanti BBVA</option>
                        <option value="Yapı Kredi">Yapı Kredi</option>
                        <option value="Akbank">Akbank</option>
                        <option value="QNB Finansbank">QNB Finansbank</option>
                        <option value="Denizbank">Denizbank</option>
                        <option value="TEB">TEB</option>
                        <option value="Halkbank">Halkbank</option>
                        <option value="Vakıfbank">Vakıfbank</option>
                        <option value="Diğer">Diğer</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Lojistik */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Kargo & Lojistik</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Teslimat ve iade bilgileri</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      Hangi Kargo Firmalarıyla Çalışıyorsunuz? * (Birden fazla seçebilirsiniz)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { value: 'yurtici', label: 'Yurtiçi Kargo', popular: true },
                        { value: 'aras', label: 'Aras Kargo', popular: true },
                        { value: 'mng', label: 'MNG Kargo', popular: true },
                        { value: 'ptt', label: 'PTT Kargo', popular: false },
                        { value: 'surat', label: 'Sürat Kargo', popular: false },
                        { value: 'ups', label: 'UPS', popular: false },
                      ].map((cargo) => (
                        <label key={cargo.value} className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl cursor-pointer hover:border-[#CBA135] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
                          <input
                            type="checkbox"
                            name="cargoCompanies"
                            value={cargo.value}
                            className="w-6 h-6 text-[#CBA135] border-gray-300 rounded-lg focus:ring-[#CBA135]"
                          />
                          <span className="ml-3 text-gray-900 dark:text-white font-semibold flex-1">{cargo.label}</span>
                          {cargo.popular && (
                            <span className="text-xs bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black px-3 py-1 rounded-full font-bold">Popüler</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="preparationTime" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Kargo Hazırlık Süresi *
                      </label>
                      <select
                        id="preparationTime"
                        name="preparationTime"
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg font-semibold"
                      >
                        <option value="">Süre seçin</option>
                        <option value="same-day">⚡ Aynı gün</option>
                        <option value="1-day">📦 1 iş günü</option>
                        <option value="2-days">📦 2 iş günü</option>
                        <option value="3-days">📦 3 iş günü</option>
                        <option value="5-days">📦 5 iş günü</option>
                        <option value="7-days">📦 7 iş günü</option>
                      </select>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Sipariş sonrası kargoya verme süresi
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        İade Politikası *
                      </label>
                      <select
                        name="returnPolicy"
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all text-lg font-semibold"
                      >
                        <option value="">Politika seçin</option>
                        <option value="14-days">14 gün içinde iade</option>
                        <option value="30-days">30 gün içinde iade (Önerilen)</option>
                        <option value="no-return">İade kabul etmiyorum</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="returnAddress" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      İade Adresi *
                    </label>
                    <textarea
                      id="returnAddress"
                      name="returnAddress"
                      required
                      rows={3}
                      className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-[#CBA135] transition-all resize-none text-lg font-medium"
                      placeholder="Müşteri iadeleri için adres (iş yeri adresi ile aynıysa tekrar yazın)"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 5: Onay */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Son Adım!</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Sözleşmeleri onaylayın ve başlayın</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#CBA135]/10 via-[#F4D03F]/10 to-[#CBA135]/10 border-2 border-[#CBA135]/30 rounded-3xl p-8">
                    <div className="flex items-start space-x-4 mb-6">
                      <Sparkles className="w-8 h-8 text-[#CBA135] flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-2xl">🎁 Satıcı Avantajları</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            'Sınırsız ürün listeleme',
                            'Profesyonel mağaza paneli',
                            'Detaylı satış raporları',
                            'Pazarlama araçları',
                            'Otomatik fatura kesimi',
                            '7/24 satıcı desteği',
                            'Hızlı ödeme (haftalık)',
                            'Ücretsiz eğitim'
                          ].map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-center space-x-2"
                            >
                              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-2xl p-6">
                    <h3 className="font-bold text-amber-900 dark:text-amber-300 mb-4 flex items-center text-lg">
                      <AlertCircle className="w-6 h-6 mr-2" />
                      💰 Komisyon ve Ücretler
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Platform Komisyonu</p>
                        <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">%15</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Her satıştan</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ödeme İşlem Ücreti</p>
                        <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">%2.5</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Banka/Kart işlemleri</p>
                      </div>
                    </div>
                    <p className="text-sm text-amber-800 dark:text-amber-200 mt-4">
                      <Check className="w-4 h-4 inline mr-1" />
                      Kargo ücreti müşteriden tahsil edilir, size ek maliyet yok!
                    </p>
                  </div>

                  <div className="space-y-4">
                    <motion.label 
                      whileHover={{ scale: 1.01 }}
                      className="flex items-start space-x-4 p-5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl cursor-pointer hover:border-[#CBA135] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all bg-white dark:bg-gray-800"
                    >
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        required
                        className="mt-1 h-6 w-6 text-[#CBA135] border-gray-300 rounded-lg focus:ring-[#CBA135]"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                          Satıcı Sözleşmesi *
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <a href="/seller-agreement" target="_blank" className="text-[#CBA135] hover:underline font-semibold">
                            Satıcı sözleşmesini
                          </a>
                          {' '}okudum, anladım ve kabul ediyorum.
                        </p>
                      </div>
                    </motion.label>

                    <motion.label 
                      whileHover={{ scale: 1.01 }}
                      className="flex items-start space-x-4 p-5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl cursor-pointer hover:border-[#CBA135] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all bg-white dark:bg-gray-800"
                    >
                      <input
                        type="checkbox"
                        name="acceptCommission"
                        required
                        className="mt-1 h-6 w-6 text-[#CBA135] border-gray-300 rounded-lg focus:ring-[#CBA135]"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                          Komisyon Oranları *
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          %15 platform komisyon ve %2.5 ödeme işlem ücretini kabul ediyorum.
                        </p>
                      </div>
                    </motion.label>

                    <motion.label 
                      whileHover={{ scale: 1.01 }}
                      className="flex items-start space-x-4 p-5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl cursor-pointer hover:border-[#CBA135] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all bg-white dark:bg-gray-800"
                    >
                      <input
                        type="checkbox"
                        name="acceptKVKK"
                        required
                        className="mt-1 h-6 w-6 text-[#CBA135] border-gray-300 rounded-lg focus:ring-[#CBA135]"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                          KVKK & Gizlilik *
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <a href="/kvkk" target="_blank" className="text-[#CBA135] hover:underline font-semibold">
                            KVKK aydınlatma metnini
                          </a>
                          {' '}okudum ve kabul ediyorum.
                        </p>
                      </div>
                    </motion.label>

                    <motion.label 
                      whileHover={{ scale: 1.01 }}
                      className="flex items-start space-x-4 p-5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl cursor-pointer hover:border-[#CBA135] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all bg-white dark:bg-gray-800"
                    >
                      <input
                        type="checkbox"
                        name="acceptQuality"
                        required
                        className="mt-1 h-6 w-6 text-[#CBA135] border-gray-300 rounded-lg focus:ring-[#CBA135]"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                          Kalite Taahhüdü *
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Orijinal, kaliteli ve yasal ürünler satacağımı taahhüt ediyorum.
                        </p>
                      </div>
                    </motion.label>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-bold mb-2 text-lg">📋 Başvuru Süreci</p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="font-bold mr-2">1.</span>
                            <span>Başvurunuz 1-3 iş günü içinde incelenecek</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-bold mr-2">2.</span>
                            <span>Kimlik ve vergi bilgileri doğrulanacak</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-bold mr-2">3.</span>
                            <span>Onay e-postası gönderilecek</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-bold mr-2">4.</span>
                            <span>Hemen ürün eklemeye başlayabilirsiniz!</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t-2 border-gray-100 dark:border-gray-700">
              <motion.button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                whileHover={{ scale: currentStep === 1 ? 1 : 1.05 }}
                whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
                className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center space-x-2 text-lg ${
                  currentStep === 1
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 shadow-lg hover:shadow-xl'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Geri</span>
              </motion.button>

              <div className="text-center flex-1 mx-4">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#CBA135]/20 to-[#F4D03F]/20 px-6 py-3 rounded-full">
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Adım <span className="text-2xl text-[#CBA135]">{currentStep}</span>
                    <span className="text-gray-400 mx-2">/</span>
                    <span className="text-gray-500">{totalSteps}</span>
                  </p>
                </div>
              </div>

              {currentStep < totalSteps ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black font-bold rounded-2xl hover:shadow-2xl transition-all flex items-center space-x-2 text-lg"
                >
                  <span>İleri</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-3 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Gönderiliyor...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      <span>Başvuruyu Gönder</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Help Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2 text-xl">
                <Phone className="w-6 h-6 text-[#CBA135]" />
                <span>Yardıma mı İhtiyacınız Var?</span>
              </h3>
              <div className="space-y-3">
                <a href="tel:05558988242" className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl hover:shadow-md transition-all group">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Telefon</p>
                    <p className="text-[#CBA135] font-bold group-hover:underline">0555 898 82 42</p>
                  </div>
                </a>
                <a href="https://wa.me/905558988242" target="_blank" className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl hover:shadow-md transition-all group">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">WhatsApp</p>
                    <p className="text-[#CBA135] font-bold group-hover:underline">Hemen Yaz</p>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2 text-xl">
                <CheckCircle2 className="w-6 h-6 text-[#CBA135]" />
                <span>Başvuru Sonrası</span>
              </h3>
              <div className="space-y-3">
                {[
                  { step: '1', text: '1-3 iş günü içinde inceleme', color: 'blue' },
                  { step: '2', text: 'Kimlik doğrulama', color: 'purple' },
                  { step: '3', text: 'E-posta ile onay', color: 'green' },
                  { step: '4', text: 'Hemen satışa başla!', color: 'yellow' }
                ].map((item) => (
                  <div key={item.step} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 rounded-xl flex items-center justify-center shadow-md`}>
                      <span className="text-white font-bold text-sm">{item.step}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
