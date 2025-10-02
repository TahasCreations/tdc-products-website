"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ModernAdminLayout from '../../src/components/admin/ModernAdminLayout';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
	const [authed, setAuthed] = useState(false);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const isAuthed = document.cookie.includes('adminAuth=true');
		setAuthed(isAuthed);
		setLoading(false);
		if (!isAuthed && pathname !== '/admin/login') {
			router.replace('/admin/login');
		}
	}, [router, pathname]);

	if (loading) return null;
	if (!authed && pathname !== '/admin/login') return null;

	// Allow login page to render without admin shell
	if (pathname === '/admin/login') {
		return <>{children}</>;
	}

	return (
		<ModernAdminLayout>
			{children}
		</ModernAdminLayout>
	);
}
