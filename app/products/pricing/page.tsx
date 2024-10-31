"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PricingHeader } from "@/components/products/pricing/PricingHeader";
import { PricingHistory } from "@/components/products/pricing/PricingHistory";
import { PricingOverview } from "@/components/products/pricing/PricingOverview";
import { PricingSuggestions } from "@/components/products/pricing/PricingSuggestions";
import { usePricingData } from "@/lib/hooks/usePricingData";
import { Suspense, memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Sidebar from "@/components/products/pricing/SideBar";
import { products } from "@/types/products";
import DiscountedList from "@/components/products/pricing/DiscountedList";

// Memoized components
const MemoizedPricingHeader = memo(PricingHeader);
const MemoizedPricingOverview = memo(PricingOverview);
const MemoizedPricingHistory = memo(PricingHistory);
const MemoizedPricingSuggestions = memo(PricingSuggestions);

const LoadingState = () => (
  <div className="space-y-6">
    <Skeleton className="h-32 w-full" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
      <Skeleton className="h-[600px] w-full" />
    </div>
  </div>
);

const ErrorState = ({ error }: { error: Error }) => (
  <Alert variant="destructive" className="mb-6">
    <AlertDescription>
      Failed to load pricing data: {error.message}
    </AlertDescription>
  </Alert>
);

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Pricing Content component
const PricingContent = memo(
  ({ metrics, changes, suggestions, loading }: { metrics: any; changes: any; suggestions: any; loading: boolean }) => {
    if (loading) return <LoadingState />;

    return (
      <AnimatePresence mode="wait">
        <div className="space-y-6">
          <MemoizedPricingHeader metrics={metrics} loading={loading} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <motion.div {...fadeInUp} transition={{ delay: 0.1 }} layout>
                <MemoizedPricingOverview metrics={metrics} loading={loading} />
              </motion.div>
              <motion.div {...fadeInUp} transition={{ delay: 0.2 }} layout>
                <MemoizedPricingHistory changes={changes} loading={loading} />
              </motion.div>
            </div>
            <motion.div {...fadeInUp} transition={{ delay: 0.3 }} layout>
              <MemoizedPricingSuggestions suggestions={suggestions} loading={loading} />
            </motion.div>
          </div>
        </div>
      </AnimatePresence>
    );
  }
);

PricingContent.displayName = "PricingContent";



// Main Page Component
export default function PricingPage() {
  const { metrics, changes, suggestions, loading, error } = usePricingData();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Sidebar collapsed by default
  const [selectedOption, setSelectedOption] = useState("Home"); // Default view set to "Home"


  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row p-4 lg:p-0 space-x-1">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
        />

        {/* Main Content Area */}
        <div className={`flex-1 transition-all ${isSidebarCollapsed ? "md:ml-16" : "ml-64"} lg:ml-0`}>
          <Suspense fallback={<LoadingState />}>
            {error ? (
              <ErrorState error={error} />
            ) : selectedOption === "Home" ? (
              <PricingContent metrics={metrics} changes={changes} suggestions={suggestions} loading={loading} />
            ) : (
              <DiscountedList items={products} />
            )}
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  );
}
