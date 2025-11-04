import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  BarChart3, 
  Search,
  Plus,
  ArrowRight
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  };
  className?: string;
}

const defaultIcons = {
  products: <Package className="h-12 w-12 text-muted-foreground" />,
  orders: <ShoppingCart className="h-12 w-12 text-muted-foreground" />,
  users: <Users className="h-12 w-12 text-muted-foreground" />,
  blogs: <FileText className="h-12 w-12 text-muted-foreground" />,
  reports: <BarChart3 className="h-12 w-12 text-muted-foreground" />,
  search: <Search className="h-12 w-12 text-muted-foreground" />,
  default: <Package className="h-12 w-12 text-muted-foreground" />
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = ''
}: EmptyStateProps) {
  const defaultIcon = icon || defaultIcons.default;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-6">
        {defaultIcon}
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        {description}
      </p>
      
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <>
              {action.href ? (
                <Button asChild variant={action.variant || 'default'}>
                  <Link href={action.href} className="inline-flex items-center gap-2">
                    {action.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button 
                  onClick={action.onClick}
                  variant={action.variant || 'default'}
                  className="inline-flex items-center gap-2"
                >
                  {action.label}
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
          
          {secondaryAction && (
            <>
              {secondaryAction.href ? (
                <Button asChild variant={secondaryAction.variant || 'outline'}>
                  <Link href={secondaryAction.href}>
                    {secondaryAction.label}
                  </Link>
                </Button>
              ) : (
                <Button 
                  onClick={secondaryAction.onClick}
                  variant={secondaryAction.variant || 'outline'}
                >
                  {secondaryAction.label}
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Önceden tanımlanmış empty state'ler
export function EmptyProductsState() {
  return (
    <EmptyState
      icon={defaultIcons.products}
      title="Henüz ürün yok"
      description="Satıcılarımız yakında ürünlerini ekleyecek. Güncel kalmak için bizi takip edin!"
      action={{
        label: "Kategorileri Keşfet",
        href: "/categories",
        variant: "default"
      }}
      secondaryAction={{
        label: "Satıcı Ol",
        href: "/partner/satici-ol",
        variant: "outline"
      }}
    />
  );
}

export function EmptyOrdersState() {
  return (
    <EmptyState
      icon={defaultIcons.orders}
      title="Henüz sipariş yok"
      description="Müşterileriniz henüz sipariş vermemiş. Ürünlerinizi tanıtın ve satışlarınızı artırın."
      action={{
        label: "Ürünleri görüntüle",
        href: "/admin/products",
        variant: "default"
      }}
      secondaryAction={{
        label: "Analitik",
        href: "/admin/analytics",
        variant: "outline"
      }}
    />
  );
}

export function EmptyUsersState() {
  return (
    <EmptyState
      icon={defaultIcons.users}
      title="Henüz kullanıcı yok"
      description="Henüz kayıtlı kullanıcınız bulunmuyor. Mağazanızı tanıtarak kullanıcı çekmeye başlayın."
      action={{
        label: "Mağaza ayarları",
        href: "/admin/settings",
        variant: "default"
      }}
    />
  );
}

export function EmptyBlogsState() {
  return (
    <EmptyState
      icon={defaultIcons.blogs}
      title="Henüz blog yazısı yok"
      description="SEO ve içerik pazarlama için blog yazıları oluşturun. İlk yazınızı yayınlayın."
      action={{
        label: "İlk yazıyı oluştur",
        href: "/admin/blog/new",
        variant: "default"
      }}
      secondaryAction={{
        label: "Blog yönetimi",
        href: "/admin/blog",
        variant: "outline"
      }}
    />
  );
}

export function EmptyReportsState() {
  return (
    <EmptyState
      icon={defaultIcons.reports}
      title="Henüz rapor verisi yok"
      description="Satışlarınız ve analitik verileriniz henüz mevcut değil. İlk siparişlerinizi bekleyin."
      action={{
        label: "Analitik",
        href: "/admin/analytics",
        variant: "default"
      }}
    />
  );
}

export function EmptySearchState({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={defaultIcons.search}
      title="Sonuç bulunamadı"
      description={query ? `"${query}" araması için sonuç bulunamadı. Farklı anahtar kelimeler deneyin.` : "Arama sonucu bulunamadı."}
      action={{
        label: "Tüm ürünleri görüntüle",
        href: "/products",
        variant: "default"
      }}
      secondaryAction={{
        label: "Kategoriler",
        href: "/categories",
        variant: "outline"
      }}
    />
  );
}

export function EmptyCartState() {
  return (
    <EmptyState
      icon={<ShoppingCart className="h-12 w-12 text-muted-foreground" />}
      title="Sepetiniz boş"
      description="Sepetinize henüz ürün eklenmemiş. Alışverişe başlamak için ürünleri keşfedin."
      action={{
        label: "Alışverişe başla",
        href: "/products",
        variant: "default"
      }}
    />
  );
}

export function EmptyWishlistState() {
  return (
    <EmptyState
      icon={<Package className="h-12 w-12 text-muted-foreground" />}
      title="Favori listeniz boş"
      description="Henüz favori ürününüz bulunmuyor. Beğendiğiniz ürünleri favorilere ekleyin."
      action={{
        label: "Ürünleri keşfet",
        href: "/products",
        variant: "default"
      }}
    />
  );
}
