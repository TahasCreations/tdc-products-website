// Force dynamic rendering for all pages in this group
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function DynamicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

