"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Package,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface Notification {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Order Completed",
      message: "Order #12345 has been successfully delivered",
      time: "2 min ago",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Low Stock Alert",
      message: 'Product "Gaming Mouse" is running low on stock',
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "info",
      title: "New Feature Available",
      message: "Check out our new analytics dashboard",
      time: "2 hours ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertCircle;
      case "info":
        return Package;
      default:
        return CreditCard;
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-100 rounded-full"
      >
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 h-2 w-2 bg-primary-500 rounded-full ring-2 ring-white"
          />
        )}
        <Bell className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notifications
                  </h3>
                  <button onClick={() => setIsOpen(false)}>
                    <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  You have {unreadCount} unread notifications
                </p>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {notifications.map((notification) => {
                  const Icon = getIcon(notification.type);
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      whileHover={{ x: 4, backgroundColor: "rgb(249 250 251)" }}
                      className={cn(
                        "p-4 border-b border-gray-50 last:border-0",
                        !notification.read && "bg-primary-50/50"
                      )}
                    >
                      <div className="flex gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            notification.type === "success" && "bg-green-100",
                            notification.type === "warning" && "bg-amber-100",
                            notification.type === "info" && "bg-blue-100"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-5 h-5",
                              notification.type === "success" &&
                                "text-green-600",
                              notification.type === "warning" &&
                                "text-amber-600",
                              notification.type === "info" && "text-blue-600"
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.map((n) => ({ ...n, read: true }))
                    )
                  }
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Mark all as read
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
