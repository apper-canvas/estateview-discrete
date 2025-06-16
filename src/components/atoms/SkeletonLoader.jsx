const SkeletonLoader = ({ count = 1, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="bg-surface rounded-lg shadow-sm border border-surface-200 overflow-hidden">
          {/* Image Skeleton */}
          <div className="h-48 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 animate-pulse" />
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Price */}
            <div className="h-8 bg-surface-200 rounded w-1/3 animate-pulse" />
            
            {/* Title */}
            <div className="h-6 bg-surface-200 rounded w-3/4 animate-pulse" />
            
            {/* Address */}
            <div className="h-4 bg-surface-200 rounded w-2/3 animate-pulse" />
            
            {/* Stats */}
            <div className="flex justify-between pt-3 border-t border-surface-200">
              <div className="flex space-x-4">
                <div className="h-4 bg-surface-200 rounded w-12 animate-pulse" />
                <div className="h-4 bg-surface-200 rounded w-12 animate-pulse" />
              </div>
              <div className="h-4 bg-surface-200 rounded w-16 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;