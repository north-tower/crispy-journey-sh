// components/auth/RegisterForm.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "react-toastify";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone") || undefined,
      role: "SELLER", // Adjust this based on the user's role (e.g., EMPLOYEE)
      companyId: formData.get("companyId") || undefined,
      employeeId: formData.get("employeeId") || undefined,
    };

    try {
      const response = await fetch(`http://localhost:8900/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register.");
      }

      
      toast.success("Registration successful! Check your email for the verification link.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
        />
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-400"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          I agree to the{" "}
          <Link
            href="/terms"
            className="text-primary-600 hover:text-primary-500"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-primary-600 hover:text-primary-500"
          >
            Privacy Policy
          </Link>
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={isLoading}
        className={`relative w-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-primary-600 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg
              className="h-5 w-5 animate-spin text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </motion.div>
        ) : (
          "Create account"
        )}
      </motion.button>

      <div className="text-center">
        <span className="text-sm text-gray-600">Already have an account? </span>
        <Link
          href="/auth/login"
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}

