'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Zap, 
  Store, 
  Users, 
  TrendingUp, 
  Globe,
  Star,
  Gift,
  Crown
} from 'lucide-react';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | 'influencer' | null>(null);
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/',
      });

      if (result?.error) {
        setError('Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.');
      } else if (result?.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError('Beklenmeyen bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const roleOptions = [
    {
      id: 'buyer',
      title: 'Müşteri',
      description: 'Ürün satın almak istiyorum',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      features: ['Güvenli alışveriş', 'Hızlı teslimat', 'Müşteri desteği']
    },
    {
      id: 'seller',
      title: 'Satıcı',
      description: 'Ürün satmak istiyorum',
      icon: Store,
      color: 'from-green-500 to-green-600',
      features: ['Kolay ürün yönetimi', 'Düşük komisyon', 'Satış analitikleri']
    },
    {
      id: 'influencer',
      title: 'Influencer',
      description: 'Marka işbirlikleri yapmak istiyorum',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      features: ['Marka işbirlikleri', 'Yüksek kazanç', 'Özel kampanyalar']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0B] via-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#CBA135] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F4D03F] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#CBA135] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <motion.div 
        className="relative w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] rounded-3xl mb-6"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Crown className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold text-white mb-4"
            variants={itemVariants}
          >
            TDC Market'e Katıl
          </motion.h1>
          
          <motion.p 
            className="text-gray-300 text-lg max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Hangi rol size uygun? Seçiminizi yapın ve hemen başlayın!
          </motion.p>
        </motion.div>

        {/* Role Selection */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
        >
          {roleOptions.map((role, index) => (
            <motion.div
              key={role.id}
              className={`relative cursor-pointer group ${
                selectedRole === role.id 
                  ? 'ring-2 ring-[#CBA135] scale-105' 
                  : 'hover:scale-105'
              } transition-all duration-300`}
              variants={itemVariants}
              onClick={() => setSelectedRole(role.id as any)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 h-full">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${role.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{role.description}</p>

                {/* Features */}
                <div className="space-y-2">
                  {role.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-xs text-gray-400">
                      <Star className="w-3 h-3 mr-2 text-[#CBA135]" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Selection Indicator */}
                <AnimatePresence>
                  {selectedRole === role.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute top-4 right-4 w-6 h-6 bg-[#CBA135] rounded-full flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Card */}
        <motion.div 
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
          variants={itemVariants}
        >
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl"
              >
                <p className="text-red-300 text-sm text-center">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Sign Up Button */}
          <motion.button
            onClick={handleGoogleSignUp}
            disabled={isLoading || !selectedRole}
            className="w-full flex items-center justify-center px-6 py-4 bg-white/90 hover:bg-white text-gray-900 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            variants={itemVariants}
            whileHover={{ scale: selectedRole ? 1.02 : 1 }}
            whileTap={{ scale: selectedRole ? 0.98 : 1 }}
          >
            {isLoading ? (
              <motion.div 
                className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {selectedRole === 'buyer' && 'Google ile Kayıt Ol'}
                {selectedRole === 'seller' && 'Satıcı Olarak Kayıt Ol'}
                {selectedRole === 'influencer' && 'Influencer Olarak Kayıt Ol'}
                {!selectedRole && 'Önce bir rol seçin'}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>

          {/* Special Role Actions */}
          <AnimatePresence>
            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 space-y-4"
              >
                {selectedRole === 'seller' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 p-4 rounded-xl"
                  >
                    <div className="flex items-center mb-2">
                      <Store className="w-5 h-5 text-green-400 mr-2" />
                      <span className="text-green-300 font-medium">Satıcı Avantajları</span>
                    </div>
                    <p className="text-xs text-green-200">
                      Kayıt olduktan sonra satıcı başvuru formunu doldurabilir ve onay sürecini başlatabilirsiniz.
                    </p>
                  </motion.div>
                )}

                {selectedRole === 'influencer' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 p-4 rounded-xl"
                  >
                    <div className="flex items-center mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-400 mr-2" />
                      <span className="text-purple-300 font-medium">Influencer Avantajları</span>
                    </div>
                    <p className="text-xs text-purple-200">
                      Kayıt olduktan sonra influencer başvuru formunu doldurabilir ve marka işbirlikleri için onay alabilirsiniz.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terms */}
          <motion.div className="mt-6 text-center" variants={itemVariants}>
            <p className="text-xs text-gray-400">
              Kayıt olarak{' '}
              <Link href="/terms" className="text-[#CBA135] hover:text-[#F4D03F] transition-colors">
                Kullanım Şartları
              </Link>{' '}
              ve{' '}
              <Link href="/privacy" className="text-[#CBA135] hover:text-[#F4D03F] transition-colors">
                Gizlilik Politikası
              </Link>{' '}
              'nı kabul etmiş olursunuz.
            </p>
          </motion.div>

          {/* Sign In Link */}
          <motion.div className="mt-6 text-center" variants={itemVariants}>
            <p className="text-gray-400 text-sm">
              Zaten hesabınız var mı?{' '}
              <Link 
                href="/auth/signin" 
                className="font-medium text-[#CBA135] hover:text-[#F4D03F] transition-colors duration-300 hover:underline"
              >
                Giriş yapın
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div 
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
          variants={containerVariants}
        >
          {[
            { icon: Shield, text: "Güvenli", delay: 0 },
            { icon: Zap, text: "Hızlı", delay: 0.1 },
            { icon: Globe, text: "Global", delay: 0.2 },
            { icon: Gift, text: "Özel", delay: 0.3 }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: feature.delay + 1 }}
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-2">
                <feature.icon className="w-5 h-5 text-[#CBA135]" />
              </div>
              <span className="text-xs text-gray-400">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}