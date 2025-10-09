"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminIndexRedirect() {
	const router = useRouter();
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch('/api/admin/auth/verify');
				const data = await response.json();

				if (data.authenticated) {
					router.replace('/admin/dashboard');
				} else {
					router.replace('/admin/login');
				}
			} catch (error) {
				console.error('Auth check error:', error);
				router.replace('/admin/login');
			} finally {
				setIsChecking(false);
			}
		};

		checkAuth();
	}, [router]);

	if (isChecking) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center"
				>
					<div className="w-16 h-16 border-4 border-[#CBA135] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-white text-lg font-semibold">Yetkilendirme kontrol ediliyor...</p>
				</motion.div>
			</div>
		);
	}

	return null;
}
