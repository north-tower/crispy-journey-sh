// components/shared/PolicyLayout.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function PolicyLayout({
  title,
  lastUpdated,
  children,
}: PolicyLayoutProps) {
  return (
    <div className="min-h-screen font-mono bg-gradient-to-br from-white to-primary-50">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Sign Up
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl border border-gray-100 bg-white/80 p-8 shadow-xl backdrop-blur-sm"
        >
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-600">
            Last updated: {lastUpdated}
          </p>

          <div className="prose prose-primary mt-8 max-w-none">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
