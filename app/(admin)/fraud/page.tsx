import { requireRole } from "@/lib/guards";

export const dynamic = 'force-dynamic';

export default async function FraudDetectionPage() {
  await requireRole("ADMIN");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Fraud Tespiti</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-600 mb-4">
            Bu sayfa sadece ADMIN kullanıcıları tarafından erişilebilir.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Şüpheli İşlemler</h3>
              <p className="text-red-700 text-sm">Potansiyel fraud işlemlerini tespit edin</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Risk Analizi</h3>
              <p className="text-yellow-700 text-sm">Yüksek riskli hesapları analiz edin</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Güvenlik Raporları</h3>
              <p className="text-green-700 text-sm">Detaylı güvenlik raporları oluşturun</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
