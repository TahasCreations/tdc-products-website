"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndexRedirect() {
	const router = useRouter();
	useEffect(() => {
		const isAuthed = document.cookie.includes('adminAuth=true');
		if (isAuthed) {
			router.replace('/admin/dashboard');
		} else {
			router.replace('/admin/login');
		}
	}, [router]);
	return null;
}


