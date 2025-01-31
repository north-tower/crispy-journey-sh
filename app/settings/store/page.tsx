"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StoreInfo } from "@/components/settings/store/StoreInfo";
import { StoreAddress } from "@/components/settings/store/StoreAddress";
import { StorePayment } from "@/components/settings/store/StorePayment";
import { StoreShipping } from "@/components/settings/store/StoreShipping";
import { motion } from "framer-motion";
import { Store, Building2, CreditCard, Truck } from "lucide-react";
import { debounce } from "lodash";
import axios from "axios";
import { API_BASE_URL } from "@/services/products";

type TabType = "general" | "address" | "payment" | "shipping";

export default function StoreSettings() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch seller data from the API
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/sellers/email/33@gmail.com`);
        setStoreData(response.data);
      } catch (error) {
        console.error("Failed to fetch store data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  // Debounced tab change
  const handleTabChange = useCallback(
    debounce((newTab: TabType) => setActiveTab(newTab), 200),
    []
  );

  // Memoized tabs with icons and components
  const tabs = useMemo(
    () => [
      { id: "general", label: "General", icon: Store, component: StoreInfo },
      {
        id: "address",
        label: "Address",
        icon: Building2,
        component: StoreAddress,
      },
      {
        id: "payment",
        label: "Payment",
        icon: CreditCard,
        component: StorePayment,
      },
      {
        id: "shipping",
        label: "Shipping",
        icon: Truck,
        component: StoreShipping,
      },
    ],
    []
  );

  // Determine the active component based on the selected tab
  const ActiveComponent = useMemo(() => {
    return tabs.find((tab) => tab.id === activeTab)?.component || StoreInfo;
  }, [activeTab, tabs]);

  if (loading) {
    return <div>Loading...</div>; // Simple loader while fetching data
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 bg-primary-50 rounded-xl">
            <Store className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Store Settings
            </h1>
            <p className="text-sm text-gray-500">
              Manage your store preferences and configurations
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
                    whileTap={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                    onClick={() => handleTabChange(tab.id as TabType)}
                    className={`w-full flex items-center gap-3 p-4 text-left transition-colors relative ${
                      isActive
                        ? "text-primary-600 bg-primary-50"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-primary-500" : "text-gray-400"
                      }`}
                    />
                    <span className="font-medium">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveComponent storeData={storeData} />
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
