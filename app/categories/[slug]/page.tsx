import { notFound } from 'next/navigation';
import FigurKoleksiyonPage from '@/components/categories/FigurKoleksiyonPage';
import ModaAksesuarPage from '@/components/categories/ModaAksesuarPage';
import ElektronikPage from '@/components/categories/ElektronikPage';
import EvYasamPage from '@/components/categories/EvYasamPage';
import SanatHobiPage from '@/components/categories/SanatHobiPage';
import HediyelikPage from '@/components/categories/HediyelikPage';

const categoryComponents = {
  'figur-koleksiyon': FigurKoleksiyonPage,
  'moda-aksesuar': ModaAksesuarPage,
  'elektronik': ElektronikPage,
  'ev-yasam': EvYasamPage,
  'sanat-hobi': SanatHobiPage,
  'hediyelik': HediyelikPage
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const CategoryComponent = categoryComponents[params.slug as keyof typeof categoryComponents];
  
  if (!CategoryComponent) {
    notFound();
  }

  return <CategoryComponent />;
}