// components/pricing/PricingSuggestions/index.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  X,
} from "lucide-react";
import { PricingSuggestion } from "@/types/pricing";

interface PricingSuggestionsProps {
  suggestions: PricingSuggestion[];
  loading: boolean;
}

export function PricingSuggestions({
  suggestions = [],
  loading,
}: PricingSuggestionsProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>(
    []
  );

  const activeSuggestions = suggestions.filter(
    (suggestion) => !dismissedSuggestions.includes(suggestion.id)
  );

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedSuggestions([...dismissedSuggestions, id]);
  };

  if (loading) {
    return <PricingSuggestionsLoading />;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-primary-50 rounded-xl">
            <Lightbulb className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Price Suggestions
            </h2>
            <p className="text-sm text-gray-500">
              {activeSuggestions.length} suggestions available
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        <AnimatePresence initial={false}>
          {activeSuggestions.length > 0 ? (
            activeSuggestions.map((suggestion) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  onClick={() =>
                    setSelectedSuggestion(
                      selectedSuggestion === suggestion.id
                        ? null
                        : suggestion.id
                    )
                  }
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {/* Main Content */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {suggestion.productName}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityStyle(
                              suggestion.priority
                            )}`}
                          >
                            {suggestion.priority}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleDismiss(suggestion.id, e)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">
                          Current: ${suggestion.currentPrice}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-primary-600">
                          Suggested: ${suggestion.suggestedPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {selectedSuggestion === suggestion.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                          <div className="flex items-center gap-2">
                            {suggestion.potentialImpact > 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm text-gray-600">
                              Potential Impact:
                              <span
                                className={`ml-1 font-medium ${
                                  suggestion.potentialImpact > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {suggestion.potentialImpact > 0 ? "+" : ""}
                                {suggestion.potentialImpact}%
                              </span>
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {suggestion.reason}
                          </p>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
                            >
                              Apply Change
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                            >
                              Review
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No pricing suggestions available</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PricingSuggestionsLoading() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-xl" />
          <div>
            <div className="h-5 w-32 bg-gray-100 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse space-y-2">
            <div className="h-4 w-48 bg-gray-100 rounded" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-50 text-red-600";
    case "medium":
      return "bg-yellow-50 text-yellow-600";
    case "low":
      return "bg-green-50 text-green-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
}
