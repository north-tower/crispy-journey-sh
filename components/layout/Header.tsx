// components/layout/Header.tsx
"use client";

import { useState } from "react";
import { HeaderProps } from "@/types/header";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Menu,
  X,
  Command,
  Calendar,
  Settings,
  HelpCircle,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { SearchBar } from "./SearchBar";

export function Header({ sidebarOpen, onMenuClick }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const quickActions = [
    { icon: Calendar, label: "Calendar", shortcut: "⌘K C" },
    { icon: Settings, label: "Settings", shortcut: "⌘K S" },
    { icon: HelpCircle, label: "Help Center", shortcut: "⌘K H" },
    { icon: Mail, label: "Inbox", shortcut: "⌘K I" },
  ];

  return (
    <motion.header
      layout
      className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-100 font-mono"
    >
      <div className="mx-auto">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuClick}
              className="p-2 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <motion.div
                animate={{ rotate: sidebarOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {sidebarOpen ? (
                  <Menu className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </motion.div>
            </motion.button>

            {/* Enhanced Search Bar */}
            <SearchBar />
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-100 rounded-full"
            >
              <span className="absolute top-2 right-2 h-2 w-2 bg-primary-500 rounded-full ring-2 ring-white" />
              <Bell className="w-5 h-5" />
            </motion.button>

            {/* Profile Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative ml-2"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white cursor-pointer shadow-lg shadow-primary-100/50">
                <span className="font-medium text-sm">JD</span>
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
