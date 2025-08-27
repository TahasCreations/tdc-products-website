export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border p-4">
            <div className="h-48 bg-gray-200 rounded-xl mb-4" />
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}


