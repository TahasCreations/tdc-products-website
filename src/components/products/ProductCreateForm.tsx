"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProductCreateForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("figur-koleksiyon");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: "figur-koleksiyon", label: "Figür & Koleksiyon" },
    { value: "moda-aksesuar", label: "Moda & Aksesuar" },
    { value: "elektronik", label: "Elektronik" },
    { value: "ev-yasam", label: "Ev & Yaşam" },
    { value: "sanat-hobi", label: "Sanat & Hobi" },
    { value: "hediyelik", label: "Hediyelik" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!file) {
      setError("Lütfen bir görsel seçin");
      setLoading(false);
      return;
    }

    if (!title || !slug || !category || !price) {
      setError("Lütfen tüm gerekli alanları doldurun");
      setLoading(false);
      return;
    }

    try {
      // 1) İmzalı upload URL al
      const uploadResponse = await fetch("/api/uploads/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fileName: file.name, 
          contentType: file.type, 
          size: file.size,
          prefix: "products" 
        }),
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload URL alınamadı: ${errorText}`);
      }

      const { uploadUrl, objectPath } = await uploadResponse.json();

      // 2) Dosyayı GCS'ye yükle
      const uploadResult = await fetch(uploadUrl, { 
        method: "PUT", 
        headers: { "Content-Type": file.type }, 
        body: file 
      });

      if (!uploadResult.ok) {
        throw new Error("Dosya yüklenemedi");
      }

      // 3) Ürün kaydı (objectPath'i images[] içine yaz)
      const productResponse = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          slug, 
          category, 
          subcategory: subcategory || null,
          price, 
          stock,
          description: description || null,
          images: [objectPath], // Sadece objectPath, tam URL değil
          attributes: {}
        }),
      });

      if (!productResponse.ok) {
        const errorText = await productResponse.text();
        throw new Error(`Ürün oluşturulamadı: ${errorText}`);
      }

      const result = await productResponse.json();

      if (result.ok) {
        setSuccess(true);
        // Formu temizle
        setFile(null);
        setTitle("");
        setSlug("");
        setCategory("figur-koleksiyon");
        setSubcategory("");
        setPrice(0);
        setStock(0);
        setDescription("");
      } else {
        setError(result.error || "Ürün oluşturulamadı");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Yeni Ürün Ekle</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Başlık */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Başlığı *
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Örn: Naruto Uzumaki Figürü"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug *
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="naruto-uzumaki-figuru"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Sadece küçük harf, rakam ve tire kullanın
            </p>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori *
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Alt Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alt Kategori
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Örn: anime-figurleri"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            />
          </div>

          {/* Fiyat ve Stok */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat (₺) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok Miktarı
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Açıklaması
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              placeholder="Ürün hakkında detaylı bilgi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Görsel Yükleme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Görseli *
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, WebP formatları desteklenir. Max 5MB.
            </p>
          </div>

          {/* Hata/Success Mesajları */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">Ürün başarıyla oluşturuldu!</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Oluşturuluyor...
              </div>
            ) : (
              'Ürünü Oluştur'
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
