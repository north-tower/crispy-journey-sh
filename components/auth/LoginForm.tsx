"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";


export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Optional state for "Remember me"

  const login = useAuthStore((state) => state.login);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      router.push('/')
      // Show success toast
      toast.success("Login successful!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
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
            autoComplete="current-password"
            required
            className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe((prev) => !prev)}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-400"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-700"
          >
            Remember me
          </label>
        </div>

        <Link
          href="/auth/forgot-password"
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Forgot password?
        </Link>
      </div>

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
          "Sign in"
        )}
      </motion.button>

      <div className="text-center">
        <span className="text-sm text-gray-600">Don't have an account? </span>
        <Link
          href="/auth/register"
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
