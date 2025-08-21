"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-4 px-8 text-center mt-8">
      <p className="text-sm">&copy; {new Date().getFullYear()} TDC Products. Tüm hakları saklıdır.</p>
    </footer>
  );
}
