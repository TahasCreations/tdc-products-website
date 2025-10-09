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
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Image as ImageIcon,
  CreditCard,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MessageCircle
} from 'lucide-react';

export default function SellerApplyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [state, formAction] = useFormState(applySeller, { ok: false, error: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/kayit?type=seller');
    }
  }, [status, router]);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    if (logoUrl) {
      formData.set('logoUrl', logoUrl);
    }
    await formAction(formData);
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#CBA135] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
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
              {[
                { num: 1, title: 'Mağaza Bilgileri', icon: Store },
                { num: 2, title: 'İletişim', icon: Phone },
                { num: 3, title: 'Kimlik & Vergi', icon: CreditCard },
                { num: 4, title: 'Onay', icon: CheckCircle2 }
              ].map((step, index) => {
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
                        className={`
                          w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-md
                          ${isCompleted || isActive ? 'text-black' : 'text-gray-400 dark:text-gray-500'}
                        `}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </motion.div>
                      <p className={`
                        text-xs font-medium text-center hidden sm:block
                        ${isActive ? 'text-[#CBA135]' : isCompleted ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}
                      `}>
                        {step.title}
                      </p>
                    </div>
                    {index < 3 && (
                      <div className={`
                        flex-1 h-1 mx-2 rounded-full transition-all duration-500
                        ${isCompleted ? 'bg-[#CBA135]' : 'bg-gray-200 dark:bg-gray-700'}
                      `} />
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
          {/* Success/Error Messages */}
          <AnimatePresence>
          {state.error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 p-4"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-red-700 dark:text-red-300">
                {state.error === 'auth_required' && 'Giriş yapmanız gerekiyor'}
                {state.error === 'invalid_data' && 'Lütfen tüm alanları doğru şekilde doldurun'}
                {state.error === 'database_error' && 'Bir hata oluştu, lütfen tekrar deneyin'}
                    {!['auth_required', 'invalid_data', 'database_error'].includes(state.error) && state.error}
              </p>
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
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="text-green-700 dark:text-green-300">
                    🎉 Başvurunuz alındı! En kısa sürede değerlendirilecek ve size dönüş yapılacaktır.
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
                      placeholder="Mağazanızı tanıtın: Ne tür ürünler satıyorsunuz? Neden sizi tercih etmeliler?"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Minimum 50 karakter (şu an: 0)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Mağaza Logosu
                    </label>
                    <ImageUpload
                      onUpload={setLogoUrl}
                      onUploadSuccess={setLogoUrl}
                      initialImageUrl={logoUrl}
                      label="Logo Yükle (PNG, JPG - Max 2MB)"
                      folder="seller-logos"
                      type="image/png,image/jpeg"
                      maxSize={2}
                      className="w-full"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Önerilen boyut: 400x400px, şeffaf arka plan (PNG)
                    </p>
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">Müşterilerinizle iletişim için</p>
                    </div>
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all"
                        placeholder="Ahmet Yılmaz"
                      />
                    </div>

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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all"
                        placeholder="ornek@email.com"
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all"
                        placeholder="0555 XXX XX XX"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Müşteri desteği için kullanılacak
                      </p>
                    </div>

                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <MessageCircle className="w-4 h-4 inline mr-1" />
                        WhatsApp (Opsiyonel)
                      </label>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all"
                        placeholder="0555 XXX XX XX"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      İş Adresi *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all resize-none"
                      placeholder="Mahalle, Sokak, Bina No, Daire No, İlçe/İl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                      <label htmlFor="city" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        İl *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all"
                        placeholder="İzmir"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Posta Kodu
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all"
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">Yasal işlemler için gerekli</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Satıcı Tipi *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="relative flex items-center p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#CBA135] transition-all">
                        <input
                          type="radio"
                          name="sellerType"
                          value="individual"
                          defaultChecked
                          className="sr-only peer"
                        />
                        <div className="flex items-center space-x-3 peer-checked:text-[#CBA135]">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:border-[#CBA135] peer-checked:bg-[#CBA135] flex items-center justify-center">
                            <div className="w-2 h-2 bg-black rounded-full opacity-0 peer-checked:opacity-100"></div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Bireysel</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Şahıs olarak satış</p>
                          </div>
                        </div>
                      </label>

                      <label className="relative flex items-center p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#CBA135] transition-all">
                        <input
                          type="radio"
                          name="sellerType"
                          value="company"
                          className="sr-only peer"
                        />
                        <div className="flex items-center space-x-3 peer-checked:text-[#CBA135]">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:border-[#CBA135] peer-checked:bg-[#CBA135] flex items-center justify-center">
                            <div className="w-2 h-2 bg-black rounded-full opacity-0 peer-checked:opacity-100"></div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Kurumsal</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Şirket olarak satış</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="taxId" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      TC Kimlik No / Vergi No *
                    </label>
                    <input
                      type="text"
                      id="taxId"
                      name="taxId"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all"
                      placeholder="XXXXXXXXXXX"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Bireysel: TC Kimlik No (11 haneli) | Kurumsal: Vergi No (10 haneli)
                    </p>
                  </div>

                  <div>
                    <label htmlFor="taxOffice" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Vergi Dairesi (Kurumsal için zorunlu)
                </label>
                <input
                  type="text"
                      id="taxOffice"
                      name="taxOffice"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all"
                      placeholder="Örn: Bornova Vergi Dairesi"
                />
              </div>

              <div>
                    <label htmlFor="iban" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      IBAN (Ödeme alımları için) *
                </label>
                <input
                  type="text"
                  id="iban"
                  name="iban"
                      required
                      pattern="^TR[0-9]{24}$"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all font-mono"
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
                    <input
                      type="text"
                      id="bankName"
                      name="bankName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all"
                      placeholder="Örn: Ziraat Bankası"
              />
            </div>
                </motion.div>
              )}

              {/* Step 4: Onay & Sözleşme */}
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
                      <CheckCircle2 className="w-5 h-5 text-[#CBA135]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Son Adım!</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Sözleşmeleri onaylayın</p>
                    </div>
            </div>

                  <div className="bg-gradient-to-br from-[#CBA135]/10 to-[#F4D03F]/10 dark:from-[#CBA135]/20 dark:to-[#F4D03F]/20 border border-[#CBA135]/30 rounded-2xl p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <Sparkles className="w-6 h-6 text-[#CBA135] flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Satıcı Avantajları</h3>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <li className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>Sınırsız ürün listeleme</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>Profesyonel mağaza yönetim paneli</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>Detaylı satış raporları ve analizler</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>Pazarlama ve reklam araçları</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>7/24 satıcı desteği</span>
                          </li>
              </ul>
            </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start space-x-3 p-4 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#CBA135] transition-all">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        required
                        className="mt-1 h-5 w-5 text-[#CBA135] border-gray-300 dark:border-gray-600 rounded focus:ring-[#CBA135]"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          Satıcı Sözleşmesi
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <Link href="/seller-agreement" target="_blank" className="text-[#CBA135] hover:underline">
                            Satıcı sözleşmesini
                          </Link>
                          {' '}okudum ve kabul ediyorum.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-4 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#CBA135] transition-all">
                      <input
                        type="checkbox"
                        name="acceptCommission"
                        required
                        className="mt-1 h-5 w-5 text-[#CBA135] border-gray-300 dark:border-gray-600 rounded focus:ring-[#CBA135]"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          Komisyon Oranları
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          %15 platform komisyon oranını kabul ediyorum.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-4 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-[#CBA135] transition-all">
                      <input
                        type="checkbox"
                        name="acceptKVKK"
                        required
                        className="mt-1 h-5 w-5 text-[#CBA135] border-gray-300 dark:border-gray-600 rounded focus:ring-[#CBA135]"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          KVKK Aydınlatma Metni
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <Link href="/kvkk" target="_blank" className="text-[#CBA135] hover:underline">
                            KVKK aydınlatma metnini
                          </Link>
                          {' '}okudum ve kişisel verilerimin işlenmesini kabul ediyorum.
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
                          Başvurunuz 1-3 iş günü içinde incelenecektir. Onay sonrası e-posta ile bilgilendirileceksiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                whileHover={{ scale: currentStep === 1 ? 1 : 1.05 }}
                whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
                className={`
                  px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2
                  ${currentStep === 1
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }
                `}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Geri</span>
              </motion.button>

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
                  className="px-8 py-3 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black font-bold rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
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

          {/* Additional Info */}
          <div className="px-8 pb-8">
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Sorularınız mı var?{' '}
                <a href="tel:05558998242" className="text-[#CBA135] hover:underline font-semibold">
                  0555 899 82 42
                </a>
                {' '}numaralı telefondan bize ulaşabilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Help Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 dark:border-gray-700/50"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-[#CBA135]" />
            <span>Başvuru Sonrası Ne Olacak?</span>
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
              <p>Onay durumu e-posta ile bildirilecek</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#CBA135]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-[#CBA135]">3</span>
              </div>
              <p>Onaylandıktan sonra hemen ürün eklemeye başlayabilirsiniz</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
