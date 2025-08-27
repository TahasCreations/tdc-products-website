export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-96 bg-gray-200 rounded-xl" />
        <div>
          <div className="h-6 w-24 bg-gray-200 rounded mb-3" />
          <div className="h-8 w-1/2 bg-gray-200 rounded mb-4" />
          <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}


