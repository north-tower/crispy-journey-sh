// components/orders/OrderItem/index.tsx
"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Package,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  RefreshCcw,
  Printer,
  AlertCircle,
  LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { OrderTimeline } from "./OrderTimeline";
import { OrderActions } from "./OrderActions";
import { Order } from "@/types/orders";

interface OrderItemProps {
  order: Order;
}

export function OrderItem({ order }: OrderItemProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to orders
            </button>
            <OrderStatus status={order.status} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Order #{order.orderNumber}
              </h1>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <OrderActions order={order} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${item.total.toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center p-4 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Timeline
              </h2>
              <OrderTimeline orderId={order.id} />
            </div>
          </div>
        </div>

        {/* Right Column - Customer & Shipping Info */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Customer
              </h2>
              <div className="space-y-4">
                <InfoItem icon={User} label="Name" value={order.customerName} />
                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={order.customerEmail}
                />
                <InfoItem
                  icon={CreditCard}
                  label="Payment"
                  value={order.paymentStatus}
                />
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Details
              </h2>
              <div className="space-y-4">
                <InfoItem
                  icon={MapPin}
                  label="Address"
                  value={order.shippingAddress}
                />
                {order.expectedDelivery && (
                  <InfoItem
                    icon={Clock}
                    label="Expected Delivery"
                    value={new Date(
                      order.expectedDelivery
                    ).toLocaleDateString()}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Notes
                </h2>
                <p className="text-sm text-gray-500">{order.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gray-50 rounded-lg">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function OrderStatus({ status }: { status: Order["status"] }) {
  const statusStyles = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
    processing: "bg-blue-50 text-blue-700 border-blue-100",
    ready: "bg-green-50 text-green-700 border-green-100",
    shipped: "bg-purple-50 text-purple-700 border-purple-100",
  };

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full border ${statusStyles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
