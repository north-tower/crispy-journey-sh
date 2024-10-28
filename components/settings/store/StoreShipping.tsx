// components/settings/store/StoreShipping.tsx
import { Truck, Clock } from "lucide-react";
import { SettingItem } from "./SettingItem";

export function StoreShipping() {
  const settings = [
    {
      icon: Truck,
      title: "Shipping Zones",
      description: "Configure shipping rates and zones",
      action: {
        label: "Manage",
        onClick: () => {},
      },
    },
    {
      icon: Clock,
      title: "Processing Time",
      description: "Set order processing timeframes",
      action: {
        label: "Configure",
        onClick: () => {},
      },
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Shipping Settings
      </h2>

      <div className="space-y-4">
        {settings.map((setting, index) => (
          <SettingItem key={index} {...setting} />
        ))}
      </div>
    </div>
  );
}
