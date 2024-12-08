import { CreditCard } from "lucide-react";
import { SettingItem } from "./SettingItem";

export function StorePayment({ storeData }) {
  const { paymentMethods } = storeData; // Extract paymentMethods from storeData

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Payment Settings
      </h2>

      <div className="space-y-4">
        {paymentMethods && paymentMethods.length > 0 ? (
          paymentMethods.map((method, index) => (
            <SettingItem
              key={index}
              icon={CreditCard}
              title={method} // Use the payment method name as the title
              description={`Configure settings for ${method}`}
              action={{
                label: "Edit",
                onClick: () => {
                  console.log(`Editing ${method}`); // Replace with actual functionality
                },
              }}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No payment methods configured.</p>
        )}
      </div>
    </div>
  );
}
