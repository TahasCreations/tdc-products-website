import CategoryPage from '@/components/categories/CategoryPage';

export default function KCategoryPage({ params }: { params: { slug: string } }) {
  return <CategoryPage slug={params.slug} />;
}


