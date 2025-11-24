"use client";

import { useMemo, useState, useTransition } from "react";
import { motion } from "framer-motion";

import ProductCreateForm, {
  ProductFormData,
} from "@/components/products/ProductCreateForm";

type SellerProduct = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string | null;
  productType: string;
  price: number;
  listPrice: number | null;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  image: string | null;
  images: string[];
  tags: string[];
};

interface SellerProductsContentProps {
  initialProducts: SellerProduct[];
  storeName: string;
}

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
});

export default function SellerProductsContent({ initialProducts, storeName }: SellerProductsContentProps) {
  const [products, setProducts] = useState<SellerProduct[]>(initialProducts);
  const [isPending, startTransition] = useTransition();
  const [formLoading, setFormLoading] = useState(false);

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((product) => product.isActive).length;
    const lowStock = products.filter((product) => product.stock <= 5 && product.stock >= 0).length;
    const outOfStock = products.filter((product) => product.stock === 0).length;
    return { total, active, lowStock, outOfStock };
  }, [products]);

  const handleCreate = async (data: ProductFormData) => {
    setFormLoading(true);
    try {
      const response = await fetch("/api/seller/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          productType: "PHYSICAL",
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Ürün kaydedilemedi.");
      }

      const json = await response.json();
      setProducts((prev) => [json.data, ...prev]);
    } catch (error: any) {
      console.error("Product create error:", error);
      window.alert(error.message || "Ürün kaydedilemedi.");
    } finally {
      setFormLoading(false);
    }
  };

  const toggleActive = (product: SellerProduct) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/seller/products/${product.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !product.isActive }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error || "Ürün güncellenemedi.");
        }

        const json = await response.json();
        setProducts((prev) => prev.map((item) => (item.id === product.id ? json.data : item)));
      } catch (error: any) {
        console.error("Product toggle error:", error);
        window.alert(error.message || "Ürün durumu değiştirilemedi.");
      }
    });
  };

  const updateStock = (product: SellerProduct) => {
    const value = window.prompt("Yeni stok miktarı:", product.stock.toString());
    if (value === null) return;

    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < -1) {
      window.alert("Geçerli bir stok değeri girin (-1 veya daha büyük).");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/seller/products/${product.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stock: parsed }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error || "Stok güncellenemedi.");
        }

        const json = await response.json();
        setProducts((prev) => prev.map((item) => (item.id === product.id ? json.data : item)));
      } catch (error: any) {
        console.error("Product stock update error:", error);
        window.alert(error.message || "Stok güncellenemedi.");
      }
    });
  };

  const removeProduct = (product: SellerProduct) => {
    const confirmed = window.confirm(`${product.title} ürününü pasif hale getirmek istiyor musunuz?`);
    if (!confirmed) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/seller/products/${product.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error || "Ürün silinemedi.");
        }

        setProducts((prev) => prev.filter((item) => item.id !== product.id));
      } catch (error: any) {
        console.error("Product delete error:", error);
        window.alert(error.message || "Ürün silinemedi.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ürün Yönetimi</h1>
          <p className="text-gray-600">{storeName} mağazanızın ürünlerini yönetin</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Toplam Ürün" value={stats.total} color="text-gray-900" />
          <StatCard title="Aktif" value={stats.active} color="text-green-600" />
          <StatCard title="Düşük Stok" value={stats.lowStock} color="text-orange-600" />
          <StatCard title="Stokta Yok" value={stats.outOfStock} color="text-red-600" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Yeni Ürün Ekle</h2>
              <p className="text-sm text-gray-500">Ürün detaylarını doldurun ve mağazanıza ekleyin.</p>
            </div>
            <ProductCreateForm onSubmit={handleCreate} loading={formLoading} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm"
        >
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Ürünler</h2>
            <span className="text-sm text-gray-500">{products.length} sonuç</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Ürün</Th>
                  <Th>Kategori</Th>
                  <Th align="right">Fiyat</Th>
                  <Th align="center">Stok</Th>
                  <Th align="center">Durum</Th>
                  <Th align="right">İşlemler</Th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <Td>
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                            IMG
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{product.title}</p>
                          <p className="text-xs text-gray-500">{product.slug}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div className="text-sm text-gray-700">
                        {product.category}
                        {product.subcategory && <span className="text-gray-400"> / {product.subcategory}</span>}
                      </div>
                      {product.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {product.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                              {tag}
                            </span>
                          ))}
                          {product.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{product.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </Td>
                    <Td align="right">
                      <div className="text-sm font-semibold text-gray-900">
                        {currencyFormatter.format(product.price)}
                      </div>
                      {product.listPrice && product.listPrice > product.price && (
                        <div className="text-xs text-gray-500 line-through">
                          {currencyFormatter.format(product.listPrice)}
                        </div>
                      )}
                    </Td>
                    <Td align="center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock === 0
                            ? "bg-red-100 text-red-700"
                            : product.stock <= 5 && product.stock >= 0
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.stock === -1 ? "Sınırsız" : `${product.stock} adet`}
                      </span>
                    </Td>
                    <Td align="center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          product.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {product.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </Td>
                    <Td align="right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
                          disabled={isPending}
                          onClick={() => toggleActive(product)}
                        >
                          {product.isActive ? "Pasifleştir" : "Aktifleştir"}
                        </button>
                        <button
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                          disabled={isPending}
                          onClick={() => updateStock(product)}
                        >
                          Stok
                        </button>
                        <button
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                          disabled={isPending}
                          onClick={() => removeProduct(product)}
                        >
                          Sil
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      Henüz ürün bulunmuyor. İlk ürününüzü ekleyerek satışa başlayın.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </motion.div>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" | "center" }) {
  const alignClass =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return (
    <th
      scope="col"
      className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${alignClass}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
}) {
  const alignClass =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return (
    <td className={`px-6 py-4 whitespace-nowrap ${alignClass}`}>
      <div className="text-sm text-gray-700">{children}</div>
    </td>
  );
}




