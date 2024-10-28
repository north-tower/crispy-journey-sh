"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PricingHeader } from "@/components/products/pricing/PricingHeader";
import { PricingHistory } from "@/components/products/pricing/PricingHistory";
import { PricingOverview } from "@/components/products/pricing/PricingOverview";
import { PricingSuggestions } from "@/components/products/pricing/PricingSuggestions";
import { usePricingData } from "@/lib/hooks/usePricingData";
import { motion } from "framer-motion";

export default function PricingPage() {
  const { metrics, changes, suggestions, loading, error } = usePricingData();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <PricingHeader metrics={metrics} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PricingOverview metrics={metrics} loading={loading} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <PricingHistory changes={changes} loading={loading} />
            </motion.div>
          </div>

          {/* Sidebar - Right Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PricingSuggestions suggestions={suggestions} loading={loading} />
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
