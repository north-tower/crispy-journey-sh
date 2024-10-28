import { CreditCard } from "lucide-react";
import { SettingItem } from "./SettingItem";

export function StorePayment() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Payment Settings
      </h2>

      <SettingItem
        icon={CreditCard}
        title="Payment Methods"
        description="Manage accepted payment methods"
        action={{
          label: "Configure",
          onClick: () => {},
        }}
      />
    </div>
  );
}
