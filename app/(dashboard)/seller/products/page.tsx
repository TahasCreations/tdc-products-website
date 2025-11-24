import SellerProductsContent from "@/components/partner/seller/SellerProductsContent";
import { requireSeller } from "@/lib/guards";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseStringArray(value?: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function parsePrimaryImage(value?: string | null): string | null {
  const images = parseStringArray(value);
  return images[0] ?? null;
}

export default async function SellerProductsPage() {
  const user = await requireSeller();

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: user.id },
  });

  if (!sellerProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Satıcı Profili Bulunamadı</h1>
          <p className="text-gray-600">Lütfen admin ile iletişime geçin.</p>
        </div>
      </div>
    );
  }

  const productsRaw = await prisma.product.findMany({
    where: { sellerId: sellerProfile.id },
    orderBy: { createdAt: "desc" },
  });

  const products = productsRaw.map((product) => ({
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description ?? "",
    category: product.category,
    subcategory: product.subcategory,
    productType: product.productType,
    price: product.price,
    listPrice: product.listPrice,
    stock: product.stock,
    isActive: product.isActive,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    image: parsePrimaryImage(product.images),
    images: parseStringArray(product.images),
    tags: parseStringArray(product.tags),
  }));

  return (
    <SellerProductsContent
      initialProducts={products}
      storeName={sellerProfile.storeName ?? user.name ?? "Mağaza"}
    />
  );
}

