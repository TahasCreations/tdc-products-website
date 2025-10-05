"use client";

import { usePathname } from "next/navigation";
import Header from "../../src/components/Header";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Show header on /products and /categories/* routes
  // Never show on /admin routes
  const shouldShowHeader = 
    pathname.startsWith("/products") || 
    pathname.startsWith("/categories/") ||
    pathname === "/";

  // Never show header on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  if (!shouldShowHeader) {
    return null;
  }

  return <Header />;
}
