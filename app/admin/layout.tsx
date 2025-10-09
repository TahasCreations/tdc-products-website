"use client";

import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ModernAdminLayout>{children}</ModernAdminLayout>;
}
