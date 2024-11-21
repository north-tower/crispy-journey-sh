// components/dashboard/AnalyticsGridSkeleton.tsx
export const AnalyticsGridSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-[400px] bg-gray-50 rounded-2xl animate-pulse" />
    ))}
  </div>
);
