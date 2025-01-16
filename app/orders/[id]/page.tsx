// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { DashboardLayout } from "@/components/layout/DashboardLayout";
// import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, Flag } from "lucide-react";
// import { motion } from "framer-motion";
// import axios from "axios";

// interface OrderItem {
//   id: string;
//   quantity: number;
//   price: string;
//   productName: string;
// }

// interface Address {
//   id: string;
//   addressLine1: string;
//   addressLine2: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
// }

// export interface Order {
//   id: string;
//   status: "COMPLETED" | "PENDING" | "CANCELED"; // Define an enum for statuses if desired
//   total: string;
//   createdAt: string;
//   updatedAt: string;
//   subtotal: string;
//   tax: string;
//   paymentMethod: "CASH" | "CARD" | "BANK_TRANSFER"; // Expand as needed
//   paymentStatus: "PENDING" | "PAID" | "FAILED"; // Define an enum for payment statuses if desired
//   shippingFee: string;
//   customerName: string;
//   items: OrderItem[];
//   transactions: PaymentTransaction[]; // Use PaymentTransaction entity here
//   address: Address;
// }

// // Define the interface for PaymentTransaction
// export interface PaymentTransaction {
//   id: string;
//   orderId: string;
//   paymentMethodId?: string;
//   amount: number;
//   currency?: string;
//   status: string;
//   provider: string;
//   providerTransactionId?: string;
//   providerResponse?: {
//     raw?: any;
//     code?: string;
//     message?: string;
//   };
//   metadata?: {
//     ipAddress?: string;
//     userAgent?: string;
//     location?: string;
//     deviceId?: string;
//   };
//   failureReason?: string;
//   processedAt?: Date;
//   refundReference?: string;
//   mpesaDetails?: {
//     phoneNumber?: string;
//     accountReference?: string;
//     transactionDesc?: string;
//     merchantRequestId?: string;
//     checkoutRequestId?: string;
//     responseCode?: string;
//     responseDescription?: string;
//     customerMessage?: string;
//   };
//   createdAt: Date;
//   updatedAt: Date;
// }


// export default function OrderDetailPage() {
//   const router = useRouter();
//   const params = useParams();
//   const [order, setOrder] = useState<Order | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
  

//   const updateStatus = async (nextStatus: string) => {
//     setIsProcessing(true);
//     try {
//       await axios.patch(`http://localhost:8900/api/orders/${params.id}`, { status: nextStatus });
//       setCurrentStatus(nextStatus); // Update timeline dynamically
//     } catch (error) {
//       console.error("Error updating status", error);
//     } finally {
//       setIsProcessing(false);
//     }
//   };
  

  
//   // Fetch order details
//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(`http://localhost:8900/api/orders/${params.id}`);
//         setOrder(response.data);
//         setCurrentStatus(response.data.status); // Sync `currentStatus` with fetched order
//         setError(null);
//       } catch (err) {
//         setError("Failed to fetch order details. Please try again.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     fetchOrder();
//   }, [params.id]);
  


//   const [currentStatus, setCurrentStatus] = useState(order?.status);


//   const handleAction = async (action: "cancel" | "markShipped") => {
//     setIsProcessing(true);
//     try {
//       await axios.patch(`http://localhost:8900/api/orders/${params.id}`, {
//         status: action === "cancel" ? "canceled" : "shipped",
//       });
//       setOrder((prevOrder: any) => ({
//         ...prevOrder,
//         status: action === "cancel" ? "canceled" : "shipped",
//       }));
//     } catch (err) {
//       setError("Failed to update order status. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <DashboardLayout>
//         <div className="p-6">
//           <p>Loading order details...</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardLayout>
//         <div className="p-6">
//           <p className="text-red-500">{error}</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (!order) {
//     return (
//       <DashboardLayout>
//         <div className="p-6">
//           <p>Order not found.</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

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
//                 Order {order.id.slice(0, 5)}

//               </h1>
//               <p className="text-sm text-gray-500">
//                 Placed on {new Date(order.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => handleAction("cancel")}
//               disabled={isProcessing}
//               className="px-4 py-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 
//                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <span className="flex items-center gap-2">
//                 <XCircle className="w-4 h-4" />
//                 Cancel Order
//               </span>
//             </motion.button>

            
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-3 gap-6">
//           {/* Left Column - Order Details */}
//           <div className="col-span-2 space-y-6">
//             <div className="bg-white rounded-2xl border border-gray-100">
//               <div className="p-6">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                   Order Items
//                 </h2>
//                 <div className="space-y-4">
//                   {order.items.map((item: any) => (
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
//                             ${Number(item.price * item.quantity).toFixed(2)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
//                   <div className="text-right">
//                     <p className="text-sm text-gray-500">Total Amount</p>
//                     <p className="text-lg font-semibold text-gray-900">
//                       KES{Number(order.total).toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl border border-gray-100">
//               <div className="p-6">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                   Order Timeline
//                 </h2>
//                 <Timeline
//             currentStatus={currentStatus}
//             updateStatus={updateStatus}
//             isProcessing={isProcessing}
//           />
//               </div>
//             </div>

//           </div>

          

          

//           {/* Right Column - Customer Details */}
//           <div className="space-y-6">
//           <div className="bg-white rounded-2xl border border-gray-100">
//               <div className="p-6">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                   Status
//                 </h2>
//                 <OrderStatusBadge status={order.status} />
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl border border-gray-100">
//               <div className="p-6">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                   Customer Details
//                 </h2>
//                 <div className="space-y-4">
//                   <div className="text-sm">
//                     <p className="text-gray-500">Name</p>
//                     <p className="font-medium text-gray-900">
//                       {order.customerName}
//                     </p>
//                   </div>
//                   <div className="text-sm">
//                     <p className="text-gray-500">Email</p>
//                     <p className="font-medium text-gray-900">
//                      {order.customerEmail}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// type OrderStatus = "processing" | "shipped" | "canceled";

// interface OrderStatusBadgeProps {
//   status: OrderStatus;
// }

// function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
//   const statusStyles: Record<OrderStatus, string> = {
//     processing: "bg-yellow-50 text-yellow-700 border-yellow-100",
//     shipped: "bg-green-50 text-green-700 border-green-100",
//     canceled: "bg-red-50 text-red-700 border-red-100",
//   };

//   return (
//     <span
//       className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}
//     >
//       {status.charAt(0).toUpperCase() + status.slice(1)}
//     </span>
//   );
// }

// const STATUS_FLOW = [
//   { key: "PENDING", label: "Pending", icon: Clock },
//   { key: "PROCESSING", label: "Processing", icon: Package },
//   { key: "SHIPPED", label: "Shipped", icon: Truck },
//   { key: "DELIVERED", label: "Delivered", icon: CheckCircle },
//   { key: "COMPLETED", label: "Completed", icon: Flag },
// ];

// function Timeline({ currentStatus, updateStatus, isProcessing }: any) {
//   const currentIndex = STATUS_FLOW.findIndex((status) => status.key === currentStatus);

//   return (
//     <div className="space-y-6">
//       {STATUS_FLOW.map((status, index) => {
//         const isCompleted = index < currentIndex;
//         const isActive = index === currentIndex;
//         const isNext = index === currentIndex + 1;

//         return (
//           <div
//             key={status.key}
//             className={`flex items-center gap-4 p-4 rounded-lg border ${
//               isCompleted
//                 ? "border-green-500 bg-green-50"
//                 : isActive
//                 ? "border-primary-500 bg-primary-50"
//                 : "border-primary-200 bg-gray-50"
//             }`}
//           >
//             <div
//               className={`p-3 rounded-full ${
//                 isCompleted
//                   ? "bg-green-500 text-white"
//                   : isActive
//                   ? "bg-primary-500 text-white"
//                   : "bg-gray-300 text-gray-600"
//               }`}
//             >
//               <status.icon className="w-5 h-5" />
//             </div>

//             <div className="flex-1">
//               <p className="font-semibold text-gray-900">{status.label}</p>
//               {isActive && <p className="text-sm text-gray-500">Current Status</p>}
//             </div>

//             {isNext && (
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => updateStatus(status.key)}
//                 disabled={isProcessing}
//                 className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Mark as {status.label}
//               </motion.button>
//             )}
//           </div>
//         );
//       })}
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