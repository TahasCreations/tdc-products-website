"use client";

import Link from "next/link";

export default function WhatsAppButton() {
  const phone = "05558988242";
  const message = encodeURIComponent("Merhaba, TDC Products hakkında bilgi almak istiyorum.");
  const href = `https://wa.me/90${phone.replace(/\D/g, "").replace(/^0/, "")}?text=${message}`;

  return (
    <Link
      href={href}
      target="_blank"
      className="fixed z-50 bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white shadow-lg rounded-full px-5 py-3 flex items-center gap-2 transition-colors"
      aria-label="WhatsApp ile yazın"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.59-5.96C.155 5.3 5.455 0 12.02 0c3.17 0 6.155 1.234 8.4 3.48a11.82 11.82 0 013.475 8.396c-.003 6.563-5.303 11.864-11.87 11.864a11.9 11.9 0 01-5.95-1.59L.057 24zm6.597-3.807c1.78.995 3.053 1.277 5.036 1.28 5.448.003 9.89-4.434 9.894-9.877.002-5.462-4.41-9.89-9.872-9.894-5.447-.003-9.89 4.434-9.893 9.877a9.82 9.82 0 001.693 5.513l-.999 3.648 3.141-.547zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.654-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.496.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
      </svg>
      <span className="font-medium">WhatsApp ile yazın</span>
    </Link>
  );
}
