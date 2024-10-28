// components/settings/account/AccountProfile.tsx
import { motion } from "framer-motion";

export function AccountProfile() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Profile Information
      </h2>

      <div className="flex items-center gap-6 mb-6">
        <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center">
          <span className="text-2xl font-semibold text-primary-600">JS</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl 
            hover:border-gray-300 transition-colors"
        >
          Change Avatar
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-500 mb-2">Full Name</label>
          <input
            type="text"
            defaultValue="John Smith"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none 
              focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-2">
            Email Address
          </label>
          <input
            type="email"
            defaultValue="john.smith@example.com"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none 
              focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
          />
        </div>
      </div>
    </div>
  );
}
