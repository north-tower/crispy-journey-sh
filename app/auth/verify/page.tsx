"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function VerifyPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [loginUrl, setLoginUrl] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    async function verifyEmail() {
      try {
        const response = await fetch(`http://localhost:8900/api/auth/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to verify email.");
        }

        const data = await response.json();

        setStatus("success");
        setMessage("Verification successful! You can now proceed to login.");
        setLoginUrl(data.loginUrl); // loginUrl now includes the username
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "An error occurred during verification.");
      }
    }

    verifyEmail();
  }, [searchParams]);

  return (
    <AuthLayout
      title="Email Verification"
      subtitle={status === "loading" ? "We’re verifying your email address. Please wait..." : ""}
    >
      <div className="text-center">
        {status === "loading" && (
          <p className="text-sm text-gray-600">Verifying your email...</p>
        )}
        {status === "error" && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-red-600">{message}</p>
          </div>
        )}
        {status === "success" && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-green-600">{message}</p>
            {loginUrl && (
              <button
                onClick={() => router.push(loginUrl)}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary-500 focus:ring-2 focus:ring-primary-400"
              >
                Proceed to Login
              </button>
            )}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
