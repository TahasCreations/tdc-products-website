'use client';

import { useParams } from 'next/navigation';

interface CategoryPageProps {
  slug: string;
}

export default function CategoryPage({ slug }: CategoryPageProps) {
  const params = useParams();
  const categorySlug = slug || params?.slug as string;

  // Kategoriye göre farklı sayfaları render et
  switch (categorySlug) {
    case 'figur-koleksiyon':
      return <FigurKoleksiyonPage />;
    case 'moda-aksesuar':
      return <ModaAksesuarPage />;
    case 'elektronik':
      return <ElektronikPage />;
    case 'ev-yasam':
      return <EvYasamPage />;
    case 'sanat-hobi':
      return <SanatHobiPage />;
    case 'hediyelik':
      return <HediyelikPage />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Kategori Bulunamadı
            </h1>
            <p className="text-gray-600">
              Aradığınız kategori mevcut değil.
            </p>
          </div>
        </div>
      );
  }
}

// Import statements
import FigurKoleksiyonPage from './FigurKoleksiyonPage';
import ModaAksesuarPage from './ModaAksesuarPage';
import ElektronikPage from './ElektronikPage';
import EvYasamPage from './EvYasamPage';
import SanatHobiPage from './SanatHobiPage';
import HediyelikPage from './HediyelikPage';
