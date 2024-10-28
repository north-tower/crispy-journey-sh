// app/privacy/page.tsx

import { PolicyLayout } from "@/components/common/PolicyLayout";

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="October 27, 2024">
      <h2>1. Information We Collect</h2>
      <p>
        We collect information you provide directly to us when you create an
        account, make a purchase, or communicate with us. This may include:
      </p>
      <ul>
        <li>Name and contact information</li>
        <li>Payment information</li>
        <li>Shipping addresses</li>
        <li>Communication preferences</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use the information we collect to provide, maintain, and improve our
        services, including:
      </p>
      <ul>
        <li>Processing your orders and payments</li>
        <li>Sending order confirmations and updates</li>
        <li>Providing customer support</li>
        <li>Personalizing your shopping experience</li>
      </ul>

      {/* Add more sections as needed */}
    </PolicyLayout>
  );
}
