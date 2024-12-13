"use client";

import { useEffect, useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const user = searchParams.get("username");
    setUsername(user);
  }, [searchParams]);

  return (
    <AuthLayout
      title={`Welcome back${username ? `, ${username}` : ""}`}
      subtitle="Sign in to your account to continue"
    >
      <LoginForm />
    </AuthLayout>
  );
}
