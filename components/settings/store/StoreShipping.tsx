import { Truck, Clock } from "lucide-react";
import { SettingItem } from "./SettingItem";

export function StoreShipping({ storeData }) {
  const { shippingZones, processingTime } = storeData;

  const settings = [
    {
      icon: Truck,
      title: "Shipping Zones",
      description: `Currently configured for: ${shippingZones.join(", ")}`,
      action: {
        label: "Manage",
        onClick: () => {
          console.log("Managing shipping zones"); // Replace with actual functionality
        },
      },
    },
    {
      icon: Clock,
      title: "Processing Time",
      description: `Current processing time: ${processingTime}`,
      action: {
        label: "Configure",
        onClick: () => {
          console.log("Configuring processing time"); // Replace with actual functionality
        },
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
