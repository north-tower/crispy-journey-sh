// app/settings/account/page.tsx
"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AccountProfile } from "@/components/settings/account/AccountProfile";
import {
  AccountNotifications,
  AccountSecurity,
} from "@/components/settings/account/AccountSecurity";
import { User } from "lucide-react";
import { useMemo } from "react";

export default function AccountSettings() {
  // Memoize the account components to reduce unnecessary re-renders
  const profileComponent = useMemo(() => <AccountProfile />, []);
  const securityComponent = useMemo(() => <AccountSecurity />, []);
  const notificationsComponent = useMemo(() => <AccountNotifications />, []);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-primary-50 rounded-xl">
            <User className="w-5 h-5 text-primary-500" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Account Settings
          </h1>
        </div>

        <div className="space-y-6">
          {profileComponent}
          {securityComponent}
          {notificationsComponent}
        </div>
      </div>
    </DashboardLayout>
  );
}
