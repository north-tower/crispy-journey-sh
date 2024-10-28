import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SettingItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action: {
    label: string;
    onClick: () => void;
  };
}

export function SettingItem({
  icon: Icon,
  title,
  description,
  action,
}: SettingItemProps) {
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
        onClick={action.onClick}
        className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 
          transition-colors"
      >
        {action.label}
      </motion.button>
    </div>
  );
}
