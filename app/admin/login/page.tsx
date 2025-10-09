"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			setError('E-posta ve şifre gerekli');
			return;
		}
		setIsLoading(true);
		setError('');
		
		try {
			const response = await fetch('/api/admin/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password, rememberMe }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || 'Giriş başarısız');
				setIsLoading(false);
				return;
			}

			// Success - redirect to dashboard
			router.push('/admin/dashboard');
			router.refresh();
		} catch (err) {
			console.error('Login error:', err);
			setError('Bir hata oluştu. Lütfen tekrar deneyin.');
			setIsLoading(false);
		}
	};

	const fillDemoCredentials = () => {
		setEmail('admin@tdcproducts.com');
		setPassword('TDCAdmin2024!');
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
			{/* Animated Background */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-[#CBA135] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F4D03F] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
			</div>

			{/* Grid Pattern */}
			<div className="absolute inset-0 opacity-5" style={{
				backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
			}}></div>
			
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="relative w-full max-w-md z-10"
			>
				{/* Main Card */}
				<div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
					{/* Header */}
					<div className="text-center mb-8">
						<motion.div
							initial={{ scale: 0, rotate: -180 }}
							animate={{ scale: 1, rotate: 0 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							className="w-20 h-20 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
						>
							<Shield className="w-10 h-10 text-black" />
						</motion.div>
						<h1 className="text-3xl font-bold text-white mb-2">TDC Products Admin</h1>
						<p className="text-gray-300">Güvenli Yönetim Paneli</p>
					</div>

					{/* Demo Credentials Card */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4 }}
						className="bg-gradient-to-r from-[#CBA135]/20 to-[#F4D03F]/20 border border-[#CBA135]/30 rounded-xl p-4 mb-6 backdrop-blur-sm"
					>
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-semibold text-[#F4D03F]">🔐 Admin Girişi</h3>
							<button
								onClick={fillDemoCredentials}
								className="text-xs bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black px-3 py-1 rounded-full hover:shadow-lg transition-all font-bold"
							>
								Otomatik Doldur
							</button>
						</div>
						<div className="space-y-1 text-sm text-gray-300">
							<p><span className="font-medium text-[#CBA135]">E-posta:</span> admin@tdcproducts.com</p>
							<p><span className="font-medium text-[#CBA135]">Şifre:</span> TDCAdmin2024!</p>
						</div>
					</motion.div>

					{/* Form */}
					<form onSubmit={onSubmit} className="space-y-6">
						{error && (
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm backdrop-blur-sm"
							>
								⚠️ {error}
							</motion.div>
						)}

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-semibold text-gray-200 mb-2">
									<Mail className="w-4 h-4 inline mr-2" />
									E-posta Adresi
								</label>
								<input
									type="email"
									placeholder="admin@tdcproducts.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm"
									disabled={isLoading}
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-200 mb-2">
									<Lock className="w-4 h-4 inline mr-2" />
									Şifre
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										placeholder="••••••••"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm pr-12"
										disabled={isLoading}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
									>
										{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
									</button>
								</div>
							</div>

							<div className="flex items-center">
								<input
									id="remember-me"
									type="checkbox"
									checked={rememberMe}
									onChange={(e) => setRememberMe(e.target.checked)}
									className="h-4 w-4 text-[#CBA135] focus:ring-[#CBA135] border-gray-300 rounded"
									disabled={isLoading}
								/>
								<label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-300">
									Beni hatırla (30 gün)
								</label>
							</div>
						</div>

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type="submit"
							disabled={isLoading}
							className="w-full bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black font-bold py-3 px-4 rounded-xl hover:shadow-2xl hover:shadow-[#CBA135]/50 focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<div className="flex items-center justify-center space-x-2">
									<div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
									<span>Giriş yapılıyor...</span>
								</div>
							) : (
								<span className="flex items-center justify-center">
									<Shield className="w-5 h-5 mr-2" />
									Admin Paneline Giriş
								</span>
							)}
						</motion.button>
					</form>

					{/* Security Notice */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6 }}
						className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
					>
						<p className="text-xs text-blue-200 text-center">
							🔒 Bu sayfa SSL ile şifrelenir. Tüm giriş denemeleri loglanır.
						</p>
					</motion.div>

					{/* Footer */}
					<div className="mt-6 pt-6 border-t border-white/10 text-center">
						<p className="text-xs text-gray-400">
							© 2024 TDC Products. Tüm hakları saklıdır.
						</p>
					</div>
				</div>

				{/* Decorative Elements */}
				<div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] rounded-full opacity-20 blur-2xl"></div>
				<div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-[#F4D03F] to-[#CBA135] rounded-full opacity-20 blur-2xl"></div>
			</motion.div>

			<style jsx>{`
				@keyframes blob {
					0% { transform: translate(0px, 0px) scale(1); }
					33% { transform: translate(30px, -50px) scale(1.1); }
					66% { transform: translate(-20px, 20px) scale(0.9); }
					100% { transform: translate(0px, 0px) scale(1); }
				}
				.animate-blob {
					animation: blob 7s infinite;
				}
				.animation-delay-2000 {
					animation-delay: 2s;
				}
				.animation-delay-4000 {
					animation-delay: 4s;
				}
			`}</style>
		</div>
	)
}
