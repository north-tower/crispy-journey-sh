"use client";

import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      setSidebarOpen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="flex h-screen font-mono bg-gray-50/30">
      {/* Backdrop for mobile */}
      <AnimatePresence mode="wait">
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: sidebarOpen ? "256px" : "0px",
          x: sidebarOpen ? 0 : -256,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className={`fixed lg:static h-full z-30 ${
          !sidebarOpen && "w-0"
        } overflow-hidden`}
      >
        <Sidebar />
      </motion.div>

      {/* Main Content */}
      <motion.div
        layout
        className="flex-1 flex flex-col min-w-0"
        animate={{
          marginLeft: !isMobile && sidebarOpen ? "0px" : "0px",
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
      >
        <Header
          sidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-auto">
          <motion.div
            layout
            className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            <div className="relative z-10 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              {children}
            </div>
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}
