export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-6 space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Categories Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-xl animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Price Range Skeleton */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <div className="h-6 w-32 bg-amber-200 rounded mb-4 animate-pulse"></div>
            <div className="flex gap-3">
              <div className="flex-1 h-10 bg-white rounded-lg animate-pulse"></div>
              <div className="flex-1 h-10 bg-white rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 p-8">
          {/* Breadcrumb Skeleton */}
          <div className="h-6 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
          
          {/* Title Skeleton */}
          <div className="h-10 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-8 animate-pulse"></div>
          
          {/* Sorting Skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Image Skeleton */}
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                
                {/* Content Skeleton */}
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="h-6 w-20 bg-[#CBA135]/20 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

