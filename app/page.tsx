// app/page.tsx
"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";
import { TimeRange } from "@/types/dashboard";
import { useState, useCallback } from "react";

export default function Home() {
  const { stats, loading, error, refreshStats, filterByTimeRange } = useDashboardStats();
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly");
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);

  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    console.log('handleTimeRangeChange called with:', range);
    setTimeRange(range);
    setShowTimeRangeDropdown(false);
    filterByTimeRange(range);
  }, [filterByTimeRange]);
  

  const toggleTimeRangeDropdown = useCallback(() => {
    setShowTimeRangeDropdown(prev => !prev);
  }, []);

  console.log('Home component rendered');


  return (
   <DashboardLayout>

<div className="space-y-6">
        <DashboardHeader 
          stats={stats}
          loading={loading}
          timeRange={timeRange}
          showTimeRangeDropdown={showTimeRangeDropdown}
          onTimeRangeChange={handleTimeRangeChange}
          onTimeRangeToggle={toggleTimeRangeDropdown}
          onRefresh={refreshStats}
        />
        
        <DashboardContent 
          stats={stats}
          loading={loading}
          error={error}
          onRetry={refreshStats}
        />
      </div>
   </DashboardLayout>
  
    
  );
}