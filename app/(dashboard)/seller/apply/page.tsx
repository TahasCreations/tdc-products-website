'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { applySeller } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '@/components/upload/ImageUpload';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  Upload
} from 'lucide-react';

export default function SellerApplyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [state, formAction] = useFormState(applySeller, { ok: false, error: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [idFrontUrl, setIdFrontUrl] = useState('');
  const [idBackUrl, setIdBackUrl] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/kayit?type=seller');
    }
  }, [status, router]);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    if (logoUrl) formData.set('logoUrl', logoUrl);
    if (bannerUrl) formData.set('bannerUrl', bannerUrl);
    if (idFrontUrl) formData.set('idFrontUrl', idFrontUrl);
    if (idBackUrl) formData.set('idBackUrl', idBackUrl);
    await formAction(formData);
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#CBA135] border-t-transparent"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950/30 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-2xl mb-4 shadow-lg">
            <Store className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Satıcı Başvurusu
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            TDC Products'ta mağazanızı açın ve binlerce müşteriye ulaşın
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50">
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
                          scale: isActive ? 1.1 : 1,
                          backgroundColor: isCompleted ? '#CBA135' : isActive ? '#F4D03F' : '#e5e7eb'
                        }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-md ${
                          isCompleted || isActive ? 'text-black' : 'text-gray-400'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                      </motion.div>
                      <p className={`text-xs font-medium text-center hidden sm:block ${
                        isActive ? 'text-[#CBA135]' : isCompleted ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                    {index < 4 && (
                      <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-[#CBA135]' : 'bg-gray-200 dark:bg-gray-700'
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
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden"
        >
          {/* Messages */}
          <AnimatePresence>
            {state.error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 p-4"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 dark:text-red-300 text-sm">{state.error}</p>
                </div>
              </motion.div>
            )}

            {state.ok && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 p-4"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    🎉 Başvurunuz alındı! En kısa sürede değerlendirilecek.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form action={handleSubmit} className="p-8">
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
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-[#CBA135]/20 rounded-xl flex items-center justify-center">
                      <Store className="w-5 h-5 text-[#CBA135]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mağaza Bilgileri</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mağazanızın temel bilgilerini girin</p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="storeName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Mağaza Adı *
                    </label>
                    <input
                      type="text"
                      id="storeName"
                      name="storeName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all"
                      placeholder="Örn: Anime Figür Dünyası"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Müşterilerin göreceği mağaza ismi
                    </p>
                  </div>

                  <div>
                    <label htmlFor="storeSlug" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Mağaza URL'i *
                    </label>
                    <div className="flex rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-[#CBA135]">
                      <span className="inline-flex items-center px-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium">
                        tdcproducts.com/
                      </span>
                      <input
                        type="text"
                        id="storeSlug"
                        name="storeSlug"
                        required
                        pattern="^[a-z0-9-]+$"
                        className="flex-1 px-4 py-3 dark:bg-gray-700 dark:text-white focus:outline-none"
                        placeholder="anime-figur-dunyasi"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Sadece küçük harf, rakam ve tire (-) kullanabilirsiniz
                    </p>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Mağaza Açıklaması *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all resize-none"
                      placeholder="Mağazanızı tanıtın: Ne tür ürünler satıyorsunuz? Neden sizi tercih etmeliler? Hangi markaları satıyorsunuz?"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Minimum 100 karakter (detaylı açıklama müşteri güveni için önemli)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Mağaza Kategorisi *
                      </label>
                      <select
                        name="storeCategory"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                      >
                        <option value="">Kategori seçin</option>
                        <option value="figur-koleksiyon">Figür & Koleksiyon</option>
                        <option value="moda-aksesuar">Moda & Aksesuar</option>
                        <option value="elektronik">Elektronik</option>
                        <option value="ev-yasam">Ev & Yaşam</option>
                        <option value="sanat-hobi">Sanat & Hobi</option>
                        <option value="hediyelik">Hediyelik</option>
                        <option value="diger">Diğer</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="businessYears" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        İş Deneyimi (Yıl) *
                      </label>
                      <input
                        type="number"
                        id="businessYears"
                        name="businessYears"
                        required
                        min="0"
                        max="50"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Camera className="w-4 h-4 inline mr-1" />
                        Mağaza Logosu *
                      </label>
                      <ImageUpload
                        onUpload={setLogoUrl}
                        onUploadSuccess={setLogoUrl}
                        initialImageUrl={logoUrl}
                        label="Logo Yükle"
                        folder="seller-logos"
                        type="image/png,image/jpeg"
                        maxSize={2}
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        400x400px, PNG (şeffaf arka plan önerilir)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Camera className="w-4 h-4 inline mr-1" />
                        Mağaza Banner (Opsiyonel)
                      </label>
                      <ImageUpload
                        onUpload={setBannerUrl}
                        onUploadSuccess={setBannerUrl}
                        initialImageUrl={bannerUrl}
                        label="Banner Yükle"
                        folder="seller-banners"
                        type="image/png,image/jpeg"
                        maxSize={5}
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        1920x400px, mağaza sayfası başlığı
                      </p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <Globe className="w-4 h-4 inline mr-1" />
                      Web Sitesi / Sosyal Medya (Opsiyonel)
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                      placeholder="https://www.orneksite.com"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: İletişim Bilgileri */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-[#CBA135]/20 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#CBA135]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">İletişim Bilgileri</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Müşterileriniz ve platformumuzla iletişim için</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <Shield className="w-4 h-4 inline mr-1" />
                      Bu bilgiler müşteri desteği, sipariş takibi ve acil durumlar için kullanılacaktır.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Yetkili Adı Soyadı *
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        required
                        defaultValue={session?.user?.name || ''}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                        placeholder="Ahmet Yılmaz"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactTitle" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Ünvan / Pozisyon *
                      </label>
                      <input
                        type="text"
                        id="contactTitle"
                        name="contactTitle"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                        placeholder="Genel Müdür / Kurucu / Satış Müdürü"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        E-posta Adresi *
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        required
                        defaultValue={session?.user?.email || ''}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                        placeholder="ornek@email.com"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Sipariş bildirimleri bu adrese gelecek
                      </p>
                    </div>

                    <div>
                      <label htmlFor="alternativeEmail" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Alternatif E-posta
                      </label>
                      <input
                        type="email"
                        id="alternativeEmail"
                        name="alternativeEmail"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                        placeholder="yedek@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Telefon Numarası *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                        placeholder="0555 XXX XX XX"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Müşteri desteği ve acil durumlar için
                      </p>
                    </div>

                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <MessageCircle className="w-4 h-4 inline mr-1" />
                        WhatsApp Business *
                      </label>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                        placeholder="0555 XXX XX XX"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Hızlı müşteri iletişimi için önemli
                      </p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      İş Yeri Adresi (Tam) *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all resize-none"
                      placeholder="Mahalle, Sokak, Bina No, Daire No, İlçe"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        İl *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                        placeholder="İzmir"
                      />
                    </div>

                    <div>
                      <label htmlFor="district" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        İlçe *
                      </label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                        placeholder="Bornova"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Posta Kodu *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                        placeholder="35040"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Kimlik & Vergi Bilgileri */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-[#CBA135]/20 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-[#CBA135]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kimlik & Vergi Bilgileri</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Yasal işlemler ve ödeme alımları için</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Satıcı Tipi *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="relative flex items-center p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#CBA135] transition-all group">
                        <input
                          type="radio"
                          name="sellerType"
                          value="individual"
                          defaultChecked
                          className="w-5 h-5 text-[#CBA135] border-gray-300 focus:ring-[#CBA135]"
                        />
                        <div className="ml-3">
                          <p className="font-semibold text-gray-900 dark:text-white">Bireysel</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Şahıs olarak satış (Basit muhasebe)</p>
                        </div>
                      </label>

                      <label className="relative flex items-center p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#CBA135] transition-all group">
                        <input
                          type="radio"
                          name="sellerType"
                          value="company"
                          className="w-5 h-5 text-[#CBA135] border-gray-300 focus:ring-[#CBA135]"
                        />
                        <div className="ml-3">
                          <p className="font-semibold text-gray-900 dark:text-white">Kurumsal</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Şirket / Limited (Fatura kesebilir)</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Building2 className="w-4 h-4 inline mr-1" />
                        Şirket Ünvanı (Kurumsal için)
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                        placeholder="ABC Ticaret Ltd. Şti."
                      />
                    </div>

                    <div>
                      <label htmlFor="mersisNo" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        MERSİS No (Kurumsal için)
                      </label>
                      <input
                        type="text"
                        id="mersisNo"
                        name="mersisNo"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                        placeholder="0000000000000000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="taxId" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <FileText className="w-4 h-4 inline mr-1" />
                        TC Kimlik No / Vergi No *
                      </label>
                      <input
                        type="text"
                        id="taxId"
                        name="taxId"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                        placeholder="XXXXXXXXXXX"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Bireysel: 11 haneli TC | Kurumsal: 10 haneli Vergi No
                      </p>
                    </div>

                    <div>
                      <label htmlFor="taxOffice" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Vergi Dairesi *
                      </label>
                      <input
                        type="text"
                        id="taxOffice"
                        name="taxOffice"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                        placeholder="Bornova Vergi Dairesi"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="iban" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        IBAN (Ödeme Alımı) *
                      </label>
                      <input
                        type="text"
                        id="iban"
                        name="iban"
                        required
                        pattern="^TR[0-9]{24}$"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all font-mono text-sm"
                        placeholder="TR00 0000 0000 0000 0000 0000 00"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Satış gelirleriniz bu hesaba aktarılacak
                      </p>
                    </div>

                    <div>
                      <label htmlFor="bankName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Banka Adı *
                      </label>
                      <select
                        id="bankName"
                        name="bankName"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Upload className="w-4 h-4 inline mr-1" />
                        Kimlik Ön Yüz *
                      </label>
                      <ImageUpload
                        onUpload={setIdFrontUrl}
                        onUploadSuccess={setIdFrontUrl}
                        initialImageUrl={idFrontUrl}
                        label="Kimlik Ön Yüz"
                        folder="seller-documents"
                        type="image/png,image/jpeg,application/pdf"
                        maxSize={5}
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        TC Kimlik kartı veya pasaport ön yüzü
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Upload className="w-4 h-4 inline mr-1" />
                        Kimlik Arka Yüz *
                      </label>
                      <ImageUpload
                        onUpload={setIdBackUrl}
                        onUploadSuccess={setIdBackUrl}
                        initialImageUrl={idBackUrl}
                        label="Kimlik Arka Yüz"
                        folder="seller-documents"
                        type="image/png,image/jpeg,application/pdf"
                        maxSize={5}
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        TC Kimlik kartı arka yüzü
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Lojistik & Operasyon */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-[#CBA135]/20 rounded-xl flex items-center justify-center">
                      <Truck className="w-5 h-5 text-[#CBA135]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lojistik & Operasyon</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Kargo ve stok yönetimi bilgileri</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Kargo Firması Tercihleri * (Birden fazla seçebilirsiniz)
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
                        <label key={cargo.value} className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#CBA135] transition-all">
                          <input
                            type="checkbox"
                            name="cargoCompanies"
                            value={cargo.value}
                            className="w-5 h-5 text-[#CBA135] border-gray-300 rounded focus:ring-[#CBA135]"
                          />
                          <span className="ml-3 text-gray-900 dark:text-white font-medium">{cargo.label}</span>
                          {cargo.popular && (
                            <span className="ml-auto text-xs bg-[#CBA135]/20 text-[#CBA135] px-2 py-1 rounded-full">Popüler</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="warehouseAddress" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Depo/Stok Adresi
                      </label>
                      <textarea
                        id="warehouseAddress"
                        name="warehouseAddress"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all resize-none"
                        placeholder="İş yeri adresi ile aynıysa boş bırakabilirsiniz"
                      />
                    </div>

                    <div>
                      <label htmlFor="returnAddress" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        İade Adresi *
                      </label>
                      <textarea
                        id="returnAddress"
                        name="returnAddress"
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all resize-none"
                        placeholder="Müşteri iadeleri için adres"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="preparationTime" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Kargo Hazırlık Süresi *
                      </label>
                      <select
                        id="preparationTime"
                        name="preparationTime"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                      >
                        <option value="">Süre seçin</option>
                        <option value="same-day">Aynı gün</option>
                        <option value="1-day">1 iş günü</option>
                        <option value="2-days">2 iş günü</option>
                        <option value="3-days">3 iş günü</option>
                        <option value="5-days">5 iş günü</option>
                        <option value="7-days">7 iş günü</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Sipariş sonrası kargoya verme süresi
                      </p>
                    </div>

                    <div>
                      <label htmlFor="estimatedStock" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Tahmini Ürün Adedi *
                      </label>
                      <select
                        id="estimatedStock"
                        name="estimatedStock"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] transition-all"
                      >
                        <option value="">Adet seçin</option>
                        <option value="1-50">1-50 ürün</option>
                        <option value="51-100">51-100 ürün</option>
                        <option value="101-500">101-500 ürün</option>
                        <option value="501-1000">501-1000 ürün</option>
                        <option value="1000+">1000+ ürün</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      İade Politikası *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#CBA135] transition-all">
                        <input
                          type="radio"
                          name="returnPolicy"
                          value="14-days"
                          defaultChecked
                          className="w-5 h-5 text-[#CBA135] border-gray-300 focus:ring-[#CBA135]"
                        />
                        <span className="ml-3 text-gray-900 dark:text-white">14 gün içinde iade (Standart)</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#CBA135] transition-all">
                        <input
                          type="radio"
                          name="returnPolicy"
                          value="30-days"
                          className="w-5 h-5 text-[#CBA135] border-gray-300 focus:ring-[#CBA135]"
                        />
                        <span className="ml-3 text-gray-900 dark:text-white">30 gün içinde iade (Önerilen)</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#CBA135] transition-all">
                        <input
                          type="radio"
                          name="returnPolicy"
                          value="no-return"
                          className="w-5 h-5 text-[#CBA135] border-gray-300 focus:ring-[#CBA135]"
                        />
                        <span className="ml-3 text-gray-900 dark:text-white">İade kabul etmiyorum</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Onay & Sözleşme */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-[#CBA135]/20 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-[#CBA135]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Son Adım!</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Sözleşmeleri onaylayın ve başvurunuzu tamamlayın</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#CBA135]/10 to-[#F4D03F]/10 border border-[#CBA135]/30 rounded-2xl p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <Sparkles className="w-6 h-6 text-[#CBA135] flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">Satıcı Avantajları</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Sınırsız ürün listeleme</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Profesyonel mağaza paneli</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Detaylı satış raporları</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Pazarlama ve reklam araçları</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Otomatik fatura kesimi</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">7/24 satıcı desteği</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Hızlı ödeme (haftalık)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Ücretsiz eğitim ve danışmanlık</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                    <h3 className="font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Komisyon ve Ücretler
                    </h3>
                    <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                      <li className="flex items-start space-x-2">
                        <span className="font-bold">•</span>
                        <span><strong>Platform Komisyonu:</strong> %15 (KDV dahil)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="font-bold">•</span>
                        <span><strong>Ödeme İşlem Ücreti:</strong> %2.5 (Banka/Kart işlemleri)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="font-bold">•</span>
                        <span><strong>Kargo Ücreti:</strong> Müşteriden tahsil edilir</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="font-bold">•</span>
                        <span><strong>Ödeme Zamanı:</strong> Her Pazartesi (haftalık)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start space-x-3 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#CBA135] transition-all bg-white dark:bg-gray-800">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        required
                        className="mt-1 h-5 w-5 text-[#CBA135] border-gray-300 rounded focus:ring-[#CBA135]"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white mb-1">
                          Satıcı Sözleşmesi *
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <a href="/seller-agreement" target="_blank" className="text-[#CBA135] hover:underline font-medium">
                            Satıcı sözleşmesini
                          </a>
                          {' '}okudum, anladım ve kabul ediyorum.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#CBA135] transition-all bg-white dark:bg-gray-800">
                      <input
                        type="checkbox"
                        name="acceptCommission"
                        required
                        className="mt-1 h-5 w-5 text-[#CBA135] border-gray-300 rounded focus:ring-[#CBA135]"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white mb-1">
                          Komisyon Oranları *
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          %15 platform komisyon oranını ve %2.5 ödeme işlem ücretini kabul ediyorum.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#CBA135] transition-all bg-white dark:bg-gray-800">
                      <input
                        type="checkbox"
                        name="acceptKVKK"
                        required
                        className="mt-1 h-5 w-5 text-[#CBA135] border-gray-300 rounded focus:ring-[#CBA135]"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white mb-1">
                          KVKK Aydınlatma Metni *
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <a href="/kvkk" target="_blank" className="text-[#CBA135] hover:underline font-medium">
                            KVKK aydınlatma metnini
                          </a>
                          {' '}okudum ve kişisel verilerimin işlenmesini kabul ediyorum.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#CBA135] transition-all bg-white dark:bg-gray-800">
                      <input
                        type="checkbox"
                        name="acceptQuality"
                        required
                        className="mt-1 h-5 w-5 text-[#CBA135] border-gray-300 rounded focus:ring-[#CBA135]"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white mb-1">
                          Kalite Standartları *
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Orijinal, kaliteli ve yasal ürünler satacağımı, sahte/korsan ürün satmayacağımı taahhüt ediyorum.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-semibold mb-1">Başvuru Süreci</p>
                        <p>
                          Başvurunuz 1-3 iş günü içinde incelenecektir. Kimlik doğrulama ve vergi bilgileri kontrol edilecektir. 
                          Onay sonrası e-posta ile bilgilendirilecek ve satıcı panelinize erişim sağlanacaktır.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                whileHover={{ scale: currentStep === 1 ? 1 : 1.05 }}
                whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                  currentStep === 1
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Geri</span>
              </motion.button>

              <div className="text-center flex-1 mx-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Adım <span className="font-bold text-[#CBA135]">{currentStep}</span> / {totalSteps}
                </p>
              </div>

              {currentStep < totalSteps ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black font-semibold rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <span>İleri</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Gönderiliyor...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
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
          className="mt-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 dark:border-gray-700/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-[#CBA135]" />
                <span>Başvuru Sonrası</span>
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#CBA135]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#CBA135]">1</span>
                  </div>
                  <p>Başvurunuz 1-3 iş günü içinde incelenecek</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#CBA135]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#CBA135]">2</span>
                  </div>
                  <p>Kimlik ve vergi bilgileri doğrulanacak</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#CBA135]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#CBA135]">3</span>
                  </div>
                  <p>Onay e-postası gönderilecek</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#CBA135]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#CBA135]">4</span>
                  </div>
                  <p>Hemen ürün eklemeye başlayabilirsiniz</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                <Phone className="w-5 h-5 text-[#CBA135]" />
                <span>Yardıma mı İhtiyacınız Var?</span>
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <Phone className="w-5 h-5 text-[#CBA135]" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Telefon</p>
                    <a href="tel:05558988242" className="text-[#CBA135] hover:underline">0555 898 82 42</a>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <Mail className="w-5 h-5 text-[#CBA135]" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">E-posta</p>
                    <a href="mailto:bentahasarii@gmail.com" className="text-[#CBA135] hover:underline">bentahasarii@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-[#CBA135]" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">WhatsApp</p>
                    <a href="https://wa.me/905558988242" target="_blank" className="text-[#CBA135] hover:underline">Hemen Yaz</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
