// "use client";

// import { useState } from "react";
// import {  useRouter } from "next/navigation";
// import { DashboardLayout } from "@/components/layout/DashboardLayout";
// import {
//   ArrowLeft,
//   Package,
//   Clock,
//   FileText,

//   CheckCircle,
//   XCircle,
  
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { ReturnOrder } from "@/types/returns";

// // Mock data (move to separate file in production)
// const mockReturn: ReturnOrder = {
//   id: "1",
//   orderNumber: "ORD-9241-RET",
//   customer: {
//     name: "John Doe",
//     email: "john@example.com",
//   },
//   returnReason: "Wrong size",
//   status: "pending",
//   amount: 545.0,
//   date: "2024-08-16",
//   items: [
//     {
//       id: "item-1",
//       productName: "Nike Air Max",
//       quantity: 1,
//       reason: "Size too small",
//       condition: "new",
//       refundAmount: 545.0,
//     },
//   ],
//   notes: "Customer requested express return processing",
// };

// export default function ReturnDetailPage() {
//   const router = useRouter();
  
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleAction = async (action: "approve" | "reject") => {
//     setIsProcessing(true);
//     console.log(acy)
//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     setIsProcessing(false);
//     // Handle response
//   };

//   return (
//     <DashboardLayout>
//       <div className="p-6 space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => router.back()}
//               className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5 text-gray-500" />
//             </button>
//             <div>
//               <h1 className="text-2xl font-semibold text-gray-900">
//                 Return Request {mockReturn.orderNumber}
//               </h1>
//               <p className="text-sm text-gray-500">
//                 Submitted on {new Date(mockReturn.date).toLocaleDateString()}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => handleAction("reject")}
//               disabled={isProcessing}
//               className="px-4 py-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 
//                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <span className="flex items-center gap-2">
//                 <XCircle className="w-4 h-4" />
//                 Reject Return
//               </span>
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => handleAction("approve")}
//               disabled={isProcessing}
//               className="px-4 py-2 text-white bg-primary-500 rounded-xl hover:bg-primary-600 
//                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <span className="flex items-center gap-2">
//                 <CheckCircle className="w-4 h-4" />
//                 Approve Return
//               </span>
//             </motion.button>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-3 gap-6">
//           {/* Left Column - Return Details */}
//           <div className="col-span-2 space-y-6">
//             {/* Return Items */}
//             <div className="bg-white rounded-2xl border border-gray-100">
//               <div className="p-6">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                   Return Items
//                 </h2>
//                 <div className="space-y-4">
//                   {mockReturn.items.map((item) => (
//                     <div
//                       key={item.id}
//                       className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
//                     >
//                       <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center">
//                         <Package className="w-8 h-8 text-gray-400" />
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h3 className="text-sm font-medium text-gray-900">
//                               {item.productName}
//                             </h3>
//                             <p className="text-sm text-gray-500">
//                               Quantity: {item.quantity}
//                             </p>
//                           </div>
//                           <p className="text-sm font-medium text-gray-900">
//                             ${item.refundAmount.toFixed(2)}
//                           </p>
//                         </div>
//                         <div className="mt-2 space-y-2">
//                           <div className="flex items-center gap-2 text-sm text-gray-500">
//                             <FileText className="w-4 h-4" />
//                             Reason: {item.reason}
//                           </div>
//                           <div className="flex items-center gap-2 text-sm text-gray-500">
//                             <Package className="w-4 h-4" />
//                             Condition:{" "}
//                             {item.condition.charAt(0).toUpperCase() +
//                               item.condition.slice(1)}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
//                   <div className="text-right">
//                     <p className="text-sm text-gray-500">Total Refund Amount</p>
//                     <p className="text-lg font-semibold text-gray-900">
//                       ${mockReturn.amount.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Return Timeline */}
//             <div className="bg-white rounded-2xl border border-gray-100">
//               <div className="p-6">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                   Return Timeline
//                 </h2>
//                 <ReturnTimeline />
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Customer & Status */}
//           <div className="space-y-6">
//             {/* Status Card */}
//             <div className="bg-white rounded-2xl border border-gray-100">
//               <div className="p-6">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                   Status
//                 </h2>
//                 <ReturnStatusBadge status={mockReturn.status} />

//                 <div className="mt-4 space-y-4">
//                   <div className="flex items-center gap-3 text-sm">
//                     <Clock className="w-4 h-4 text-gray-400" />
//                     <div>
//                       <p className="text-gray-500">Submitted</p>
//                       <p className="font-medium text-gray-900">
//                         {new Date(mockReturn.date).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Customer Info */}
//             <div className="bg-white rounded-2xl border border-gray-100">
//               <div className="p-6">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                   Customer Details
//                 </h2>
//                 <div className="space-y-4">
//                   <div className="text-sm">
//                     <p className="text-gray-500">Name</p>
//                     <p className="font-medium text-gray-900">
//                       {mockReturn.customer.name}
//                     </p>
//                   </div>
//                   <div className="text-sm">
//                     <p className="text-gray-500">Email</p>
//                     <p className="font-medium text-gray-900">
//                       {mockReturn.customer.email}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Notes */}
//             {mockReturn.notes && (
//               <div className="bg-white rounded-2xl border border-gray-100">
//                 <div className="p-6">
//                   <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                     Notes
//                   </h2>
//                   <div className="bg-gray-50 p-4 rounded-xl">
//                     <p className="text-sm text-gray-600">{mockReturn.notes}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// function ReturnStatusBadge({ status }: { status: ReturnOrder["status"] }) {
//   const statusStyles = {
//     pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
//     approved: "bg-green-50 text-green-700 border-green-100",
//     rejected: "bg-red-50 text-red-700 border-red-100",
//   };

//   return (
//     <span
//       className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}
//     >
//       {status.charAt(0).toUpperCase() + status.slice(1)}
//     </span>
//   );
// }

// function ReturnTimeline() {
//   const timeline = [
//     {
//       date: "2024-08-16 10:00 AM",
//       title: "Return Requested",
//       description: "Customer initiated return request",
//       icon: Package,
//     },
//     {
//       date: "2024-08-16 10:05 AM",
//       title: "Return Acknowledged",
//       description: "System processed return request",
//       icon: CheckCircle,
//     },
//     {
//       date: "2024-08-16 2:30 PM",
//       title: "Pending Review",
//       description: "Awaiting approval from store manager",
//       icon: Clock,
//     },
//   ];

//   return (
//     <div className="space-y-4">
//       {timeline.map((event, index) => (
//         <div key={index} className="flex gap-3">
//           <div className="flex-shrink-0">
//             <div className="p-2 bg-gray-50 rounded-lg">
//               <event.icon className="w-4 h-4 text-gray-400" />
//             </div>
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-900">{event.title}</p>
//             <p className="text-sm text-gray-500">{event.description}</p>
//             <p className="text-xs text-gray-400 mt-1">{event.date}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page