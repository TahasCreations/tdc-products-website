'use client';

import type { Metadata } from 'next';
import MarketingHome from '@/components/home/MarketingHome';
import CompareTray from '@/components/CompareTray';
import { useCompare } from '@/contexts/CompareContext';

export const metadata: Metadata = {
  title: 'TDC Market',
  description: 'Çok kategorili pazar yeri — TDC Market',
};

// Dinamik olsun (client component var)
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <MarketingHome />
      <CompareTrayWrapper />
    </>
  );
}

function CompareTrayWrapper() {
  const { items, removeItem, clearItems, isOpen, toggleOpen } = useCompare();
  
  return (
    <CompareTray
      items={items}
      onRemove={removeItem}
      onClear={clearItems}
      isOpen={isOpen}
      onToggle={toggleOpen}
    />
  );
}
