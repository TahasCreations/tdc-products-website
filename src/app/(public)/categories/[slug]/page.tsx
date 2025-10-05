import CategoryPage from '@/components/categories/CategoryPage';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function Category({ params }: CategoryPageProps) {
  return <CategoryPage slug={params.slug} />;
}
