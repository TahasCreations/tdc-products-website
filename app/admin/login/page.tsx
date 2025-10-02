"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
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
		
		// Simulate loading for better UX
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		// Demo auth: accept any non-empty credentials
		document.cookie = 'adminAuth=true; path=/; max-age=86400';
		router.push('/admin/dashboard');
	};

	const fillDemoCredentials = () => {
		setEmail('admin@tdcmarket.com');
		setPassword('demo123');
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-20" style={{
				backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
			}}></div>
			
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="relative w-full max-w-md"
			>
				{/* Main Card */}
				<div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
					{/* Header */}
					<div className="text-center mb-8">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
						>
							<span className="text-white font-bold text-2xl">T</span>
						</motion.div>
						<h1 className="text-2xl font-bold text-gray-900 mb-2">TDC Market Admin</h1>
						<p className="text-gray-600">Yönetim paneline hoş geldiniz</p>
					</div>

					{/* Demo Credentials Card */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4 }}
						className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6"
					>
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-semibold text-blue-900">Demo Bilgileri</h3>
							<button
								onClick={fillDemoCredentials}
								className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
							>
								Otomatik Doldur
							</button>
						</div>
						<div className="space-y-1 text-sm text-blue-800">
							<p><span className="font-medium">E-posta:</span> admin@tdcmarket.com</p>
							<p><span className="font-medium">Şifre:</span> demo123</p>
						</div>
					</motion.div>

					{/* Form */}
					<form onSubmit={onSubmit} className="space-y-6">
						{error && (
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
							>
								{error}
							</motion.div>
						)}

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									E-posta Adresi
								</label>
								<input
									type="email"
									placeholder="admin@tdcmarket.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50"
									disabled={isLoading}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Şifre
								</label>
								<input
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50"
									disabled={isLoading}
								/>
							</div>
						</div>

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type="submit"
							disabled={isLoading}
							className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<div className="flex items-center justify-center space-x-2">
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									<span>Giriş yapılıyor...</span>
								</div>
							) : (
								'Admin Paneline Giriş'
							)}
						</motion.button>
					</form>

					{/* Footer */}
					<div className="mt-8 pt-6 border-t border-gray-200 text-center">
						<p className="text-xs text-gray-500">
							© 2024 TDC Market. Tüm hakları saklıdır.
						</p>
					</div>
				</div>

				{/* Decorative Elements */}
				<div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>
				<div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 blur-xl"></div>
			</motion.div>
		</div>
	)
}
