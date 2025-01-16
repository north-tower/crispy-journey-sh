// components/pricing/PricingHistory/index.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowUp, ArrowDown, Filter, Search } from "lucide-react";
import { PriceChange, PriceChangeStatus } from "@/types/pricing";

interface PricingHistoryProps {
  changes: PriceChange[];
  loading: boolean;
}

export function PricingHistory({ changes = [], loading }: PricingHistoryProps) {
  const [statusFilter, setStatusFilter] = useState<PriceChangeStatus | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChanges = changes
    .filter((change) =>
      statusFilter === "all" ? true : change.status === statusFilter
    )
    .filter(
      (change) =>
        change.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        change.reason?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading) {
    return <PricingHistoryLoading />;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-50 rounded-xl">
              <Clock className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Price Changes
              </h2>
              <p className="text-sm text-gray-500">
                {filteredChanges.length} changes in total
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search changes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl 
                  focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300
                  w-60 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            <button className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {["all", "scheduled", "active", "expired"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === status
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Changes List */}
      <div className="divide-y divide-gray-100">
        <AnimatePresence initial={false} >
          {filteredChanges.length > 0 ? (
            filteredChanges.map((change) => (
              <PriceChangeItem key={change.id} change={change} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No price changes found</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface PriceChangeItemProps {
  change: PriceChange;
}

function PriceChangeItem({ change }: PriceChangeItemProps) {
  const percentage =
    ((change.newPrice - change.oldPrice) / change.oldPrice) * 100;
  const isIncrease = percentage > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isIncrease ? "bg-green-50" : "bg-red-50"
            }`}
          >
            {isIncrease ? (
              <ArrowUp className="w-4 h-4 text-green-600" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-600" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {change.productId}
            </p>
            <p className="text-sm text-gray-500">{change.reason}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              ${change.oldPrice} →
            </span>
            <span className="text-sm font-medium text-gray-900">
              ${change.newPrice}
            </span>
            <span
              className={`text-sm font-medium ${
                isIncrease ? "text-green-600" : "text-red-600"
              }`}
            >
              {isIncrease ? "+" : ""}
              {percentage.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {new Date(change.startDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function PricingHistoryLoading() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-8 w-48 bg-gray-100 rounded-lg" />
            <div className="h-8 w-32 bg-gray-100 rounded-lg" />
          </div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-100 rounded-lg" />
              <div>
                <div className="h-4 w-32 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="h-8 w-24 bg-gray-100 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
