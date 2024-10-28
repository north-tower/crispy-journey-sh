// components/settings/account/AccountSecurity.tsx
import { Lock, LucideIcon, Shield } from "lucide-react";
import { motion } from "framer-motion";

export function AccountSecurity() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Security</h2>

      <div className="space-y-4">
        <SecurityItem
          icon={Lock}
          title="Password"
          description="Last changed 3 months ago"
          action={{
            label: "Change Password",
            onClick: () => {},
            variant: "secondary",
          }}
        />

        <SecurityItem
          icon={Shield}
          title="Two-Factor Authentication"
          description="Add an extra layer of security"
          action={{
            label: "Enable 2FA",
            onClick: () => {},
            variant: "primary",
          }}
        />
      </div>
    </div>
  );
}

interface SecurityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action: {
    label: string;
    onClick: () => void;
    variant: "primary" | "secondary";
  };
}

function SecurityItem({
  icon: Icon,
  title,
  description,
  action,
}: SecurityItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`px-4 py-2 text-sm rounded-xl transition-colors ${
          action.variant === "primary"
            ? "bg-primary-500 text-white hover:bg-primary-600"
            : "border border-gray-200 text-gray-600 hover:border-gray-300"
        }`}
        onClick={action.onClick}
      >
        {action.label}
      </motion.button>
    </div>
  );
}

// components/settings/account/AccountNotifications.tsx
import { Bell } from "lucide-react";

export function AccountNotifications() {
  const notifications = [
    { id: "orders", label: "Order updates" },
    { id: "features", label: "New features" },
    { id: "marketing", label: "Marketing emails" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Notification Preferences
      </h2>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-gray-600">{item.label}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div
                className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-100 
                rounded-full peer peer-checked:after:translate-x-full after:content-[''] 
                after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full 
                after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
