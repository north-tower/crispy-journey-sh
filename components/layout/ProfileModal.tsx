// components/layout/ProfileModal.tsx

import { useAuthStore } from "@/lib/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { User, Store, LogOut, HelpCircle, X } from "lucide-react";



interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name: string;
    role: string;
    initials: string;
  };
}

export function ProfileModal({ isOpen, onClose, profile }: ProfileModalProps) {
 
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
  };
  const menuItems = [
    {
      icon: User,
      label: "My Profile",
      description: "Manage your account",
      onClick: () => console.log("Profile clicked"),
    },
    {
      icon: Store,
      label: "Store Settings",
      description: "Manage your store",
      onClick: () => console.log("Store clicked"),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help with Shopeazz",
      onClick: () => console.log("Help clicked"),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-20 left-6 z-50 w-72 bg-white rounded-2xl shadow-xl border border-gray-100"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Account</h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-medium">
                  {profile.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {profile.name}
                  </p>
                  <p className="text-xs text-gray-500">{profile.role}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item, ) => (
                <motion.button
                  key={item.label}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-50">
                    <item.icon className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-gray-100">
              <motion.button onClick={handleLogout}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm hover:bg-red-50 text-red-600 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50">
                  <LogOut className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p onClick={handleLogout} className="font-medium">Log Out</p>
                  <p className="text-xs opacity-75">Sign out of your account</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
