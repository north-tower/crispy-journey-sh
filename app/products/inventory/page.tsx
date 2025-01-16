// "use client";

// import { useState, useCallback, memo, Suspense, useEffect } from "react";
// import { DashboardLayout } from "@/components/layout/DashboardLayout";
// import { motion } from "framer-motion";
// import {
//   AlertCircle,
//   BarChart2,
//   Box,
//   LucideIcon,
//   PackageOpen,
//   RefreshCcw,
//   Settings,
//   TrendingDown,
//   TrendingUp,
//   Truck,
// } from "lucide-react";
// import dynamic from "next/dynamic";

// // Dynamically import heavy components
// const InventoryOverview = dynamic(
//   () =>
//     import("@/components/products/inventory/InventoryOverview").then(
//       (mod) => mod.InventoryOverview
//     ),
//   { loading: () => <LoadingCard height="400px" /> }
// );

// const LowStockAlerts = dynamic(
//   () =>
//     import("@/components/products/inventory/LowStockAlerts").then(
//       (mod) => mod.LowStockAlerts
//     ),
//   { loading: () => <LoadingCard height="300px" /> }
// );


// // Loading placeholder component
// const LoadingCard = memo(({ height }: { height: string }) => (
//   <div className="animate-pulse bg-gray-100 rounded-2xl" style={{ height }} />
// ));

// // Memoized stat card component
// const InventoryStatCard = memo(function InventoryStatCard({
//   title,
//   value,
//   change,
//   icon: Icon,
//   color,
// }: InventoryStatCardProps) {
//   const colorVariants = {
//     primary: "bg-primary-50 text-primary-600",
//     warning: "bg-yellow-50 text-yellow-600",
//     success: "bg-green-50 text-green-600",
//     info: "bg-blue-50 text-blue-600",
//   };

//   return (
//     <motion.div
//       whileHover={{ y: -2 }}
//       transition={{ duration: 0.2 }}
//       className="p-6 bg-white rounded-2xl border border-gray-100 space-y-4"
//     >
//       <div className="flex items-center justify-between">
//         <div className={`p-2 rounded-xl ${colorVariants[color]}`}>
//           <Icon className="w-5 h-5" />
//         </div>
//         <div
//           className={`flex items-center gap-1 text-sm ${
//             change > 0 ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {change > 0 ? (
//             <TrendingUp className="w-4 h-4" />
//           ) : (
//             <TrendingDown className="w-4 h-4" />
//           )}
//           {Math.abs(change)}%
//         </div>
//       </div>

//       <div>
//         <h3 className="text-sm text-gray-500">{title}</h3>
//         <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
//       </div>
//     </motion.div>
//   );
// });

// // Header component
// const Header = memo(function Header({
//   onRefresh,
//   isRefreshing,
// }: {
//   onRefresh: () => void;
//   isRefreshing: boolean;
// }) {
//   return (
//     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//       <div className="space-y-1">
//         <div className="flex items-center gap-2">
//           <h1 className="text-2xl font-semibold text-gray-900">
//             Inventory Management
//           </h1>
//           <span className="px-2.5 py-0.5 text-xs font-medium bg-primary-50 text-primary-600 rounded-full">
//             Live Updates
//           </span>
//         </div>
//         <p className="text-sm text-gray-500">
//           Track and manage your product inventory levels
//         </p>
//       </div>

//       <div className="flex items-center gap-3">
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={onRefresh}
//           className={`p-2 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 ${
//             isRefreshing ? "bg-gray-50" : "bg-white"
//           }`}
//         >
//           <RefreshCcw
//             className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
//           />
//         </motion.button>

//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
//         >
//           <Settings className="w-4 h-4" />
//         </motion.button>

//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
//         >
//           <PackageOpen className="w-4 h-4" />
//           <span className="text-sm font-medium">Update Stock</span>
//         </motion.button>
//       </div>
//     </div>
//   );
// });







// // Main page component
// export default function InventoryPage() {
//   const [selectedTimeframe, ] = useState<
//     "day" | "week" | "month"
//   >("week");
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [stats, setStats] = useState({
//     current: {
//       totalStockValue: "0.00",
//       lowStockItems: "0",
//       incomingStock: "0",
//       stockTurnover: "0.0",
//     },
//     change: {
//       totalStockValue: 0,
//       lowStockItems: 0,
//       incomingStock: 0,
//       stockTurnover: 0,
//     },
//   });
//   const [, setLoading] = useState(true);
//   const [, setError] = useState<string | null>(null);
//   useEffect(() => {
//     const fetchStats = async () => {
//       setLoading(true);
//       setError(null);
  
//       try {
//         const response = await fetch(
//           "http://localhost:8900/api/products/overview/quick-stats?timeframe=month"
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch stats");
//         }
//         const data = await response.json();
//         setStats(data);
//       } catch (err) {
//         setError(err.message || "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchStats();
//   }, []); // Empty dependency array ensures this runs only once on component mount
  

//   const handleRefresh = useCallback(async () => {
//     setIsRefreshing(true);
//     try {
//       // Simulate refresh with artificial delay
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     } finally {
//       setIsRefreshing(false);
//     }
//   }, []);

//   // Quick stats grid
// const QuickStats = memo(function QuickStats() {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//      <InventoryStatCard
//         title="Total Stock Value"
//         value={`$${Number(stats.current.totalStockValue).toLocaleString()}`}
//         change={stats.change.totalStockValue}
//         icon={Box}
//         color="primary"
//       />
//       <InventoryStatCard
//         title="Low Stock Items"
//         value={stats.current.lowStockItems}
//         change={stats.change.lowStockItems}
//         icon={AlertCircle}
//         color="warning"
//       />
//       <InventoryStatCard
//         title="Incoming Stock"
//         value={stats.current.incomingStock}
//         change={stats.change.incomingStock}
//         icon={Truck}
//         color="success"
//       />
//       <InventoryStatCard
//         title="Stock Turnover"
//         value={`${1.2}x`}
//         change={stats.change.stockTurnover}
//         icon={BarChart2}
//         color="info"
//       />
//     </div>
//   );
// });

//   return (
//     <DashboardLayout>
//       <div className="p-6 space-y-6">
//         <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />

//         <Suspense fallback={<QuickStatsLoading />}>
//           <QuickStats />
//         </Suspense>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column */}
//           <div className="lg:col-span-2 space-y-6">
//             <Suspense fallback={<LoadingCard height="400px" />}>
//               <InventoryOverview timeframe={selectedTimeframe} />
//             </Suspense>
//             {/* <Suspense fallback={<LoadingCard height="400px" />}>
//               <StockHistory />
//             </Suspense> */}
//           </div>

//           {/* Right Column */}
//           <div className="space-y-6">
//             <Suspense fallback={<LoadingCard height="300px" />}>
//               <LowStockAlerts />
//             </Suspense>
//             {/* <Suspense fallback={<LoadingCard height="300px" />}>
//               <RestockSuggestions />
//             </Suspense> */}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// const QuickStatsLoading = () => (
//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//     {[...Array(4)].map((_, i) => (
//       <div key={i} className="h-32 animate-pulse bg-gray-100 rounded-2xl" />
//     ))}
//   </div>
// );

// interface InventoryStatCardProps {
//   title: string;
//   value: string;
//   change: number;
//   icon: LucideIcon;
//   color: "primary" | "warning" | "success" | "info";
// }

import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page