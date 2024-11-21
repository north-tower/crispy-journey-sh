"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { navigation } from "@/types/navigation";
import { ProfileModal } from "./ProfileModal";

interface ProfileProps {
  name: string;
  role: string;
  initials: string;
}

const profile: ProfileProps = {
  name: "John Smith",
  role: "Store Owner",
  initials: "JS",
};

export function Sidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProfileModalOpen(true);
  };

  const toggleSection = (name: string) => {
    setOpenSections((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="w-64 h-screen font-mono bg-white border-r border-gray-100 flex flex-col">
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-primary-100">
            S
          </div>
          <span className="text-lg font-semibold text-gray-900">Shopeazz</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              // If it has children, use button for dropdown
              <motion.button
                onClick={() => toggleSection(item.name)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm transition-all duration-200",
                  pathname === item.href
                    ? "bg-primary-50 text-primary-600 shadow-sm shadow-primary-100"
                    : "text-gray-600 hover:bg-gray-50/80"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      pathname === item.href
                        ? "text-primary-500"
                        : "text-primary-400"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 text-primary-400",
                    openSections.includes(item.name) && "transform rotate-180"
                  )}
                />
              </motion.button>
            ) : (
              // If it doesn't have children, use Link for navigation
              <Link href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={cn(
                    "w-full flex items-center px-4 py-2.5 rounded-full text-sm transition-all duration-200",
                    pathname === item.href
                      ? "bg-primary-50 text-primary-600 shadow-sm shadow-primary-100"
                      : "text-gray-600 hover:bg-gray-50/80",
                    "hover:translate-x-1"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        pathname === item.href
                          ? "text-primary-500"
                          : "text-primary-400"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                </motion.div>
              </Link>
            )}

            {/* Submenu */}
            <AnimatePresence>
              {item.children && openSections.includes(item.name) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-11 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <motion.div
                        key={child.name}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Link
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2 py-2 px-4 text-sm rounded-full transition-all duration-200",
                            pathname === child.href
                              ? "text-primary-600 bg-primary-50 shadow-sm shadow-primary-100"
                              : "text-gray-500 hover:text-primary-600 hover:bg-gray-50/80"
                          )}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                          {child.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="p-4 mt-auto">
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={handleProfileClick}
          className="flex items-center gap-3 p-2 rounded-full bg-gray-50 cursor-pointer group transition-all duration-200 hover:bg-gray-100"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-medium shadow-lg shadow-primary-100">
            {profile.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{profile.role}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors duration-200" />
        </motion.div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
      />
    </div>
  );
}
