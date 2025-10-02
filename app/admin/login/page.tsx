"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			setError('E-posta ve şifre gerekli');
			return;
		}
		// Demo auth: accept any non-empty credentials
		document.cookie = 'adminAuth=true; path=/; max-age=86400';
		router.push('/admin/dashboard');
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
			<form onSubmit={onSubmit} className="w-full max-w-sm bg-white border rounded-xl p-6 shadow-sm space-y-4">
				<h1 className="text-xl font-bold text-center">Admin Giriş</h1>
				{error && <div className="text-red-600 text-sm">{error}</div>}
				<input
					type="email"
					placeholder="E-posta"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full border rounded-md px-3 py-2"
				/>
				<input
					type="password"
					placeholder="Şifre"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full border rounded-md px-3 py-2"
				/>
				<button type="submit" className="w-full bg-indigo-600 text-white rounded-md px-3 py-2">Giriş Yap</button>
			</form>
		</div>
	)
}
