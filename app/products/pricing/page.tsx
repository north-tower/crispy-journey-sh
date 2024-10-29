"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PricingHeader } from "@/components/products/pricing/PricingHeader";
import { PricingHistory } from "@/components/products/pricing/PricingHistory";
import { PricingOverview } from "@/components/products/pricing/PricingOverview";
import { PricingSuggestions } from "@/components/products/pricing/PricingSuggestions";
import { usePricingData } from "@/lib/hooks/usePricingData";
import { Suspense, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
// Memoized components to prevent unnecessary re-renders
const MemoizedPricingHeader = memo(PricingHeader);
const MemoizedPricingOverview = memo(PricingOverview);
const MemoizedPricingHistory = memo(PricingHistory);
const MemoizedPricingSuggestions = memo(PricingSuggestions);

// Loading states components
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

// Error state component
const ErrorState = ({ error }: { error: Error }) => (
  <Alert variant="destructive" className="mb-6">
    <AlertDescription>
      Failed to load pricing data: {error.message}
    </AlertDescription>
  </Alert>
);

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Main content component
const PricingContent = memo(
  ({
    metrics,
    changes,
    suggestions,
    loading,
  }: {
    metrics: any;
    changes: any;
    suggestions: any;
    loading: boolean;
  }) => {
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
              <MemoizedPricingSuggestions
                suggestions={suggestions}
                loading={loading}
              />
            </motion.div>
          </div>
        </div>
      </AnimatePresence>
    );
  }
);

PricingContent.displayName = "PricingContent";

// Main page component
export default function PricingPage() {
  const { metrics, changes, suggestions, loading, error } = usePricingData();

  return (
    <DashboardLayout>
      <div className="p-6">
        <Suspense fallback={<LoadingState />}>
          {error ? (
            <ErrorState error={error} />
          ) : (
            <PricingContent
              metrics={metrics}
              changes={changes}
              suggestions={suggestions}
              loading={loading}
            />
          )}
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
