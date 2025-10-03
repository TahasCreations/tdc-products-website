import { requireRole, requireEntitlement } from "@/src/lib/guards";

export default async function KeywordToolPage() {
  await requireRole("SELLER", "ADMIN");
  await requireEntitlement("keyword-tool");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Anahtar Kelime Analiz Aracı</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-600 mb-4">
            Bu araç sadece GROWTH ve PRO plan aboneleri tarafından kullanılabilir.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Anahtar Kelime Araştırması</h3>
              <p className="text-blue-700 text-sm">Popüler anahtar kelimeleri keşfedin</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Rekabet Analizi</h3>
              <p className="text-green-700 text-sm">Rakip analizi yapın</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Trend Takibi</h3>
              <p className="text-purple-700 text-sm">Güncel trendleri takip edin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
