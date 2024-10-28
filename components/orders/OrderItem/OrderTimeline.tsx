// components/orders/OrderItem/OrderTimeline.tsx
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface OrderTimelineProps {
  orderId: string;
}

export function OrderTimeline({ orderId }: OrderTimelineProps) {
  // Mock timeline data
  const timeline = [
    {
      status: "Order Placed",
      date: "2024-02-20T10:00:00Z",
      completed: true,
    },
    {
      status: "Payment Confirmed",
      date: "2024-02-20T10:05:00Z",
      completed: true,
    },
    {
      status: "Processing",
      date: "2024-02-20T11:30:00Z",
      completed: true,
    },
    {
      status: "Ready for Shipping",
      date: "2024-02-21T09:00:00Z",
      completed: false,
    },
    {
      status: "Delivered",
      date: "2024-02-22T00:00:00Z",
      completed: false,
    },
  ];

  return (
    <div className="space-y-4">
      {timeline.map((event, index) => (
        <div key={index} className="flex items-start gap-3">
          <div
            className={`p-2 rounded-full ${
              event.completed ? "bg-primary-50" : "bg-gray-50"
            }`}
          >
            <CheckCircle2
              className={`w-4 h-4 ${
                event.completed ? "text-primary-500" : "text-gray-400"
              }`}
            />
          </div>
          <div>
            <p
              className={`text-sm font-medium ${
                event.completed ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {event.status}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(event.date).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
