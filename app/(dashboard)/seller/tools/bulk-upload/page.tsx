import { requireRole, requireEntitlement } from "@/lib/guards";

export default async function BulkUploadPage() {
  await requireRole("SELLER", "ADMIN");
  await requireEntitlement("bulk-upload");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Toplu Ürün Yükleme</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-600 mb-4">
            Bu araç sadece PRO plan aboneleri tarafından kullanılabilir.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">Excel/CSV Yükleme</h3>
              <p className="text-orange-700 text-sm">Toplu ürün yükleme için Excel/CSV dosyası yükleyin</p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-2">Otomatik İşleme</h3>
              <p className="text-indigo-700 text-sm">Dosyalarınız otomatik olarak işlenir</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
