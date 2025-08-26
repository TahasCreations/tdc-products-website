'use client';

export default function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Merhaba! TDC Products ürünleri hakkında bilgi almak istiyorum.');
    window.open(`https://wa.me/905558988242?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group hover:scale-110"
      aria-label="WhatsApp ile iletişime geç"
    >
      <i className="ri-whatsapp-fill text-2xl"></i>
      <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        WhatsApp ile yazın
      </span>
    </button>
  );
}