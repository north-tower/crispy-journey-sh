"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  
  Store,
  LogOut,
  CreditCard,
  Shield,
  Gift,
  HelpCircle,
} from "lucide-react";

interface ProfileMenuProps {
  profile: {
    initials: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export function ProfileMenu({ profile }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      icon: User,
      label: "Profile Settings",
      description: "Manage your account",
      onClick: () => console.log("Profile clicked"),
    },
    {
      icon: Store,
      label: "Your Store",
      description: "View store performance",
      onClick: () => console.log("Store clicked"),
    },
    {
      icon: CreditCard,
      label: "Billing",
      description: "Manage billing and invoices",
      onClick: () => console.log("Billing clicked"),
    },
    {
      icon: Shield,
      label: "Security",
      description: "Configure security settings",
      onClick: () => console.log("Security clicked"),
    },
    {
      icon: Gift,
      label: "Rewards",
      description: "View your rewards and points",
      onClick: () => console.log("Rewards clicked"),
      badge: "New",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help with Shopeazz",
      onClick: () => console.log("Help clicked"),
    },
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white cursor-pointer shadow-lg shadow-primary-100/50">
          <span className="font-medium text-sm">{profile.initials}</span>
        </div>
        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
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
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50"
            >
              {/* Profile Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white">
                    <span className="font-medium">{profile.initials}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {profile.name}
                    </h4>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {profile.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={item.onClick}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-gray-50 transition-colors relative"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50">
                      <item.icon className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    {item.badge && (
                      <span className="absolute right-3 top-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Logout Button */}
              <div className="p-2 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50">
                    <LogOut className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium">Log Out</p>
                    <p className="text-xs text-red-500">
                      Sign out of your account
                    </p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
