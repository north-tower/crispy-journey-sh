// app/terms/page.tsx

import { PolicyLayout } from "@/components/common/PolicyLayout";

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms of Service" lastUpdated="October 27, 2024">
      <h2>1. Account Terms</h2>
      <p>
        By creating an account, you agree to provide accurate and complete
        information. You are responsible for maintaining the security of your
        account and password.
      </p>

      <h2>2. General Conditions</h2>
      <p>
        We reserve the right to refuse service to anyone for any reason at any
        time. You understand that your content may be transferred unencrypted
        and involve:
      </p>
      <ul>
        <li>Transmissions over various networks</li>
        <li>Changes to conform and adapt to technical requirements</li>
      </ul>

      {/* Add more sections as needed */}
    </PolicyLayout>
  );
}
